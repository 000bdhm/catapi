// Run this ONCE locally (not on Vercel) after deploying, to register the /cat command:
//   DISCORD_APPLICATION_ID=xxx DISCORD_BOT_TOKEN=xxx node register-commands.js

const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!APPLICATION_ID || !BOT_TOKEN) {
  console.error("Missing DISCORD_APPLICATION_ID or DISCORD_BOT_TOKEN env vars.");
  process.exit(1);
}

const command = {
  name: "cat",
  description: "Get a random cat gif",
  type: 1, // CHAT_INPUT (slash command)
  integration_types: [0, 1], // 0 = guild install, 1 = user install
  contexts: [0, 1, 2],       // 0 = guild, 1 = bot DM, 2 = group DM
};

async function main() {
  const res = await fetch(`https://discord.com/api/v10/applications/${APPLICATION_ID}/commands`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  console.log(res.status, data);
}

main();
