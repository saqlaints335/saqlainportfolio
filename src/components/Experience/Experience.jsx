import "./Experience.css";
import useContent from "../../content/useContent";

import htmlIcon from "../../assets/icons/html.webp";
import cssIcon from "../../assets/icons/css.webp";
import javascriptIcon from "../../assets/icons/javascript.webp";
import wordpressIcon from "../../assets/icons/wordpress.webp";
import autocadIcon from "../../assets/icons/autocad.webp";
import graphicsIcon from "../../assets/icons/graphics.webp";

const BUILT_IN_ICONS = {
  html: htmlIcon,
  css: cssIcon,
  javascript: javascriptIcon,
  wordpress: wordpressIcon,
  autocad: autocadIcon,
  graphics: graphicsIcon,
};

const Experience = () => {
  const { experience } = useContent();

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">

        {/* LEFT SIDE */}
        <div className="experience-left">
          <span className="experience-section-title">{experience.title}</span>

          <div className="experience-timeline">
            {experience.items.map((item, index) => (
              <div className="experience-item" key={index}>
                <div className="experience-date">
                  <span className="timeline-dot"></span>

                  <span className="experience-year">{item.year}</span>
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
        <div id="skills" className="experience-skills">
          <span className="experience-section-title">{experience.skillsTitle}</span>

          <div className="experience-skills-grid">
            {experience.skills.map((skill, index) => {
              const icon = skill.icon === "custom" ? skill.customIcon : BUILT_IN_ICONS[skill.icon];

              return (
                <div className="experience-skill-card" key={index}>
                  <div className="experience-skill-icon">
                    {icon && <img src={icon} alt={`${skill.name} icon`} loading="lazy" />}
                  </div>

                  <h3>{skill.name}</h3>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
