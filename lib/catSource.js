const CATAPI_KEY = process.env.CATAPI_KEY || "";

// Fetches just the cat GIF URL (fast — no binary download)
export async function getRandomCatUrl() {
  const url = `https://api.thecatapi.com/v1/images/search?mime_types=gif&limit=1&_=${Date.now()}`;
  const headers = CATAPI_KEY ? { "x-api-key": CATAPI_KEY } : {};
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(4000) });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0]?.url || null;
}

// Fetches a random cat GIF and downloads its bytes, ready to stream straight
// to the client (used by the raw /catapi?raw endpoint).
export async function getRandomCatGif() {
  const gifUrl = await getRandomCatUrl();
  if (!gifUrl) return null;

  const res = await fetch(gifUrl, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) return null;

  const arrayBuffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "image/gif";
  return { buf: Buffer.from(arrayBuffer), contentType };
}
