import nacl from "tweetnacl";
import { getRandomCatUrl } from "../lib/catSource.js";

export const config = {
  api: { bodyParser: false },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verifySignature(rawBody, signature, timestamp, publicKey) {
  try {
    return nacl.sign.detached.verify(
      Buffer.concat([Buffer.from(timestamp), rawBody]),
      Buffer.from(signature, "hex"),
      Buffer.from(publicKey, "hex")
    );
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  const rawBody = await getRawBody(req);

  const valid =
    signature &&
    timestamp &&
    verifySignature(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);

  if (!valid) {
    return res.status(401).send("Bad request signature");
  }

  const interaction = JSON.parse(rawBody.toString("utf8"));

  if (interaction.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  if (interaction.type === 2 && interaction.data?.name === "cat") {
    const url = await Promise.race([
      getRandomCatUrl(),
      new Promise(r => setTimeout(() => r(null), 2500)),
    ]);

    if (!url) {
      return res.status(200).json({
        type: 4,
        data: { content: "Couldn't fetch a cat gif right now, try again" },
      });
    }

    return res.status(200).json({
      type: 4,
      data: { content: url },
    });
  }

  return res.status(400).send("Unknown interaction type");
}
