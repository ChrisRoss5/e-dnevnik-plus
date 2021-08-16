export async function addStyleTag(
  doc: Document,
  url: string,
  customStyle: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const docHead = doc.getElementsByTagName("head")[0];
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.onload = () => {
      const newStyle = document.createElement("style");
      newStyle.setAttribute("type", "text/css");
      newStyle.textContent = customStyle;
      docHead.appendChild(newStyle);
      resolve();
    };
    docHead.appendChild(link);
  });
}

export function parseDoc(html: string, baseUri: string): Document {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const base = doc.createElement("base");
  base.href = baseUri;
  doc.head.appendChild(base);
  return doc;
}

export function formEncodedBody(obj: Record<string, string>): string {
  return Object.keys(obj)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
    .join("&");
}

export function getElText(el: Element | null): string {
  return el ? (el.textContent as string).trim() : "";
}

export function parseNum(num: string): number {
  return parseFloat(num.replace(",", "."));
}

export function formatNum(num: number | string): string {
  let str = "";
  if (typeof num == "number") {
    if (isNaN(num)) return "—";
    str = num.toFixed(2).toString();
  }
  return str.replace(".", ",");
}

export function formatGradeText(num: number): string {
  return [
    null,
    "Nedovoljan (1)",
    "Dovoljan (2)",
    "Dobar (3)",
    "Vrlo dobar (4)",
    "Odličan (5)",
  ][num]!;
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1) || "";
}

export function numberToColorHsl(i: number) {
  const hue = (i * 1.2) / 360;
  const rgb = hslToRgb(hue, 1, 0.5);
  return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
}

const colors = ["#FF3924", "#FF9600", "#FFE500", "#84FF33", "#2ab62a"];
export function getSubjectColors(
  grades: number[] | number[][],
  gradesCount?: number,
) {
  let perc = 0;
  let linearGradient;
  if (grades.length == 5) {
    grades = grades as number[];
    if (grades.every((val) => !val)) return "transparent";
    linearGradient = grades.map((val, i) => {
      const toAdd = (val / (gradesCount as number)) * 100;
      if (!toAdd) return "transparent";
      const start = colors[i] + " " + (perc + (perc ? 1 : 0)) + "%,";
      perc += toAdd;
      return start + colors[i] + " " + (perc - 1) + "%";
    });
  } else {
    linearGradient = (grades as number[][]).map((col) => {
      const color = col.length
        ? numberToColorHsl(
            (col.reduce((a, b) => a + b, 0) / col.length / 5) * 100,
          )
        : "transparent";
      const start = color + " " + (perc + (perc ? 5 : 0)) + "%,";
      perc += 10;
      return start + color + " " + (perc - 5) + "%";
    });
  }
  return "linear-gradient(90deg," + linearGradient.join(",") + ")";
}

export function setEndOfContenteditable(contentEditableElement: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
