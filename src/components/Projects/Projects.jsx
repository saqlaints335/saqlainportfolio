import "./Projects.css";
import useContent from "../../content/useContent";
import { fmt } from "../../content/format";
import ProjectCard from "../ProjectCard/ProjectCard";

// Icons for the 4 stats (same order as the stats list in the admin panel)
const STAT_ICONS = [
  <svg viewBox="0 0 24 24" key="1">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.5 10h.01M15.5 10h.01M8.5 14.5c2.3 2.1 4.7 2.1 7 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,
  <svg viewBox="0 0 24 24" key="2">
    <rect x="4" y="7" width="16" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M9 13h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,
  <svg viewBox="0 0 24 24" key="3">
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg viewBox="0 0 24 24" key="4">
    <path
      d="M7 4h10v5a5 5 0 0 1-10 0V4ZM9 19h6M12 14v5M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
];

const Projects = () => {
  const { projects, projectsSection, general } = useContent();

  // Cards chosen with "Show on home page" in the admin panel
  const featured = projects.items.filter((project) => project.featured);

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">

        {/* TOP HEADING */}
        <div className="projects-heading-row">
          <div className="projects-heading-content">
            <span className="projects-label">{projectsSection.label}</span>

            <h2 className="projects-heading">{projectsSection.heading}</h2>
          </div>

          <a href="/projects" className="view-projects-btn">
            <span>{projectsSection.viewAll}</span>

            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M14 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* PROJECT CARDS */}
        <div className="projects-grid">
          {featured.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} liveText={projects.liveButton} />
          ))}
        </div>

        {/* STATS */}
        <div className="projects-stats">
          {projectsSection.stats.map((stat, index) => (
            <div className="project-stat" key={index}>
              <div className="project-stat-icon">{STAT_ICONS[index]}</div>

              <div className="project-stat-content">
                <strong>{fmt(stat.number, general)}</strong>

                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
