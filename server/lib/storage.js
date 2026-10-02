// Where the website content and uploaded files are saved.
//  - On Vercel: Vercel Blob (needs BLOB_READ_WRITE_TOKEN, added automatically when you connect a Blob store)
//  - On your computer (npm run dev): the ".local-data" folder
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { HttpError } from "./http.js";

const CONTENT_PATH = "site/content.json";
const LOCAL_DIR = path.join(process.cwd(), ".local-data");

const blobEnabled = () => !!process.env.BLOB_READ_WRITE_TOKEN;

function storageError(err) {
  const hint = /access|private|public/i.test(String(err && err.message))
    ? " Make sure the Blob store is created as PUBLIC."
    : "";
  return new HttpError(502, `Storage error: ${(err && err.message) || "unknown"}.${hint}`);
}

function notConfigured() {
  return new HttpError(
    503,
    "Storage is not connected. In Vercel: Storage > Create > Blob (Public), connect it to this project, then redeploy."
  );
}

export async function readContent() {
  if (blobEnabled()) {
    const { get } = await import("@vercel/blob");
    try {
      const res = await get(CONTENT_PATH, { access: "public", useCache: false });
      if (!res) return null;
      return JSON.parse(await new Response(res.stream).text());
    } catch (err) {
      if (err && /not.?found/i.test(`${err.name} ${err.message}`)) return null;
      throw storageError(err);
    }
  }
  if (process.env.VERCEL) throw notConfigured();
  try {
    return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, "content.json"), "utf8"));
  } catch {
    return null;
  }
}

export async function writeContent(data) {
  const text = JSON.stringify(data);
  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    try {
      await put(CONTENT_PATH, text, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
    } catch (err) {
      throw storageError(err);
    }
    return;
  }
  if (process.env.VERCEL) throw notConfigured();
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, "content.json"), text);
}

export async function saveFile(buffer, ext, contentType) {
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    try {
      const res = await put(`uploads/${name}`, buffer, {
        access: "public",
        addRandomSuffix: false,
        contentType,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      });
      return res.url;
    } catch (err) {
      throw storageError(err);
    }
  }
  if (process.env.VERCEL) throw notConfigured();
  await fs.mkdir(path.join(LOCAL_DIR, "uploads"), { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, "uploads", name), buffer);
  return `/uploads/${name}`;
}

export const LOCAL_UPLOADS_DIR = path.join(LOCAL_DIR, "uploads");
