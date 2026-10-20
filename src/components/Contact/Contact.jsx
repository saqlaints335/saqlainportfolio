import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import useContent from "../../content/useContent";
import { telLink } from "../../content/format";
import { getCountries } from "../../data/countries";

const emptyForm = {
  name: "",
  email: "",
  country: "",
  budget: "",
  subject: "",
  message: "",
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
          budget: formData.budget || "Not specified",
          subject: formData.subject,
          // Country and budget are also added to the message,
          // so they arrive even if the EmailJS template has no {{country}} / {{budget}}.
          message: `${formData.message}\n\n---\nCountry: ${formData.country}\nBudget: ${formData.budget || "Not specified"}`,
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
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  aria-label={contact.countryPlaceholder}
                  className={formData.country ? "" : "is-placeholder"}
                >
                  <option value="" disabled>
                    {contact.countryPlaceholder}
                  </option>

                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field">
                <input
                  type="text"
                  name="budget"
                  placeholder={contact.budgetPlaceholder}
                  value={formData.budget}
                  onChange={handleChange}
                  maxLength={60}
                />
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