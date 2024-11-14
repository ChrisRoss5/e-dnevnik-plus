function getAverageFromArray(arr: number[]): string {
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return avg ? avg.toFixed(2) : "—";
}

function addClass(el: HTMLElement, className: string, condition: boolean) {
  condition ? el.classList.add(className) : el.classList.remove(className);
}

const getSHA256Hash = async (input: string) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};
