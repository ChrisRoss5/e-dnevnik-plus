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
