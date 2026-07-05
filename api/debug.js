import { getRandomCatUrl } from "../lib/catSource.js";

export default async function handler(req, res) {
  const url = await getRandomCatUrl();
  res.status(200).json({ url });
}
