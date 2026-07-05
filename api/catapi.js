import { getRandomCatGif } from "../lib/catSource.js";

// Raw GIF endpoint – used by both the HTML page and Discord's og:image fetch
async function serveRawGif(req, res) {
  const result = await getRandomCatGif();
  if (result) {
    res.setHeader("Content-Type", result.contentType);
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("x-vercel-cache", "bypass");
    return res.status(200).send(result.buf);
  }
  res.status(502).json({ error: "Could not fetch a cat gif right now" });
}

// HTML page – served to browsers and Discord's crawler
function serveHtml(req, res) {
  const baseUrl = `https://catapi-lac.vercel.app`;
  const imgUrl = `${baseUrl}/catapi?raw&cb=${Date.now()}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>catapi — random cat gif API</title>
<meta name="description" content="A tiny serverless API that returns a fresh, random cat gif on every request.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%90%B1%3C/text%3E%3C/svg%3E">
<meta property="og:title" content="catapi 🐱">
<meta property="og:type" content="website">
<meta property="og:image" content="${imgUrl}">
<meta property="og:description" content="A fresh, random cat gif — every single request.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${imgUrl}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0A0A0A; --surface:#111111; --border:#1F1F1F;
    --text:#FAFAFA; --muted:#8A8A8A;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{height:100%}
  body{
    background:var(--bg);
    color:var(--text);
    font-family:'Inter',sans-serif;
    display:flex;flex-direction:column;justify-content:center;align-items:center;
    min-height:100vh;padding:2rem 1.25rem;
    position:relative;
    overflow-x:hidden;
  }
  .grid-bg{
    position:fixed;inset:0;
    background-image:
      linear-gradient(to right, #ffffff08 1px, transparent 1px),
      linear-gradient(to bottom, #ffffff08 1px, transparent 1px);
    background-size:48px 48px;
    pointer-events:none;
  }
  .glow{
    position:fixed;inset:0;
    background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.07), transparent 70%);
    pointer-events:none;
  }
  .eyebrow{
    position:relative;
    display:flex;align-items:center;gap:.5rem;
    font-family:'JetBrains Mono',monospace;
    font-size:.8rem;color:var(--muted);
    margin-bottom:1.5rem;
  }
  .eyebrow .dot{width:8px;height:8px;border-radius:50%;background:var(--text);animation:pulse 1.6s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  h1{
    position:relative;
    font-family:'Space Grotesk',sans-serif;
    font-weight:500;
    font-size:clamp(2.2rem,7vw,3rem);
    letter-spacing:-0.02em;
    line-height:1.05;
    background:linear-gradient(180deg,#FFFFFF 0%,#999999 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    margin-bottom:.6rem;
    text-align:center;
  }
  p.sub{
    position:relative;
    font-family:'Inter',sans-serif;
    color:var(--muted);
    text-align:center;
    max-width:26rem;
    margin-bottom:2rem;
    line-height:1.6;
  }
  .card{
    position:relative;
    width:min(92vw,420px);
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:16px;
    padding:1.25rem;
    animation:rise .6s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  .frame{
    position:relative;
    width:100%; aspect-ratio:1/1;
    border-radius:10px;
    overflow:hidden;
    background:#0A0A0A;
    border:1px solid var(--border);
    display:flex;align-items:center;justify-content:center;
  }
  .frame img{
    width:100%;height:100%;object-fit:cover;
    display:block;
    opacity:0; transition:opacity .35s ease;
  }
  .frame img.loaded{opacity:1}
  .spinner{
    position:absolute; width:24px;height:24px;
    border-radius:50%;
    border:2px solid var(--border);
    border-top-color:var(--text);
    animation:spin .8s linear infinite;
  }
  .spinner.hidden{display:none}
  @keyframes spin{to{transform:rotate(360deg)}}
  .actions{margin-top:1.1rem}
  button{
    width:100%;
    display:flex;align-items:center;justify-content:center;gap:.5rem;
    padding:.85rem 1rem;
    background:var(--text);
    color:var(--bg);
    border:none;
    border-radius:9999px;
    font-family:'Inter',sans-serif;
    font-size:.95rem;font-weight:500;
    cursor:pointer;
    transition:transform .3s ease;
  }
  button:hover{transform:scale(1.03)}
  button:active{transform:scale(.97)}
  .meta{
    display:flex;justify-content:space-between;align-items:center;
    margin-top:1.1rem;padding-top:1rem;border-top:1px solid var(--border);
    font-family:'JetBrains Mono',monospace;
    font-size:.72rem;color:var(--muted);
  }
  .meta a{
    color:var(--muted);text-decoration:none;
    border:1px solid var(--border);border-radius:9999px;
    padding:.3rem .7rem;
    transition:color .2s ease, border-color .2s ease;
  }
  .meta a:hover{color:var(--text);border-color:var(--text)}
  kbd{
    background:var(--bg);border:1px solid var(--border);border-radius:5px;
    padding:.1rem .4rem;font-size:.72rem;color:var(--muted);
  }
</style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow"></div>

  <div class="eyebrow"><span class="dot"></span> live · random cat api</div>
  <h1>catapi.</h1>
  <p class="sub">A tiny serverless endpoint that returns a fresh, random cat gif on every request — built for Discord webhooks, embeds, or just staring at cats.</p>

  <div class="card">
    <div class="frame">
      <div class="spinner" id="spin"></div>
      <img id="c" alt="a random cat gif">
    </div>
    <div class="actions">
      <button id="n">New cat</button>
    </div>
    <div class="meta">
      <span>press <kbd>space</kbd> for a new cat</span>
      <a href="https://github.com/000bdhm/catapi" target="_blank" rel="noopener">source ↗</a>
    </div>
  </div>

<script>
  var img = document.getElementById("c");
  var spin = document.getElementById("spin");

  function loadCat(){
    img.classList.remove("loaded");
    spin.classList.remove("hidden");
    var next = new Image();
    next.onload = function(){
      img.src = next.src;
      img.classList.add("loaded");
      spin.classList.add("hidden");
    };
    next.onerror = function(){
      spin.classList.add("hidden");
    };
    next.src = "/catapi?raw&cb=" + Date.now();
  }

  document.getElementById("n").addEventListener("click", loadCat);
  document.addEventListener("keydown", function(e){
    if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") {
      e.preventDefault();
      loadCat();
    }
  });
  loadCat();
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("x-vercel-cache", "bypass");
  res.status(200).send(html);
}

export default async function handler(req, res) {
  const u = req.url;
  const isRaw = u?.includes("?raw") || u?.includes("&raw") || req.query?.raw === "";
  return isRaw ? serveRawGif(req, res) : serveHtml(req, res);
}
