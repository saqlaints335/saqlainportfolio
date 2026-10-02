import { buildDefaults, sanitizeContent } from "../shared/content.js";
import { HttpError, send, readJson, readRaw } from "./lib/http.js";
import {
  authConfigured,
  checkCredentials,
  sessionCookie,
  clearCookie,
  isAuthenticated,
  isLockedOut,
  recordFailure,
  clearFailures,
} from "./lib/auth.js";
import { readContent, writeContent, saveFile } from "./lib/storage.js";
import { autofillFromLink } from "./lib/autofill.js";

const MAX_UPLOAD = 4 * 1024 * 1024; // Vercel functions accept up to ~4.5 MB

// Detect the real file type from its first bytes (never trust the file name)
function detectType(buf) {
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return { ext: "webp", type: "image/webp", kind: "image" };
  if (buf.length > 8 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG")
    return { ext: "png", type: "image/png", kind: "image" };
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return { ext: "jpg", type: "image/jpeg", kind: "image" };
  if (buf.length > 4 && buf.toString("ascii", 0, 4) === "%PDF")
    return { ext: "pdf", type: "application/pdf", kind: "pdf" };
  return null;
}

async function getStoredContent() {
  return sanitizeContent((await readContent()) || buildDefaults());
}

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, "http://localhost");
    let route = url.pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
    // When Vercel rewrites /api/xyz to /api/index?path=xyz, read the real route from the query
    if (route === "index" || route === "") route = (url.searchParams.get("path") || "").replace(/^\/+|\/+$/g, "");
    const method = req.method;

    // ---------- PUBLIC ----------
    if (route === "content" && method === "GET") {
      let content;
      let source = "saved";
      try {
        content = await getStoredContent();
      } catch (err) {
        console.error("content read failed:", err);
        content = buildDefaults(); // website keeps working with built-in text
        source = "defaults";
      }
      // Browsers always re-check (so edits show up right away on reload);
      // only Vercel's CDN keeps a 30 second copy to stay fast under traffic.
      return send(
        res,
        200,
        content,
        source === "saved"
          ? {
              "Cache-Control": "public, max-age=0, must-revalidate",
              "Vercel-CDN-Cache-Control": "s-maxage=30, stale-while-revalidate=300",
              "X-Content-Source": source,
            }
          : { "Cache-Control": "no-store", "X-Content-Source": source }
      );
    }

    if (route === "geo" && method === "GET") {
      const code = String(req.headers["x-vercel-ip-country"] || "").toUpperCase();
      return send(res, 200, { country: /^[A-Z]{2}$/.test(code) ? code : "" }, { "Cache-Control": "private, no-store" });
    }

    // ---------- AUTH ----------
    if (route === "auth/login" && method === "POST") {
      if (!authConfigured())
        throw new HttpError(503, "Admin login is not set up. Add ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET in Vercel Environment Variables.");
      if (isLockedOut(req)) throw new HttpError(429, "Too many failed attempts. Try again in 15 minutes.");

      const { username = "", password = "" } = await readJson(req, 10_000);
      if (checkCredentials(String(username), String(password))) {
        clearFailures(req);
        return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(req), "Cache-Control": "no-store" });
      }
      recordFailure(req);
      await new Promise((r) => setTimeout(r, 700)); // slows down password guessing
      throw new HttpError(401, "Wrong username or password.");
    }

    if (route === "auth/logout" && method === "POST") {
      return send(res, 200, { ok: true }, { "Set-Cookie": clearCookie(req) });
    }

    if (route === "auth/me" && method === "GET") {
      return send(res, 200, { authenticated: isAuthenticated(req), configured: authConfigured() }, { "Cache-Control": "no-store" });
    }

    // ---------- ADMIN (login required) ----------
    if (route.startsWith("admin/")) {
      if (!isAuthenticated(req)) throw new HttpError(401, "Please log in again.");
      if (method !== "GET" && req.headers["x-requested-with"] !== "portfolio-admin")
        throw new HttpError(403, "Blocked request.");

      if (route === "admin/content" && method === "GET") {
        return send(res, 200, await getStoredContent(), { "Cache-Control": "no-store" });
      }

      if (route === "admin/content" && method === "PUT") {
        const body = await readJson(req);
        const clean = sanitizeContent(body);
        await writeContent(clean);
        return send(res, 200, { ok: true, content: clean }, { "Cache-Control": "no-store" });
      }

      if (route === "admin/autofill" && method === "POST") {
        const { url: link = "" } = await readJson(req, 10_000);
        const result = await autofillFromLink(link);
        return send(res, 200, result, { "Cache-Control": "no-store" });
      }

      if (route === "admin/upload" && method === "POST") {
        const wanted = url.searchParams.get("kind") === "pdf" ? "pdf" : "image";
        const buf = await readRaw(req, MAX_UPLOAD);
        if (!buf.length) throw new HttpError(400, "No file received.");
        const info = detectType(buf);
        if (!info || info.kind !== wanted)
          throw new HttpError(400, wanted === "pdf" ? "Please upload a PDF file." : "Please upload a PNG, JPG or WebP image.");
        const fileUrl = await saveFile(buf, info.ext, info.type);
        return send(res, 200, { url: fileUrl }, { "Cache-Control": "no-store" });
      }
    }

    throw new HttpError(404, "Not found.");
  } catch (err) {
    if (!(err instanceof HttpError)) console.error(err);
    const status = err instanceof HttpError ? err.status : 500;
    send(res, status, { error: err instanceof HttpError ? err.message : "Server error." }, { "Cache-Control": "no-store" });
  }
}
