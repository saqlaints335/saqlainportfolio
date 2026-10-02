import "./Hero.css";
import useContent from "../../content/useContent";
import { telLink } from "../../content/format";
import { GithubIcon, LinkedinIcon, FacebookIcon, MailIcon } from "../icons/SocialIcons";

const Hero = () => {
  const { hero, general } = useContent();

  const socials = [
    { label: "GitHub", href: general.github, icon: <GithubIcon /> },
    { label: "LinkedIn", href: general.linkedin, icon: <LinkedinIcon /> },
    { label: "Facebook", href: general.facebook, icon: <FacebookIcon /> },
    { label: "Email", href: general.email ? `mailto:${general.email}` : "", icon: <MailIcon />, internal: true },
  ].filter((item) => item.href);

  return (
    <section className="hero-section" id="home">
      <div className="hero-container">

        {/* =========================
            LEFT CONTENT
        ========================== */}
        <div className="hero-content">
          <span className="hero-subtitle">{hero.greeting}</span>

          <h1 className="hero-title">{hero.name}</h1>

          <h2 className="hero-role">
            <span>{hero.roleHighlight}</span> {hero.roleRest}
          </h2>

          <p className="hero-description">{hero.description}</p>

          {/* BUTTONS */}
          <div className="hero-buttons">

            <a href={telLink(general.phone)} className="hero-btn hero-btn-primary">
              {hero.primaryButton}

              <svg viewBox="0 0 24 24">
                <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="m14 7 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <a href="#projects" className="hero-btn hero-btn-secondary">
              {hero.secondaryButton}

              <svg viewBox="0 0 24 24">
                <rect x="4" y="7" width="16" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </a>

          </div>

          {/* SOCIAL */}
          <div className="hero-follow">
            <span className="hero-follow-title">{hero.followTitle}</span>

            <div className="hero-socials">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="hero-social-link"
                  aria-label={item.label}
                  {...(item.internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

        </div>


        {/* =========================
            RIGHT VISUAL
        ========================== */}
        <div className="hero-visual">

          {/* Background graphic */}
          <div className="hero-tech-bg">
            <div className="tech-circle tech-circle-one"></div>
            <div className="tech-circle tech-circle-two"></div>
            <div className="tech-dot-pattern"></div>
            <div className="tech-line tech-line-one"></div>
            <div className="tech-line tech-line-two"></div>
          </div>

          {/* PERSON */}
          <img
            src={hero.image}
            alt={`${general.fullName}, WordPress and web developer`}
            width="1378"
            height="1141"
            fetchPriority="high"
            decoding="async"
            className="hero-person"
          />

          {/* EXPERIENCE CARD */}
          <div className="experience-card">

            <div className="experience-icon">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="7" width="16" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </div>

            <strong>{general.yearsExperience}</strong>

            <p>
              {hero.cardLine1}
              <br />
              {hero.cardLine2}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
