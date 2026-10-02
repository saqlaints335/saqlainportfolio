import { useEffect } from "react";

// Creates the tag if it doesn't exist, then updates its value.
function upsert(tag, attrs, value, valueAttr = "content") {
  const selector =
    tag + Object.entries(attrs).map(([k, v]) => `[${k}="${v}"]`).join("");

  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }

  el.setAttribute(valueAttr, value);
}

// Live domain: set VITE_SITE_URL (or Vercel's production URL is used at build).
const BASE_URL = (import.meta.env.SITE_URL || "").replace(/\/$/, "");

export default function useSeo({ title, description, path = "/", noindex = false }) {
  useEffect(() => {
    const base = BASE_URL || window.location.origin;
    const url = `${base}${path === "/" ? "/" : path}`;

    document.title = title;

    upsert("meta", { name: "description" }, description);
    upsert("meta", { name: "robots" }, noindex ? "noindex, follow" : "index, follow");
    upsert("link", { rel: "canonical" }, url, "href");

    upsert("meta", { property: "og:title" }, title);
    upsert("meta", { property: "og:description" }, description);
    upsert("meta", { property: "og:url" }, url);

    upsert("meta", { name: "twitter:title" }, title);
    upsert("meta", { name: "twitter:description" }, description);
  }, [title, description, path, noindex]);
}
