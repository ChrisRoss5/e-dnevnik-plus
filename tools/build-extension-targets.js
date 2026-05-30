const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const baseDir = path.join(rootDir, "dist");
const extensionSourceDir = path.join(rootDir, "src", "extension");

const HOST_PERMISSIONS = [
  "*://*/*",
];

const targets = {
  chrome: {
    outputDir: "dist-chrome",
    background: { service_worker: "service-worker.js" },
  },
  edge: {
    outputDir: "dist-edge",
    background: { service_worker: "service-worker.js" },
  },
  firefox: {
    outputDir: "dist-firefox",
    background: { scripts: ["service-worker.js"] },
    browser_specific_settings: {
      gecko: {
        id: "dev@ednevnik.plus",
        strict_min_version: "142.0",
        data_collection_permissions: {
          required: ["personallyIdentifyingInfo", "websiteContent"],
          optional: ["technicalAndInteraction"],
        },
      },
    },
  },
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function copySourceToBase() {
  fs.mkdirSync(baseDir, { recursive: true });
  fs.cpSync(extensionSourceDir, baseDir, { recursive: true });
}

function copyBaseToTarget(outputDir) {
  const targetDir = path.join(rootDir, outputDir);
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.cpSync(baseDir, targetDir, {
    recursive: true,
    filter: (src) => !src.includes(`${path.sep}_metadata${path.sep}`),
  });
  return targetDir;
}

function buildManifest(target) {
  const manifest = readJson(path.join(extensionSourceDir, "manifest.json"));
  manifest.host_permissions = HOST_PERMISSIONS;
  manifest.background = target.background;
  manifest.icons = {
    16: "assets/img/logo-16.png",
    48: "assets/img/logo-48.png",
    128: "assets/img/logo.png",
  };
  manifest.web_accessible_resources = [
    {
      resources: ["app/index.html", "app/*", "assets/*"],
      matches: ["<all_urls>"],
    },
  ];
  if (target.browser_specific_settings) {
    manifest.browser_specific_settings = target.browser_specific_settings;
  } else {
    delete manifest.browser_specific_settings;
  }
  return manifest;
}

function resizeIcon(targetDir, size, sourceName, outputName) {
  const imageDir = path.join(targetDir, "assets", "img");
  const sourcePath = path.join(imageDir, sourceName);
  const outputPath = path.join(imageDir, outputName);
  fs.copyFileSync(sourcePath, outputPath);
  try {
    execFileSync("sips", ["-z", String(size), String(size), outputPath], {
      stdio: "ignore",
    });
  } catch {
    console.warn(`Could not resize ${outputName}; install sips or provide ${size}x${size} icon manually.`);
  }
}

function buildRules() {
  return [
    {
      id: 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { extensionPath: "/app/index.html" },
      },
      condition: {
        urlFilter: "||ocjene.skole.hr/",
        resourceTypes: ["main_frame"],
      },
    },
    {
      id: 2,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "x-frame-options", operation: "remove" },
          { header: "frame-options", operation: "remove" },
        ],
      },
      condition: {
        resourceTypes: ["sub_frame"],
        domains: ["bcnccmamhmcabokipgjechdeealcmdbe"],
      },
    },
  ];
}

function ensureTarget(target) {
  const targetDir = copyBaseToTarget(target.outputDir);
  resizeIcon(targetDir, 16, "logo-light.png", "logo-16.png");
  resizeIcon(targetDir, 48, "logo.png", "logo-48.png");
  writeJson(path.join(targetDir, "manifest.json"), buildManifest(target));
  writeJson(path.join(targetDir, "rules.json"), buildRules());
  return target.outputDir;
}

function clean() {
  [
    "dist",
    ...Object.values(targets).map((target) => target.outputDir),
    "web-ext-artifacts",
  ].forEach((outputDir) => {
    fs.rmSync(path.join(rootDir, outputDir), { recursive: true, force: true });
  });
}

function assertBaseBuild() {
  [
    "manifest.json",
    "rules.json",
    "content-script.js",
    "service-worker.js",
    "app/index.html",
    "popup/popup.html",
  ].forEach((relativePath) => {
    const filePath = path.join(baseDir, relativePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`${relativePath} is missing from dist. Run npm run build:base first.`);
    }
  });
}

function buildTargets() {
  assertBaseBuild();
  const outputs = Object.values(targets).map((target) => ensureTarget(target));
  console.log(`Generated extension targets: ${outputs.join(", ")}`);
}

function main() {
  const command = process.argv[2] || "targets";

  if (command === "clean") {
    clean();
    return;
  }

  if (command === "prepare-base") {
    copySourceToBase();
    return;
  }

  if (command === "targets") {
    buildTargets();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main();
