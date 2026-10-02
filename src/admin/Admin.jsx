import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./admin.css";
import { SCHEMA, blankItem } from "../../shared/content.js";
import logo from "../assets/images/logo.webp";

const REQUEST_HEADER = { "x-requested-with": "portfolio-admin" };
const CACHE_KEY = "portfolio_content_v1";

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { ...REQUEST_HEADER, ...(options.headers || {}) },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const getIn = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[head] = setIn(obj ? obj[head] : undefined, rest, value);
  return copy;
}

// Shrinks big screenshots in the browser so they upload fast (WebP, max 1400px wide)
async function prepareImage(file) {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
    throw new Error("Please choose a PNG, JPG or WebP image.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / bitmap.width, 14000 / bitmap.height);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);

  for (const quality of [0.86, 0.76, 0.66, 0.52, 0.4]) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
    if (blob && blob.size <= 3.8 * 1024 * 1024) return blob;
  }
  throw new Error("This image is too large. Please use a smaller screenshot.");
}

async function uploadBlob(blob, kind) {
  const data = await api(`/api/admin/upload?kind=${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: blob,
  });
  return data.url;
}

// ---------------------------------------------------------------
// Form context (so every field can update the draft safely)
// ---------------------------------------------------------------
const FormContext = createContext(null);
const useForm = () => useContext(FormContext);

// ---------------------------------------------------------------
// Fields
// ---------------------------------------------------------------
function FileField({ field, path, value }) {
  const { set } = useForm();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isImage = field.type === "image";

  const onPick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    setError("");
    try {
      let blob = file;
      if (isImage) blob = await prepareImage(file);
      else if (file.type !== "application/pdf") throw new Error("Please choose a PDF file.");
      else if (file.size > 3.8 * 1024 * 1024) throw new Error("PDF is too large (max 3.8 MB).");

      const url = await uploadBlob(blob, isImage ? "image" : "pdf");
      set(path, url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-file">
      {isImage && (
        <div className="adm-preview">{value ? <img src={value} alt="" /> : <span>No image</span>}</div>
      )}

      <div className="adm-file-side">
        {!isImage && value && (
          <a className="adm-file-link" href={value} target="_blank" rel="noreferrer">
            Open current file
          </a>
        )}

        <div className="adm-row">
          <button type="button" className="adm-btn adm-btn-small" onClick={() => inputRef.current.click()} disabled={busy}>
            {busy ? "Uploading..." : isImage ? "Upload image" : "Upload PDF"}
          </button>

          {isImage && value && (
            <button type="button" className="adm-btn adm-btn-small adm-btn-ghost" onClick={() => set(path, "")}>
              Remove
            </button>
          )}
        </div>

        <input
          className="adm-input adm-input-small"
          type="text"
          value={value || ""}
          placeholder={isImage ? "...or paste an image link" : "...or paste a file link"}
          onChange={(e) => set(path, e.target.value)}
        />

        {error && <p className="adm-error">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={isImage ? "image/png,image/jpeg,image/webp" : "application/pdf"}
        onChange={onPick}
      />
    </div>
  );
}

// Paste a website link: name, type, description and a full-page screenshot are filled automatically
function QuickAdd({ onCreate }) {
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);

  const run = async () => {
    setBusy(true);
    setError("");
    setNotes([]);
    try {
      const data = await api("/api/admin/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      onCreate(data);
      setNotes(data.warnings || []);
      setLink("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-quick">
      <strong>Create a card from a link</strong>
      <p className="adm-help">
        Paste the website link. The name, type (WooCommerce store or service website), short description and a full-page
        screenshot are filled in automatically. Check the card, fix anything you like, then click Save changes.
      </p>

      <div className="adm-row adm-quick-row">
        <input
          className="adm-input"
          type="text"
          value={link}
          placeholder="https://example.com"
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && link && !busy && run()}
        />
        <button type="button" className="adm-btn adm-btn-primary" onClick={run} disabled={busy || !link.trim()}>
          {busy ? "Working..." : "Create card"}
        </button>
      </div>

      {busy && <p className="adm-help">Reading the website and taking a screenshot. This can take up to 40 seconds...</p>}
      {error && <p className="adm-error">{error}</p>}
      {notes.length > 0 && (
        <ul className="adm-notes">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <p className="adm-help">You can also add a card by hand with the "+ Add project" button below.</p>
    </div>
  );
}

// "Fill from link" for an existing card: only empty fields are filled
function FillFromLink({ url, onFill }) {
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");

  const run = async (replaceImage) => {
    setBusy(replaceImage ? "shot" : "fill");
    setMsg("");
    try {
      const data = await api("/api/admin/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      onFill(data, replaceImage);
      const notes = (data.warnings || []).join(" ");
      if (replaceImage) {
        setMsg(data.image ? `Screenshot replaced. Click Save changes. ${notes}` : `Could not get a new screenshot, the old image was kept. ${notes}`);
      } else {
        setMsg(["Empty fields were filled.", notes].join(" "));
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="adm-fill">
      <button type="button" className="adm-btn adm-btn-small" onClick={() => run(false)} disabled={!!busy || !url}>
        {busy === "fill" ? "Working..." : "Fill empty fields from link"}
      </button>{" "}
      <button type="button" className="adm-btn adm-btn-small" onClick={() => run(true)} disabled={!!busy || !url}>
        {busy === "shot" ? "Taking screenshot (up to 40 sec)..." : "Replace image with full-page screenshot"}
      </button>
      {msg && <p className="adm-help">{msg}</p>}
    </div>
  );
}

function ListField({ field, path, value }) {
  const { update } = useForm();
  const [open, setOpen] = useState(field.fixed ? -1 : null);
  const items = Array.isArray(value) ? value : [];
  const max = field.max || 50;

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    update(path, (list) => {
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    setOpen(j);
  };

  const remove = (i) => {
    if (!window.confirm(`Delete this ${field.itemName || "item"}?`)) return;
    update(path, (list) => list.filter((_, idx) => idx !== i));
    setOpen(null);
  };

  const add = () => {
    update(path, (list) => [...list, blankItem(field.itemFields)]);
    setOpen(items.length);
  };

  // Card created from a link (shown on the home page while there are fewer than 4 featured cards)
  const addFromLink = (data) => {
    const featuredCount = items.filter((item) => item.featured).length;
    const item = {
      ...blankItem(field.itemFields),
      title: data.title,
      type: data.type,
      url: data.url,
      image: data.image,
      description: data.description,
      platform: data.platform,
      featured: featuredCount < 4,
    };
    update(path, (list) => [...list, item]);
    setOpen(items.length);
  };

  const fillItem = (i, data, replaceImage = false) =>
    update(path, (list) =>
      list.map((item, idx) =>
        idx !== i
          ? item
          : {
              ...item,
              title: item.title || data.title,
              type: item.type || data.type,
              description: item.description || data.description,
              // "Replace image" swaps the old picture; otherwise only an empty image is filled
              image: replaceImage ? data.image || item.image : item.image || data.image,
            }
      )
    );

  return (
    <div className="adm-list">
      {field.quickAdd && <QuickAdd onCreate={addFromLink} />}

      {items.map((item, i) => {
        const expanded = field.fixed || open === i;
        const title = item[field.itemLabel] || `New ${field.itemName || "item"}`;

        return (
          <div className={`adm-item ${expanded ? "is-open" : ""}`} key={i}>
            <div className="adm-item-head" onClick={() => !field.fixed && setOpen(expanded ? null : i)}>
              {item.image ? <img className="adm-thumb" src={item.image} alt="" /> : null}

              <div className="adm-item-title">
                <strong>{title}</strong>
                {item.type ? <small>{item.type}</small> : item.company ? <small>{item.company}</small> : null}
              </div>

              {!field.fixed && (
                <div className="adm-item-actions" onClick={(e) => e.stopPropagation()}>
                  <button type="button" title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button type="button" title="Move down" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
                  <button type="button" title="Delete" className="is-danger" onClick={() => remove(i)}>✕</button>
                </div>
              )}
            </div>

            {expanded && (
              <div className="adm-item-body">
                {field.quickAdd && <FillFromLink url={item.url} onFill={(data, replaceImage) => fillItem(i, data, replaceImage)} />}

                {field.itemFields.map((sub) => (
                  <Field key={sub.key} field={sub} path={[...path, i, sub.key]} value={item[sub.key]} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {!field.fixed && (
        <button type="button" className="adm-btn adm-btn-add" onClick={add} disabled={items.length >= max}>
          + Add {field.itemName || "item"}
        </button>
      )}

      {items.length === 0 && !field.fixed && <p className="adm-muted">Nothing here yet.</p>}
    </div>
  );
}

function Field({ field, path, value }) {
  const { set } = useForm();
  const id = `f-${path.join("-")}`;

  let control;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea id={id} className="adm-input" rows={4} value={value ?? ""} onChange={(e) => set(path, e.target.value)} />
      );
      break;
    case "select":
      control = (
        <select id={id} className="adm-input" value={value ?? ""} onChange={(e) => set(path, e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "bool":
      control = (
        <label className="adm-toggle">
          <input id={id} type="checkbox" checked={!!value} onChange={(e) => set(path, e.target.checked)} />
          <span></span>
          {value ? "Yes" : "No"}
        </label>
      );
      break;
    case "image":
    case "file":
      control = <FileField field={field} path={path} value={value} />;
      break;
    case "list":
      control = <ListField field={field} path={path} value={value} />;
      break;
    default:
      control = (
        <input
          id={id}
          className="adm-input"
          type="text"
          value={value ?? ""}
          placeholder={field.type === "url" ? "https://..." : ""}
          onChange={(e) => set(path, e.target.value)}
        />
      );
  }

  return (
    <div className={`adm-field adm-field-${field.type}`}>
      <label htmlFor={id}>{field.label}</label>
      {control}
      {field.help && <p className="adm-help">{field.help}</p>}
    </div>
  );
}

// ---------------------------------------------------------------
// Login
// ---------------------------------------------------------------
function Login({ configured, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login-wrap">
      <form className="adm-login" onSubmit={submit}>
        <img src={logo} alt="" className="adm-login-logo" />
        <h1>Admin Login</h1>
        <p className="adm-muted">Sign in to edit your website.</p>

        {!configured && (
          <p className="adm-error">
            Login is not set up yet. Add ADMIN_USERNAME, ADMIN_PASSWORD and SESSION_SECRET in your Vercel Environment
            Variables, then redeploy.
          </p>
        )}

        <label htmlFor="adm-user">Username</label>
        <input id="adm-user" className="adm-input" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label htmlFor="adm-pass">Password</label>
        <div className="adm-pass">
          <input
            id="adm-pass"
            className="adm-input"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShow((s) => !s)}>
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="adm-error">{error}</p>}

        <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={busy || !configured}>
          {busy ? "Signing in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------
function Dashboard({ onLoggedOut }) {
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState("");
  const [activeId, setActiveId] = useState(SCHEMA[0].id);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) onLoggedOut();
    },
    [onLoggedOut]
  );

  useEffect(() => {
    api("/api/admin/content")
      .then((data) => {
        setDraft(data);
        setSaved(JSON.stringify(data));
      })
      .catch((err) => {
        handleError(err);
        setLoadError(err.message);
      });
  }, [handleError]);

  const dirty = draft !== null && JSON.stringify(draft) !== saved;

  useEffect(() => {
    const warn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback((path, value) => setDraft((prev) => setIn(prev, path, value)), []);
  const update = useCallback(
    (path, fn) => setDraft((prev) => setIn(prev, path, fn(getIn(prev, path)))),
    []
  );

  const save = async () => {
    setSaving(true);
    setStatus({ type: "", text: "" });
    try {
      const data = await api("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      setDraft(data.content);
      setSaved(JSON.stringify(data.content));
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.content)); // you see changes instantly
      } catch {
        /* ignore */
      }
      setStatus({ type: "ok", text: "Saved. Visitors will see the changes within about a minute." });
    } catch (err) {
      handleError(err);
      setStatus({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    if (dirty && !window.confirm("You have unsaved changes. Log out anyway?")) return;
    try {
      await api("/api/auth/logout", { method: "POST" });
    } finally {
      onLoggedOut();
    }
  };

  if (loadError) {
    return (
      <div className="adm-login-wrap">
        <div className="adm-login">
          <h1>Could not load</h1>
          <p className="adm-error">{loadError}</p>
          <button className="adm-btn" onClick={() => window.location.reload()}>Try again</button>
        </div>
      </div>
    );
  }

  if (!draft) {
    return <div className="adm-loading">Loading...</div>;
  }

  const group = SCHEMA.find((g) => g.id === activeId);

  return (
    <FormContext.Provider value={{ set, update }}>
      <div className="adm-shell">
        <header className="adm-top">
          <div className="adm-brand">
            <img src={logo} alt="" />
            <span>Website Admin</span>
          </div>

          <div className="adm-top-actions">
            {dirty && <span className="adm-dirty">Unsaved changes</span>}
            <a className="adm-btn adm-btn-ghost" href="/" target="_blank" rel="noreferrer">View site ↗</a>
            <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving || !dirty}>
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button className="adm-btn adm-btn-ghost" onClick={logout}>Log out</button>
          </div>
        </header>

        <div className="adm-body">
          <nav className="adm-side" aria-label="Sections">
            {SCHEMA.map((g) => (
              <button
                key={g.id}
                className={g.id === activeId ? "is-active" : ""}
                onClick={() => {
                  setActiveId(g.id);
                  window.scrollTo({ top: 0 });
                }}
              >
                {g.title}
              </button>
            ))}
          </nav>

          <main className="adm-main">
            <h1>{group.title}</h1>
            {group.description && <p className="adm-muted">{group.description}</p>}

            {status.text && <div className={`adm-status adm-status-${status.type}`}>{status.text}</div>}

            <div className="adm-form">
              {group.fields.map((field) => (
                <Field
                  key={`${group.id}-${field.key}`}
                  field={field}
                  path={[group.id, field.key]}
                  value={draft[group.id][field.key]}
                />
              ))}
            </div>

            <div className="adm-savebar">
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving || !dirty}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </FormContext.Provider>
  );
}

// ---------------------------------------------------------------
// Entry
// ---------------------------------------------------------------
export default function Admin() {
  const [stage, setStage] = useState("loading");
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    api("/api/auth/me")
      .then((data) => {
        setConfigured(data.configured);
        setStage(data.authenticated ? "ready" : "login");
      })
      .catch(() => setStage("login"));
  }, []);

  if (stage === "loading") return <div className="adm-loading">Loading...</div>;

  if (stage === "login") {
    return <Login configured={configured} onSuccess={() => setStage("ready")} />;
  }

  return <Dashboard onLoggedOut={() => setStage("login")} />;
}
