import "./ProjectsPage.css";
import useContent from "../../content/useContent";
import { fmt } from "../../content/format";
import ProjectCard from "../ProjectCard/ProjectCard";

const ProjectsPage = () => {
  const { projectsPage: page, projects, general } = useContent();

  return (
    <>
    <section className="projects-page-section">
      <div className="projects-page-container">

        {/* LEFT CONTENT */}
        <div className="projects-page-content">

          <span className="projects-page-label">
            {page.label}
          </span>

          <h1 className="projects-page-title">
            {page.titleBefore} <span>{page.titleHighlight}</span>
          </h1>

          <p className="projects-page-description">
            {page.description}
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
                <strong>{fmt(page.stats[0].number, general)}</strong>
                <span>{page.stats[0].label}</span>
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
                <strong>{fmt(page.stats[1].number, general)}</strong>
                <span>{page.stats[1].label}</span>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="projects-page-visual">

          <div className="projects-page-image-glow"></div>

          <div className="projects-page-dot-pattern"></div>

          <img
            src={page.image}
            alt={`Websites built by ${general.fullName}`}
            width="1672"
            height="941"
            fetchPriority="high"
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

            <span>{page.breadcrumbHome}</span>
          </a>

          <span className="projects-page-breadcrumb-arrow">
            ›
          </span>

          <span className="projects-page-breadcrumb-current">
            {page.breadcrumbCurrent}
          </span>

        </div>

      </div>
    </section>

    {/* =========================
        ALL PROJECTS LIST
    ========================== */}
    <section className="projects-all-section" id="all-projects">
      <div className="projects-all-container">

        <div className="projects-all-heading">
          <span className="projects-label">{page.gridLabel}</span>

          <h2 className="projects-heading">{page.gridHeading}</h2>

          {page.gridDescription && (
            <p className="projects-all-text">{page.gridDescription}</p>
          )}
        </div>

        {projects.items.length > 0 ? (
          <div className="projects-page-grid">
            {projects.items.map((project, index) => (
              <ProjectCard
                key={`${project.title}-${index}`}
                project={project}
                liveText={projects.liveButton}
              />
            ))}
          </div>
        ) : (
          <p className="projects-all-text">{page.emptyText}</p>
        )}

      </div>
    </section>
    </>
  );
};

export default ProjectsPage;