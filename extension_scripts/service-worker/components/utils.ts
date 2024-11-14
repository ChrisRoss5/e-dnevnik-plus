function cmpVersions(a: string, b: string) {
  /* Return values:
    - a number < 0 if a < b
    - a number > 0 if a > b
    - 0 if a = b */
  const segmentsA = a.replace(/(\.0+)+$/, "").split(".");
  const segmentsB = b.replace(/(\.0+)+$/, "").split(".");
  for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
    const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
    if (diff) return diff;
  }
  return segmentsA.length - segmentsB.length;
}

const getSHA256Hash = async (input: string) => {
  const textAsBuffer = new TextEncoder().encode(input);
  // window is not defined in the service worker!
  const hashBuffer = await crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};
