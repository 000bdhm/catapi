// Redirects to Discord's "Add App" authorization page for this bot.
// Supports both server install and user install (for DMs).
export default function handler(req, res) {
  const applicationId = process.env.DISCORD_APPLICATION_ID;

  if (!applicationId) {
    res.status(500).send("DISCORD_APPLICATION_ID env var is not set on this deployment.");
    return;
  }

  const integrationType = req.query?.type === "server" ? 0 : 1;
  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${applicationId}&integration_type=${integrationType}&scope=applications.commands`;
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, inviteUrl);
}
