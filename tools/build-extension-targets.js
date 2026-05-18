const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "dist");

const HOST_PERMISSIONS = [
  "*://ocjene.skole.hr/*",
  "https://ednevnik.plus/*",
  "https://e-dnevnik-plus.firebaseio.com/*",
  "https://www.google-analytics.com/*",
  "https://raw.githubusercontent.com/ChrisRoss5/e-Dnevnik-Plus/*",
];

const targets = {
  chrome: {
    outputDir: "dist-chrome-dev",
    background: { service_worker: "service-worker.js" },
  },
  edge: {
    outputDir: "dist-edge-dev",
    background: { service_worker: "service-worker.js" },
  },
  firefox: {
    outputDir: "dist-firefox-dev",
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

function copySourceToTarget(outputDir) {
  const targetDir = path.join(rootDir, outputDir);
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.cpSync(sourceDir, targetDir, {
    recursive: true,
    filter: (src) => !src.includes(`${path.sep}_metadata${path.sep}`),
  });
  return targetDir;
}

function buildManifest(target) {
  const manifest = readJson(path.join(sourceDir, "manifest.json"));
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
      matches: ["*://ocjene.skole.hr/*"],
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
        urlFilter: "||ocjene.skole.hr/",
        resourceTypes: ["sub_frame"],
      },
    },
  ];
}

function patchPopup(targetDir, browserName) {
  const popupPath = path.join(targetDir, "popup", "popup.html");
  let popup = fs.readFileSync(popupPath, "utf8");
  popup = popup.replace(
    /<a id="rate-me"[\s\S]*?<\/a>/,
    `<a id="rate-me" href="#" style="display: none">Dev build (${browserName})</a>`,
  );
  fs.writeFileSync(popupPath, popup);
}

function ensureTarget(targetName, target) {
  const targetDir = copySourceToTarget(target.outputDir);
  resizeIcon(targetDir, 16, "logo-light.png", "logo-16.png");
  resizeIcon(targetDir, 48, "logo.png", "logo-48.png");
  writeJson(path.join(targetDir, "manifest.json"), buildManifest(target));
  writeJson(path.join(targetDir, "rules.json"), buildRules());
  patchPopup(targetDir, targetName);
  return target.outputDir;
}

function main() {
  if (!fs.existsSync(path.join(sourceDir, "manifest.json"))) {
    throw new Error("dist/manifest.json is missing. Build the extension base output first.");
  }

  const outputs = Object.entries(targets).map(([targetName, target]) =>
    ensureTarget(targetName, target),
  );
  console.log(`Generated prototype extension targets: ${outputs.join(", ")}`);
}

main();
