import "./Footer.css";
import logo from "../../assets/images/logo.webp";
import useContent from "../../content/useContent";
import { GithubIcon, LinkedinIcon, FacebookIcon, MailIcon, InstagramIcon } from "../icons/SocialIcons";

const Footer = () => {
  const { footer, header, general } = useContent();

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: header.navHome, href: "/" },
    { name: header.navAbout, href: "/#about" },
    { name: header.navExperience, href: "/#experience" },
    { name: header.navProjects, href: "/#projects" },
    { name: header.navSkills, href: "/#skills" },
    { name: header.navContact, href: "/#contact" },
  ];

  const socials = [
    { label: "GitHub", href: general.github, icon: <GithubIcon /> },
    { label: "LinkedIn", href: general.linkedin, icon: <LinkedinIcon /> },
    { label: "Facebook", href: general.facebook, icon: <FacebookIcon /> },
    { label: "Email", href: general.email ? `mailto:${general.email}` : "", icon: <MailIcon />, internal: true },
    { label: "Instagram", href: general.instagram, icon: <InstagramIcon /> },
  ].filter((item) => item.href);

  // Works on both the home page and the /projects page
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

            <a href="/" className="footer-logo" onClick={scrollToTop}>
              <img
                src={logo}
                alt={`${general.fullName} logo`}
                width="205"
                height="148"
                loading="lazy"
              />
            </a>

            <p className="footer-description">{footer.description}</p>

            {/* SOCIAL ICONS */}
            <div className="footer-socials">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="footer-social-link"
                  aria-label={item.label}
                  {...(item.internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>


          {/* NAVIGATION COLUMN */}
          <div className="footer-nav-column">

            <span className="footer-column-title">{footer.navTitle}</span>

            <div className="footer-title-line"></div>

            <nav className="footer-navigation">
              {footerLinks.map((link) => (
                <a href={link.href} key={link.href} className="footer-nav-link">
                  <span className="footer-arrow">›</span>

                  <span>{link.name}</span>
                </a>
              ))}
            </nav>

          </div>


          {/* CTA COLUMN */}
          <div className="footer-cta-column">

            <span className="footer-column-title">{footer.ctaTitle}</span>

            <div className="footer-title-line"></div>

            <h2 className="footer-heading">
              {footer.ctaBefore}
              <span> {footer.ctaHighlight} </span>
              {footer.ctaAfter}
            </h2>

            <p className="footer-cta-description">{footer.ctaDescription}</p>

            <a href="/#contact" className="footer-cta-button">
              <span>{footer.ctaButton}</span>

              <svg viewBox="0 0 24 24">
                <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="m14 7 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
            {currentYear} {general.fullName}. All rights reserved.
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

            <span>{footer.crafted}</span>
          </div>

          <a href="/" className="footer-back-top" onClick={scrollToTop}>
            <span>{footer.backToTop}</span>

            <span className="back-top-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 19V5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                <path d="m7 10 5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
