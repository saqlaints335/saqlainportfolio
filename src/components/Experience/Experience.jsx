import "./Experience.css";

import htmlIcon from "../../assets/icons/html.webp";
import cssIcon from "../../assets/icons/css.webp";
import javascriptIcon from "../../assets/icons/javascript.webp";
import msOfficeIcon from "../../assets/icons/wordpress.webp";
import autocadIcon from "../../assets/icons/autocad.webp";
import graphicsIcon from "../../assets/icons/graphics.webp";

const Experience = () => {
  const experiences = [
    {
      year: "2023 - Present",
      role: "Web Developer",
      company: "Predawn Solutions",
      description:
        "Building modern, responsive and user-friendly websites while working on frontend development, performance optimization and client projects.",
    },
    {
      year: "2022 - 2023",
      role: "Frontend Developer",
      company: "Web Development",
      description:
        "Developed responsive website interfaces using HTML, CSS and JavaScript while focusing on clean layouts and cross-device compatibility.",
    },
  ];

  const skills = [
    {
      name: "HTML",
      icon: htmlIcon,
    },
    {
      name: "CSS",
      icon: cssIcon,
    },
    {
      name: "JavaScript",
      icon: javascriptIcon,
    },
    {
      name: "WordPress",
      icon: msOfficeIcon,
    },
    {
      name: "AutoCAD",
      icon: autocadIcon,
    },
    {
      name: "Graphics",
      icon: graphicsIcon,
    },
  ];

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">

        {/* LEFT SIDE */}
        <div className="experience-left">
          <span className="experience-section-title">
            EXPERIENCE
          </span>

          <div className="experience-timeline">
            {experiences.map((item, index) => (
              <div className="experience-item" key={index}>
                <div className="experience-date">
                  <span className="timeline-dot"></span>

                  <span className="experience-year">
                    {item.year}
                  </span>
                </div>

                <div className="experience-details">
                  <h3>{item.role}</h3>

                  <h4>{item.company}</h4>

                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - SKILLS */}
        <div
          id="skills"
          className="experience-skills"
        >
          <span className="experience-section-title">
            SKILLS
          </span>

          <div className="experience-skills-grid">
            {skills.map((skill, index) => (
              <div
                className="experience-skill-card"
                key={index}
              >
                <div className="experience-skill-icon">
                  <img
                    src={skill.icon}
                    alt={`${skill.name} icon`}
                  />
                </div>

                <h3>{skill.name}</h3>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;