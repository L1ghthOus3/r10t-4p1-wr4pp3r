export async function getJson(url, label) {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error(`${label}: not found.`);
    if (res.status === 401 || res.status === 403)
      throw new Error("API key rejected or expired.");
    if (res.status === 429) throw new Error("Rate limited — try again shortly.");
    throw new Error(`${label} failed (${res.status}).`);
  }
  return res.json();
}