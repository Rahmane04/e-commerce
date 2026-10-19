import { authedFetch } from "@/infrastructure/http/authed-fetch";

/** Envoie une photo au backend et retourne son URL publique. */
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await authedFetch("/uploads/images", { method: "POST", body: formData });
  const data = (await res.json()) as { url: string };
  return data.url;
}
