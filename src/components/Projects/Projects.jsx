import "./Projects.css";

import project1 from "../../assets/images/project-1.webp";
import project2 from "../../assets/images/project-2.webp";
import project3 from "../../assets/images/project-3.webp";
import project4 from "../../assets/images/project-4.webp";

const Projects = () => {
  const projects = [
    {
      title: "Business Website",
      description:
        "Professional WordPress business website with responsive design, clean layout and optimized user experience.",
      image: project1,
      demo: "#",
    },
    {
      title: "E-commerce Store",
      description:
        "WooCommerce powered online store with products, cart, checkout and responsive functionality.",
      image: project2,
      demo: "#",
    },
    {
      title: "Corporate Website",
      description:
        "Modern corporate WordPress website focused on professional branding and lead generation.",
      image: project3,
      demo: "#",
    },
    {
      title: "Service Website",
      description:
        "Responsive WordPress service website designed for performance, conversions and usability.",
      image: project4,
      demo: "#",
    },
  ];

  const stats = [
    {
      number: "20+",
      label: "Projects Completed",
      icon: (
        <svg viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8.5 10h.01M15.5 10h.01M8.5 14.5c2.3 2.1 4.7 2.1 7 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      number: "2+",
      label: "Years Experience",
      icon: (
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
            d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M9 13h6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      number: "5K+",
      label: "Lines of Code",
      icon: (
        <svg viewBox="0 0 24 24">
          <path
            d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },

    {
      number: "10+",
      label: "Happy Clients",
      icon: (
        <svg viewBox="0 0 24 24">
          <path
            d="M7 4h10v5a5 5 0 0 1-10 0V4ZM9 19h6M12 14v5M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">

        {/* TOP HEADING */}
        <div className="projects-heading-row">
          <div className="projects-heading-content">
            <span className="projects-label">
              FEATURED PROJECTS
            </span>

            <h2 className="projects-heading">
              My Recent Projects
            </h2>
          </div>

          <a
            href="/projects"
            className="view-projects-btn"
          >
            <span>View All Projects</span>

            <svg viewBox="0 0 24 24">
              <path
                d="M5 12h14M14 7l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>


        {/* PROJECT CARDS */}
        <div className="projects-grid">
          {projects.map((project, index) => (
            <article
              className="project-card"
              key={index}
            >

              {/* PROJECT IMAGE */}
              <div className="project-image">
                <img
                  src={project.image}
                  alt={project.title}
                />

                <div className="project-image-overlay"></div>
              </div>


              {/* CARD CONTENT */}
              <div className="project-content">
                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>


                <div className="project-bottom">

                  {/* LIVE DEMO */}
                  <a
                    href={project.demo}
                    className="project-demo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>Live Demo</span>

                    <svg viewBox="0 0 24 24">
                      <path
                        d="M14 5h5v5M19 5l-8 8M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>


                  {/* WORDPRESS ICON */}
                  <div
                    className="wordpress-icon"
                    title="WordPress Project"
                  >
                    <svg viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="9.25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                      <path
                        d="M5.9 8.2h3.2M7.2 8.2l3.2 8.6 2.2-5.8M10.8 8.2h3M12.3 8.2l3 8.5 2.2-6.3M16.2 7.2c.9.7 1.4 1.8 1.4 3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.35"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                </div>
              </div>

            </article>
          ))}
        </div>


        {/* STATS */}
        <div className="projects-stats">
          {stats.map((stat, index) => (
            <div
              className="project-stat"
              key={index}
            >

              <div className="project-stat-icon">
                {stat.icon}
              </div>

              <div className="project-stat-content">
                <strong>
                  {stat.number}
                </strong>

                <span>
                  {stat.label}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;