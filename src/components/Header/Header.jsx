import { useState, useEffect, useRef } from "react";
import "./Header.css";

import logo from "../../assets/images/logo.webp";
import useContent from "../../content/useContent";

// Sections used for the "active link" highlight while scrolling
const SECTION_IDS = ["home", "about", "experience", "projects", "contact"];

const Header = () => {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const onHome = currentPath === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(onHome ? "home" : "projects");

  // "Skills" lives inside the Experience section, so we remember when it was clicked
  const skillsPinned = useRef(
    typeof window !== "undefined" && window.location.hash === "#skills"
  );

  const { header, general } = useContent();

  const navItems = [
    { title: header.navHome, id: "home" },
    { title: header.navAbout, id: "about" },
    { title: header.navExperience, id: "experience" },
    { title: header.navProjects, id: "projects" },
    { title: header.navSkills, id: "skills" },
    { title: header.navContact, id: "contact" },
  ];

  // Files uploaded from the admin panel live on another domain,
  // so they open in a new tab instead of the "download" attribute.
  const cvProps = {
    href: general.resume,
    download: "M-Saqlain-Resume.pdf",
    ...(general.resume.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}),
  };

  // Highlight the nav link of the section currently on screen
  useEffect(() => {
    if (!onHome) return;

    const updateActive = () => {
      let current = "home";

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) {
          current = id;
        }
      }

      // Reached the very bottom of the page (contact / footer)
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) current = "contact";

      if (current === "experience" && skillsPinned.current) {
        current = "skills";
      } else if (current !== "experience") {
        skillsPinned.current = false;
      }

      setActiveLink(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [onHome]);

  const handleNavClick = (e, id) => {
    skillsPinned.current = id === "skills";
    setActiveLink(id);
    setMenuOpen(false);

    // Already on the home page: scroll smoothly instead of reloading the page
    if (id === "home" && onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", "/");
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">

        {/* LOGO */}
        <a
          href="/"
          className="header-logo"
          onClick={(e) => handleNavClick(e, "home")}
          aria-label="Muhammad Saqlain Hashim - Home"
        >
          <img
            src={logo}
            alt="Muhammad Saqlain Hashim logo"
            width="250"
            height="60"
          />
        </a>

        {/* NAVIGATION */}
        <nav className={`header-nav ${menuOpen ? "menu-open" : ""}`}>
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "/" : `/#${item.id}`}
                className={`nav-link ${
                  activeLink === item.id ? "active" : ""
                }`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.title}
              </a>
            ))}
          </div>

          {/* MOBILE DOWNLOAD BUTTON */}
          <a
            {...cvProps}
            className="cv-button mobile-cv-button"
            onClick={() => setMenuOpen(false)}
          >
            <span>{header.cvButton}</span>

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
          {...cvProps}
          className="cv-button desktop-cv-button"
        >
          <span>{header.cvButton}</span>

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