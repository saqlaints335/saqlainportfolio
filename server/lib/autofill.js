// "Create a project card from a link":
//  - reads the website's own title / description (name + short description)
//  - detects WooCommerce store vs service website, WordPress vs React
//  - takes a full-page screenshot (Microlink; free tier works without a key)
//  - stores the screenshot in your own storage
import dns from "node:dns/promises";
import net from "node:net";
import { HttpError } from "./http.js";
import { saveFile } from "./storage.js";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// ---------------------------------------------------------------
// Safety: never let this feature reach private / internal addresses
// ---------------------------------------------------------------
function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateIp(v6.slice(7));
  return v6 === "::1" || v6 === "::" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe8") || v6.startsWith("fe9") || v6.startsWith("fea") || v6.startsWith("feb");
}

async function assertPublicUrl(urlStr) {
  if (process.env.ALLOW_PRIVATE_URLS === "1") return; // local testing only
  const u = new URL(urlStr);
  if (!/^https?:$/.test(u.protocol)) throw new HttpError(400, "Link must start with http:// or https://");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal"))
    throw new HttpError(400, "This address is not allowed.");
  const addresses = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
  if (!addresses.length || addresses.some((a) => isPrivateIp(a.address)))
    throw new HttpError(400, "This address is not allowed.");
}

export function normalizeUrl(input) {
  let v = String(input || "").trim();
  if (!v) throw new HttpError(400, "Please paste the website link first.");
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    return new URL(v).toString();
  } catch {
    throw new HttpError(400, "This link does not look correct.");
  }
}

// Downloads a URL with timeout, redirect checks and a size limit.
async function download(urlStr, { timeout = 8000, maxBytes = 1_500_000, headers = {} } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    let current = urlStr;
    for (let hop = 0; hop < 5; hop++) {
      await assertPublicUrl(current);
      const res = await fetch(current, { redirect: "manual", signal: ctrl.signal, headers });

      const location = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && location) {
        current = new URL(location, current).toString();
        continue;
      }

      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      let truncated = false;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > maxBytes) {
          truncated = true;
          await reader.cancel().catch(() => {});
          break;
        }
        chunks.push(value);
      }
      return {
        status: res.status,
        contentType: res.headers.get("content-type") || "",
        finalUrl: current,
        buffer: Buffer.concat(chunks),
        truncated,
      };
    }
    throw new Error("Too many redirects");
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------
// Reading the website's own text
// ---------------------------------------------------------------
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'", ndash: "-", mdash: "-", hellip: "..." };

function decode(text) {
  return String(text || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

function getMeta(head, key) {
  const tag = head.match(new RegExp(`<meta\\s[^>]*?(?:name|property)\\s*=\\s*["']${key}["'][^>]*>`, "i"));
  if (!tag) return "";
  const content = tag[0].match(/content\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  return decode(content ? content[1] ?? content[2] : "");
}

function firstParagraph(html) {
  const clean = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ");
  for (const m of clean.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = decode(m[1].replace(/<[^>]+>/g, " "));
    if (text.length >= 60) return text;
  }
  return "";
}

const GENERIC_TITLE = /^(home|homepage|home page|welcome|official site|official website|index)$/i;

function guessName(siteName, title, host) {
  if (siteName) return siteName;
  const compact = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hostCompact = compact(host.replace(/^www\./, "").split(".")[0]);
  const parts = title.split(/\s*[|–—·•]\s*|\s+-\s+/).map((p) => p.trim()).filter(Boolean);

  const byHost = parts.find((p) => compact(p).length > 2 && (hostCompact.includes(compact(p)) || compact(p).includes(hostCompact)));
  if (byHost) return byHost;

  const firstGood = parts.find((p) => !GENERIC_TITLE.test(p));
  if (firstGood) return firstGood.slice(0, 60);

  const label = host.replace(/^www\./, "").split(".")[0];
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function shorten(text, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : max).replace(/[\s,;:-]+$/, "")}...`;
}

async function readSite(url) {
  const page = await download(url, {
    timeout: 8000,
    maxBytes: 1_500_000,
    headers: { "User-Agent": BROWSER_UA, Accept: "text/html,application/xhtml+xml" },
  });
  if (page.status >= 400) throw new Error(`The website answered with error ${page.status}.`);

  const html = page.buffer.toString("utf8");
  const head = html.slice(0, 250_000);
  const title = decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
  const host = new URL(page.finalUrl).hostname;

  const image = getMeta(head, "og:image") || getMeta(head, "twitter:image");

  return {
    name: guessName(getMeta(head, "og:site_name"), title, host),
    description: shorten(
      getMeta(head, "description") || getMeta(head, "og:description") || getMeta(head, "twitter:description") || firstParagraph(html)
    ),
    image: image ? new URL(image, page.finalUrl).toString() : "",
    isWoo: /woocommerce/i.test(html),
    isReact: /__NEXT_DATA__|\/_next\/static|data-reactroot/i.test(html),
  };
}

// ---------------------------------------------------------------
// Screenshot
// ---------------------------------------------------------------
async function takeScreenshot(url) {
  const key = process.env.MICROLINK_API_KEY;
  const base = process.env.SCREENSHOT_API_URL || (key ? "https://pro.microlink.io" : "https://api.microlink.io");
  const query = new URLSearchParams({
    url,
    meta: "true",
    screenshot: "true",
    "screenshot.fullPage": "true",
    "screenshot.type": "jpeg",
  });

  const res = await download(`${base}?${query}`, {
    timeout: 42000,
    maxBytes: 2_000_000,
    headers: key ? { "x-api-key": key } : {},
  });

  let json;
  try {
    json = JSON.parse(res.buffer.toString("utf8"));
  } catch {
    json = null;
  }
  if (!json || json.status !== "success" || !json.data) {
    const why = (json && (json.message || json.code)) || `error ${res.status}`;
    throw new Error(`Screenshot service said: ${why}`);
  }

  return {
    screenshotUrl: json.data.screenshot && json.data.screenshot.url,
    title: json.data.title || "",
    description: json.data.description || "",
    image: (json.data.image && json.data.image.url) || "",
  };
}

function imageKind(buf) {
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return ["webp", "image/webp"];
  if (buf.length > 8 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return ["png", "image/png"];
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8) return ["jpg", "image/jpeg"];
  return null;
}

// Downloads an image, makes it small (WebP, 1400px wide) and saves it.
async function storeImage(imageUrl) {
  const img = await download(imageUrl, { timeout: 20000, maxBytes: 20_000_000, headers: { "User-Agent": BROWSER_UA } });
  if (img.truncated) throw new Error("Image is too large.");
  let kind = imageKind(img.buffer);
  if (!kind) throw new Error("The downloaded file is not an image.");

  let buffer = img.buffer;
  try {
    const { default: sharp } = await import("sharp");
    const meta = await sharp(buffer).metadata();
    const scale = Math.min(1, 1400 / meta.width);
    const MAX_HEIGHT = 14000; // WebP limit is 16383px
    let pipeline = sharp(buffer);
    if (meta.height * scale > MAX_HEIGHT) {
      pipeline = pipeline.extract({ left: 0, top: 0, width: meta.width, height: Math.floor(MAX_HEIGHT / scale) });
    }
    buffer = await pipeline.resize({ width: Math.round(meta.width * scale) }).webp({ quality: 80 }).toBuffer();
    kind = ["webp", "image/webp"];
  } catch (err) {
    console.error("image compression skipped:", err.message); // keeps the original image
  }

  return saveFile(buffer, kind[0], kind[1]);
}

// ---------------------------------------------------------------
// Main
// ---------------------------------------------------------------
export async function autofillFromLink(rawUrl) {
  const url = normalizeUrl(rawUrl);
  await assertPublicUrl(url);

  const warnings = [];

  const [siteResult, shotResult] = await Promise.allSettled([readSite(url), takeScreenshot(url)]);

  const site = siteResult.status === "fulfilled" ? siteResult.value : null;
  const shot = shotResult.status === "fulfilled" ? shotResult.value : null;

  if (!site) warnings.push(`Could not read the website text (${siteResult.reason.message}). Please check name, type and description.`);
  if (!shot) warnings.push(`Screenshot failed (${shotResult.reason.message}).`);

  // ---- feature image: screenshot first, then the site's preview image
  let image = "";
  if (shot && shot.screenshotUrl) {
    try {
      image = await storeImage(shot.screenshotUrl);
    } catch (err) {
      warnings.push(`Could not save the screenshot (${err.message}).`);
    }
  }
  if (!image) {
    const preview = (site && site.image) || (shot && shot.image);
    if (preview) {
      try {
        image = await storeImage(preview);
        warnings.push("Used the website's preview image instead of a full-page screenshot. You can upload a tall screenshot manually for the hover-scroll effect.");
      } catch {
        /* nothing else to try */
      }
    }
  }
  if (!image) warnings.push("No image was found. Please upload the feature image manually.");

  const host = new URL(url).hostname;
  const title = (site && site.name) || guessName("", (shot && shot.title) || "", host);
  const description = (site && site.description) || shorten(decode((shot && shot.description) || ""));
  if (!description) warnings.push("The website has no description text. Please write a short description.");

  return {
    title,
    type: site ? (site.isWoo ? "WooCommerce Store" : "Service Website") : "Service Website",
    url,
    description,
    image,
    platform: site && site.isReact ? "react" : "wordpress",
    warnings,
  };
}
