import "./ProjectsPage.css";
import projectImage from "../../assets/images/project.webp";

const ProjectsPage = () => {
  return (
    <section className="projects-page-section">
      <div className="projects-page-container">

        {/* LEFT CONTENT */}
        <div className="projects-page-content">

          <span className="projects-page-label">
            PORTFOLIO
          </span>

          <h1 className="projects-page-title">
            My All <span>Projects</span>
          </h1>

          <p className="projects-page-description">
            Here you can see all of my WordPress projects.
            Each project is carefully designed and developed
            to deliver the best results.
          </p>

          {/* STATS */}
          <div className="projects-page-stats">

            {/* PROJECTS COMPLETED */}
            <div className="projects-page-stat">

              <div className="projects-page-stat-icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="5"
                    y="6"
                    width="14"
                    height="14"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M9 12h6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="projects-page-stat-text">
                <strong>30+</strong>
                <span>Projects Completed</span>
              </div>

            </div>

            {/* CLIENT SATISFACTION */}
            <div className="projects-page-stat">

              <div className="projects-page-stat-icon">
                <svg viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="m8.5 12 2.2 2.2 4.8-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="projects-page-stat-text">
                <strong>100%</strong>
                <span>Client Satisfaction</span>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="projects-page-visual">

          <div className="projects-page-image-glow"></div>

          <div className="projects-page-dot-pattern"></div>

          <img
            src={projectImage}
            alt="WordPress projects showcase"
            className="projects-page-image"
          />

        </div>

        {/* BREADCRUMB */}
        <div className="projects-page-breadcrumb">

          <a href="/">
            <svg viewBox="0 0 24 24">
              <path
                d="m3 11 9-8 9 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M5 10v10h14V10M9 20v-6h6v6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>Home</span>
          </a>

          <span className="projects-page-breadcrumb-arrow">
            ›
          </span>

          <span className="projects-page-breadcrumb-current">
            My All Projects
          </span>

        </div>

      </div>
    </section>
  );
};

export default ProjectsPage;