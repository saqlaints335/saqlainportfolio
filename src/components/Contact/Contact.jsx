import { useEffect, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import useContent from "../../content/useContent";
import { telLink } from "../../content/format";
import { getCountries, getCurrency, flagSrc, flagSrcSet } from "../../data/countries";

const emptyForm = {
  name: "",
  email: "",
  country: "",
  budget: "",
  subject: "",
  message: "",
};

// Dropdown that shows the flag next to every country name
const CountrySelect = ({ countries, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef(null);
  const selected = countries.find((c) => c.name === value);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  const list = query.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : countries;

  const pick = (country) => {
    onChange(country);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="country-select" ref={boxRef}>
      <button
        type="button"
        className={`country-trigger ${selected ? "" : "is-placeholder"}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected && <img src={flagSrc(selected.code)} srcSet={flagSrcSet(selected.code)} alt="" width="20" height="15" />}
        <span>{selected ? selected.name : placeholder}</span>
      </button>

      {/* keeps the browser's "required" check working */}
      <input className="country-required" tabIndex={-1} value={value} onChange={() => {}} required aria-hidden="true" />

      {open && (
        <div className="country-menu">
          <input
            type="text"
            className="country-search"
            placeholder="Search country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul role="listbox">
            {list.map((country) => (
              <li
                key={country.code}
                role="option"
                aria-selected={country.name === value}
                className={country.name === value ? "is-selected" : ""}
                onClick={() => pick(country)}
              >
                <img src={flagSrc(country.code)} srcSet={flagSrcSet(country.code)} alt="" width="20" height="15" loading="lazy" />
                <span>{country.name}</span>
              </li>
            ))}
            {list.length === 0 && <li className="country-empty">No country found</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const { contact, general } = useContent();
  const countries = useMemo(() => getCountries(), []);

  const [formData, setFormData] = useState(emptyForm);

  // Pre-select the visitor's country (Vercel tells us where the request came from)
  useEffect(() => {
    let alive = true;

    fetch("/api/geo")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!alive || !data || !data.country) return;
        const match = countries.find((c) => c.code === data.country);
        if (match) {
          setFormData((prev) => (prev.country ? prev : { ...prev, country: match.name }));
        }
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [countries]);

  // Currency follows the selected country (Pakistan = PKR, United States = USD ...)
  const selectedCountry = countries.find((c) => c.name === formData.country);
  const currency = selectedCountry ? getCurrency(selectedCountry.code) : null;
  const budgetText = formData.budget && currency ? `${currency.code} ${formData.budget}` : "Not specified";

  const handleCountry = (country) => {
    setFormData((prev) => ({ ...prev, country: country.name }));
  };

  const handleBudget = (e) => {
    // numbers only (a decimal point is allowed), no normal text
    const cleaned = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    setFormData((prev) => ({ ...prev, budget: cleaned }));
  };

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      loading: true,
      success: false,
      error: false,
    });

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          country: formData.country,
          budget: budgetText,
          subject: formData.subject,
          // Country and budget are also added to the message,
          // so they arrive even if the EmailJS template has no {{country}} / {{budget}}.
          message: `${formData.message}\n\n---\nCountry: ${formData.country}\nBudget: ${budgetText}`,
        },
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      setStatus({
        loading: false,
        success: true,
        error: false,
      });

      setFormData((prev) => ({ ...emptyForm, country: prev.country }));
    } catch (error) {
      console.error("EmailJS Error:", error);

      setStatus({
        loading: false,
        success: false,
        error: true,
      });
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        {/* LEFT CONTENT */}
        <div className="contact-info">
          <span className="contact-label">
            {contact.label}
          </span>

          <h2 className="contact-heading">
            {contact.heading}
          </h2>

          <p className="contact-description">
            {contact.description}
          </p>

          <div className="contact-details">

            {/* EMAIL */}
            <a
              href={`mailto:${general.email}`}
              className="contact-detail"
            >
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="m4 6 8 7 8-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span>
                {general.email}
              </span>
            </a>

            {/* PHONE */}
            <a
              href={telLink(general.phone)}
              className="contact-detail"
            >
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M6.6 3.5 9 8l-2 1.8c1.1 2.4 2.8 4.1 5.2 5.2l1.8-2 4.5 2.4c.5.3.7.8.5 1.4-.6 1.8-2.2 3-4.1 3-5.9 0-10.7-4.8-10.7-10.7 0-1.9 1.2-3.5 3-4.1.6-.2 1.1 0 1.4.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span>
                {general.phone}
              </span>
            </a>

            {/* LOCATION */}
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </div>

              <span>{general.location}</span>
            </div>

          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form-wrapper">
          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="contact-form-row">

              <div className="contact-field">
                <input
                  type="text"
                  name="name"
                  placeholder={contact.namePlaceholder}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <input
                  type="email"
                  name="email"
                  placeholder={contact.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="contact-form-row">

              <div className="contact-field">
                <CountrySelect
                  countries={countries}
                  value={formData.country}
                  onChange={handleCountry}
                  placeholder={contact.countryPlaceholder}
                />
              </div>

              <div className="contact-field">
                <div className="budget-field">
                  <span className="budget-currency" title={currency ? currency.code : ""}>
                    {currency ? (currency.symbol === currency.code ? currency.code : `${currency.symbol} ${currency.code}`) : "$"}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="budget"
                    placeholder={currency ? "Your budget (e.g. 500)" : "Select country first"}
                    value={formData.budget}
                    onChange={handleBudget}
                    disabled={!currency}
                    maxLength={14}
                  />
                </div>
              </div>

            </div>

            <div className="contact-field">
              <input
                type="text"
                name="subject"
                placeholder={contact.subjectPlaceholder}
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <textarea
                name="message"
                placeholder={contact.messagePlaceholder}
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="contact-submit"
              disabled={status.loading}
            >
              <span>
                {status.loading
                  ? contact.sending
                  : contact.button}
              </span>

              <svg viewBox="0 0 24 24">
                <path
                  d="m21 3-8.5 18-2.5-8L2 10l19-7Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="m10 13 11-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {status.success && (
              <p className="form-message form-success">
                {contact.success}
              </p>
            )}

            {status.error && (
              <p className="form-message form-error">
                {contact.error}
              </p>
            )}

          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;