import { useToast } from "vue-toastification";

const toast = useToast();
const parser = new DOMParser();
const loginUrl = "https://ocjene.skole.hr/login";

function formEncodedBody(obj: Record<string, string>): string {
  return Object.keys(obj)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
    .join("&");
}

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  const fetch1 = await fetch(loginUrl);
  if (!fetch1.url.includes("login")) return true; // User is already signed in
  console.log("PRIJAVA");
  const loginPage = await fetch1.text();
  const loginDocument = parser.parseFromString(loginPage, "text/html");
  const csrfElement = loginDocument.getElementsByName("csrf_token")[0];
  if (!csrfElement) {
    toast.error("Greška u prijavi: Nedostaje CSRF!");
    return false;
  }
  const csrf_token = (csrfElement as HTMLInputElement).value;
  const fetch2 = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formEncodedBody({ username, password, csrf_token }),
  });
  return !fetch2.url.includes("login");
}

export async function getSubjects() {
  return "hi";
}
