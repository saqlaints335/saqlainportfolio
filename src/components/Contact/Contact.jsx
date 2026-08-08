import { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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
      const response = await fetch(
        "https://formspree.io/f/YOUR_FORM_ID",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setStatus({
          loading: false,
          success: true,
          error: false,
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: true,
      });
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        {/* LEFT CONTENT */}
        <div className="contact-info">
          <span className="contact-label">
            CONTACT
          </span>

          <h2 className="contact-heading">
            Get In Touch
          </h2>

          <p className="contact-description">
            I'm currently available for freelance work.
            If you have a project in mind, feel free to
            contact me.
          </p>

          <div className="contact-details">

            {/* EMAIL */}
            <a
              href="mailto:saqlaints335@gmail.com"
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
                saqlaints335@gmail.com
              </span>
            </a>


            {/* PHONE */}
            <a
              href="tel:+923001234567"
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
                +92 300 1234567
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

              <span>Pakistan</span>
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
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            <div className="contact-field">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>


            <div className="contact-field">
              <textarea
                name="message"
                placeholder="Your Message"
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
                  ? "Sending..."
                  : "Send Message"}
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
                Message sent successfully.
              </p>
            )}

            {status.error && (
              <p className="form-message form-error">
                Something went wrong. Please try again.
              </p>
            )}

          </form>

        </div>

      </div>
    </section>
  );
};

export default Contact;