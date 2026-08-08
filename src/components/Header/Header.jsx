import { useState } from "react";
import "./Header.css";

import logo from "../../assets/images/logo.webp";
import resume from "../../assets/resume/M Saqlain Resume.pdf";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  const navItems = [
    { title: "Home", id: "home" },
    { title: "About", id: "about" },
    { title: "Experience", id: "experience" },
    { title: "Projects", id: "projects" },
    { title: "Skills", id: "skills" },
    { title: "Contact", id: "contact" },
  ];

  const handleNavClick = (id) => {
    setActiveLink(id);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* LOGO */}
        <a
          href="#home"
          className="header-logo"
          onClick={() => handleNavClick("home")}
          aria-label="Saqlain Portfolio Home"
        >
          <img src={logo} alt="Saqlain Logo" />
        </a>

        {/* NAVIGATION */}
        <nav className={`header-nav ${menuOpen ? "menu-open" : ""}`}>
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${
                  activeLink === item.id ? "active" : ""
                }`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* MOBILE DOWNLOAD BUTTON */}
          <a
            href={resume}
            download="M Saqlain Resume.pdf"
            className="cv-button mobile-cv-button"
            onClick={() => setMenuOpen(false)}
          >
            <span>Download CV</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3V15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M8 11L12 15L16 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M5 18V20H19V18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>

        {/* DESKTOP DOWNLOAD BUTTON */}
        <a
          href={resume}
          download="M Saqlain Resume.pdf"
          className="cv-button desktop-cv-button"
        >
          <span>Download CV</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 3V15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M8 11L12 15L16 11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M5 18V20H19V18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {/* MOBILE HAMBURGER */}
        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
};

export default Header;