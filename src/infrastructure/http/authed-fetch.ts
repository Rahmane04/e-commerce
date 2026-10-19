import { getAuthToken, clearAuthToken } from "@/infrastructure/auth/auth-token";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** Requête authentifiée : attache le Bearer token pour les routes admin protégées. */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  // Pour un fichier (FormData), le navigateur doit fixer lui-même le Content-Type
  // (avec la frontière multipart) : on ne le force donc pas.
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      clearAuthToken();
      window.location.href = "/admin/login";
    }
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Erreur API (${res.status}) sur ${path}`);
  }

  return res;
}

/** Requête publique : sans token d'authentification (ex: création de commande, consultation catalogue). */
export async function publicFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Erreur API (${res.status}) sur ${path}`);
  }

  return res;
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await authedFetch(path, init);
  return res.json();
}
