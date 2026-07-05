# catapi

Random cat GIF API for Discord. Every request returns a fresh, random cat GIF with no-cache headers so your Discord webhook always gets a different cat.

## Usage

```
https://catapi.vercel.app/
https://catapi.vercel.app/catapi
https://catapi.vercel.app/api/catapi
```

Returns a `image/gif` response — drop the URL directly into a Discord webhook or an `<img>` tag.

## Discord `/cat` slash command

Unlike the link above (which Discord can cache as a stale embed), a slash
command uploads a fresh file attachment every time — nothing for Discord to
cache, so `/cat` always gives a new gif.

1. Deploy this project to Vercel first (so you have a live URL).
2. Go to the [Discord Developer Portal](https://discord.com/developers/applications) → create (or open) an application.
3. On the **General Information** page, copy the **Application ID** and **Public Key**.
4. Set these as environment variables on your Vercel project:
   - `DISCORD_PUBLIC_KEY` — from step 3
   - `DISCORD_APPLICATION_ID` — from step 3
5. Set the **Interactions Endpoint URL** (also on General Information) to:
   ```
   https://<your-vercel-domain>/api/interactions
   ```
   Discord pings this immediately on save to verify it — it'll only succeed once the env vars above are deployed.
6. Go to the **Bot** tab, create a bot, and copy its **token**.
7. Register the `/cat` command once, locally:
   ```
   DISCORD_APPLICATION_ID=xxx DISCORD_BOT_TOKEN=xxx node register-commands.js
   ```
8. Install the app (works in DMs by default, or add `?type=server` for a server):
   ```
   https://catapi-lac.vercel.app/catbot
   ```
9. Type `/cat` in any DM with the bot or in any server it's in.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/000bdhm/catapi)

## Structure

```
api/catapi.js    # Serverless function
vercel.json      # Rewrite rules
package.json     # Dependencies
```
