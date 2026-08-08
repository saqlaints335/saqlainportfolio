import "./Hero.css";
import heroImage from "../../assets/hero.png";

const Hero = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-container">

        {/* =========================
            LEFT CONTENT
        ========================== */}
        <div className="hero-content">
          <span className="hero-subtitle">
            HI, I'M
          </span>

          <h1 className="hero-title">
            Saqlain
          </h1>

          <h2 className="hero-role">
            <span>React</span> Developer
          </h2>

          <p className="hero-description">
            I build modern, responsive and user-friendly web
            applications using React.js and other modern technologies.
          </p>

          {/* BUTTONS */}
          <div className="hero-buttons">

            <a
              href="#contact"
              className="hero-btn hero-btn-primary"
            >
              Hire Me

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

            <a
              href="#projects"
              className="hero-btn hero-btn-secondary"
            >
              View Projects

              <svg viewBox="0 0 24 24">
                <rect
                  x="4"
                  y="7"
                  width="16"
                  height="13"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

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
            <span className="hero-follow-title">
              Follow Me
            </span>

            <div className="hero-socials">

              {/* GitHub */}
              <a
                href="#"
                className="hero-social-link"
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
                className="hero-social-link"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M5.2 7.6H1.7V22h3.5V7.6ZM3.45 2A2.05 2.05 0 1 0 3.45 6.1 2.05 2.05 0 0 0 3.45 2ZM22.3 13.8c0-4.25-2.26-6.22-5.28-6.22-2.44 0-3.53 1.34-4.14 2.28V7.6H9.37V22h3.51v-7.12c0-1.88.36-3.7 2.69-3.7 2.29 0 2.32 2.15 2.32 3.82V22h3.52l.89-8.2Z"
                  />
                </svg>
              </a>

              {/* X */}
              <a
                href="#"
                className="hero-social-link"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18.9 2H22l-6.76 7.72L23 22h-6.06l-4.75-6.2L6.77 22H3.66l7.23-8.25L1 2h6.22l4.3 5.68L18.9 2Zm-1.06 18h1.68L6.3 3.9H4.5L17.84 20Z"
                  />
                </svg>
              </a>

              {/* Email */}
              <a
                href="#contact"
                className="hero-social-link"
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
            src={heroImage}
            alt="Saqlain React Developer"
            className="hero-person"
          />

          {/* EXPERIENCE CARD */}
          <div className="experience-card">

            <div className="experience-icon">
              <svg viewBox="0 0 24 24">
                <rect
                  x="4"
                  y="7"
                  width="16"
                  height="13"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </div>

            <strong>2+</strong>

            <p>
              Years of
              <br />
              Experience
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;