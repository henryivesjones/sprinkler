export const makeURL = (path: string) => {
  const prefix =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
      ? "http://localhost:8476"
      : "";
  return prefix + path;
};

export async function wFetch(path: string, init?: RequestInit) {
  return fetch(makeURL(path), init).then((res) => {
    if (!res.ok) {
      return res.json().then((text) => {
        throw new Error(text);
      });
    } else {
      return res.json();
    }
  });
}
