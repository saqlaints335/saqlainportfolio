import crypto from "node:crypto";
import { parseCookies, isHttps, clientIp } from "./http.js";

const COOKIE = "portfolio_admin";
const SESSION_SECONDS = 60 * 60 * 24; // 24 hours

const sha = (x) => crypto.createHash("sha256").update(String(x)).digest();

export function authConfigured() {
  return !!(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    process.env.SESSION_SECRET &&
    process.env.SESSION_SECRET.length >= 16
  );
}

// Changing the password automatically logs out every old session.
function signingKey() {
  return `${process.env.SESSION_SECRET}|${sha(process.env.ADMIN_PASSWORD).toString("hex")}`;
}

function sign(payload) {
  return crypto.createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function checkCredentials(username, password) {
  const userOk = crypto.timingSafeEqual(sha(username), sha(process.env.ADMIN_USERNAME));
  const passOk = crypto.timingSafeEqual(sha(password), sha(process.env.ADMIN_PASSWORD));
  return userOk && passOk;
}

export function sessionCookie(req) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = Buffer.from(JSON.stringify({ u: process.env.ADMIN_USERNAME, exp })).toString("base64url");
  const value = `${payload}.${sign(payload)}`;
  return `${COOKIE}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}${isHttps(req) ? "; Secure" : ""}`;
}

export function clearCookie(req) {
  return `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${isHttps(req) ? "; Secure" : ""}`;
}

export function isAuthenticated(req) {
  if (!authConfigured()) return false;
  const token = parseCookies(req)[COOKIE];
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.exp > Math.floor(Date.now() / 1000) && data.u === process.env.ADMIN_USERNAME;
  } catch {
    return false;
  }
}

// ---- Login attempt limiter (best effort: memory of the running instance) ----
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 5;

export function isLockedOut(req) {
  const rec = attempts.get(clientIp(req));
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    attempts.delete(clientIp(req));
    return false;
  }
  return rec.count >= MAX_FAILS;
}

export function recordFailure(req) {
  const ip = clientIp(req);
  const rec = attempts.get(ip);
  if (!rec || Date.now() - rec.first > WINDOW_MS) attempts.set(ip, { count: 1, first: Date.now() });
  else rec.count += 1;
}

export function clearFailures(req) {
  attempts.delete(clientIp(req));
}
