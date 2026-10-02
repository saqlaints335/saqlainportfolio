import { useEffect, useState } from "react";
import { ContentContext } from "./context";
import { buildDefaults, sanitizeContent } from "../../shared/content.js";

const CACHE_KEY = "portfolio_content_v1";

// Last loaded content is cached so returning visitors don't see a flash of old text.
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? sanitizeContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export default function ContentProvider({ children }) {
  const [content, setContent] = useState(() => readCache() || buildDefaults());

  useEffect(() => {
    let alive = true;

    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data) return;
        const clean = sanitizeContent(data);
        setContent(clean);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(clean));
        } catch {
          /* storage blocked: ignore */
        }
      })
      .catch(() => {
        /* offline / API down: the built-in text stays */
      });

    return () => {
      alive = false;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
