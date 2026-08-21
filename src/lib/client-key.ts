import { askForPassphrase } from "./passphrase-modal";

const STORAGE_KEY = "plan-better-write-key";

function getStoredKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function setStoredKey(key: string) {
  window.localStorage.setItem(STORAGE_KEY, key);
}

export async function authedFetch(url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("x-plan-better-key", getStoredKey());
  let res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    const entered = await askForPassphrase();
    if (entered === null) return res;
    setStoredKey(entered);
    headers.set("x-plan-better-key", entered);
    res = await fetch(url, { ...init, headers });
  }

  return res;
}
