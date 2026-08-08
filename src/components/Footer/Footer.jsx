import "./Footer.css";
import logo from "../../assets/images/logo.webp";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="portfolio-footer">
      <div className="footer-glow footer-glow-left"></div>
      <div className="footer-glow footer-glow-right"></div>

      <div className="footer-container">

        {/* =====================
            MAIN FOOTER
        ====================== */}

        <div className="footer-main">

          {/* BRAND COLUMN */}
          <div className="footer-brand-column">

            <a href="#home" className="footer-logo">
              <img src={logo} alt="Saqlain Logo" />
            </a>

            <p className="footer-description">
              I build modern, responsive and user-focused digital
              experiences with clean code and thoughtful design.
            </p>

            {/* SOCIAL ICONS */}
            <div className="footer-socials">

              {/* GitHub */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.31-1.25-1.66-1.25-1.66-1.03-.7.08-.69.08-.69 1.13.08 1.73 1.17 1.73 1.17 1.01 1.73 2.64 1.23 3.29.94.1-.73.39-1.23.72-1.51-2.51-.29-5.14-1.26-5.14-5.57 0-1.23.44-2.23 1.17-3.02-.12-.29-.51-1.44.11-2.98 0 0 .95-.3 3.07 1.15a10.6 10.6 0 0 1 5.6 0c2.13-1.45 3.08-1.15 3.08-1.15.61 1.54.22 2.69.1 2.98.73.79 1.17 1.79 1.17 3.02 0 4.32-2.64 5.27-5.15 5.56.4.35.76 1.04.76 2.1v3.1c0 .3.21.65.78.54A11.2 11.2 0 0 0 12 .8Z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M5.2 7.6H1.7V22h3.5V7.6ZM3.45 2A2.05 2.05 0 1 0 3.45 6.1 2.05 2.05 0 0 0 3.45 2ZM22.3 13.8c0-4.25-2.26-6.22-5.28-6.22-2.44 0-3.53 1.34-4.14 2.28V7.6H9.37V22h3.51v-7.12c0-1.88.36-3.7 2.69-3.7 2.29 0 2.32 2.15 2.32 3.82V22h3.52l.89-8.2Z"
                  />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:yourmail@example.com"
                className="footer-social-link"
                aria-label="Email"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3 5.5h18v13H3v-13Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="m3.5 6 8.5 6.7L20.5 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <circle
                    cx="17.4"
                    cy="6.6"
                    r="1"
                    fill="currentColor"
                  />
                </svg>
              </a>

            </div>
          </div>


          {/* NAVIGATION COLUMN */}
          <div className="footer-nav-column">

            <span className="footer-column-title">
              NAVIGATION
            </span>

            <div className="footer-title-line"></div>

            <nav className="footer-navigation">
              {footerLinks.map((link) => (
                <a
                  href={link.href}
                  key={link.name}
                  className="footer-nav-link"
                >
                  <span className="footer-arrow">
                    ›
                  </span>

                  <span>
                    {link.name}
                  </span>
                </a>
              ))}
            </nav>

          </div>


          {/* CTA COLUMN */}
          <div className="footer-cta-column">

            <span className="footer-column-title">
              LET'S WORK TOGETHER
            </span>

            <div className="footer-title-line"></div>

            <h2 className="footer-heading">
              Let's build something
              <span> great </span>
              together.
            </h2>

            <p className="footer-cta-description">
              I'm always open to discussing new projects,
              creative ideas or opportunities to be part of
              your vision.
            </p>

            <a href="#contact" className="footer-cta-button">
              <span>Let's Talk</span>

              <svg viewBox="0 0 24 24">
                <path
                  d="M5 12h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                <path
                  d="m14 7 5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

          </div>

        </div>


        {/* =====================
            BOTTOM FOOTER
        ====================== */}

        <div className="footer-bottom">

          <p className="footer-copyright">
            <span>©</span>
            {currentYear} Saqlain. All rights reserved.
          </p>

          <div className="footer-crafted">
            <svg viewBox="0 0 24 24">
              <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>

            <span>
              Crafted with passion & code
            </span>
          </div>

          <a href="#home" className="footer-back-top">
            <span>Back to top</span>

            <span className="back-top-icon">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 19V5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <path
                  d="m7 10 5-5 5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>

        </div>

      </div>
    </footer>
  );
};

export default Footer;