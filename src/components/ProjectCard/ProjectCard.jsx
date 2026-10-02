import { useCallback, useEffect, useRef, useState } from "react";
import "../Projects/Projects.css";
import "./ProjectCard.css";

const PlatformIcon = ({ platform }) => {
  if (platform === "none") return null;

  const titles = { wordpress: "WordPress Project", react: "React Project", code: "HTML, CSS & JavaScript Project" };

  return (
    <div className="wordpress-icon" title={titles[platform] || "Project"}>
      {platform === "wordpress" ? (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M5.9 8.2h3.2M7.2 8.2l3.2 8.6 2.2-5.8M10.8 8.2h3M12.3 8.2l3 8.5 2.2-6.3M16.2 7.2c.9.7 1.4 1.8 1.4 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};

// A project card. If the feature image is a tall full-page screenshot,
// the whole page scrolls up smoothly on hover and returns on mouse leave.
const ProjectCard = ({ project, liveText = "View Live" }) => {
  const frameRef = useRef(null);
  const imgRef = useRef(null);
  const [distance, setDistance] = useState(0);

  const measure = useCallback(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    setDistance(Math.max(0, Math.round(img.offsetHeight - frame.offsetHeight)));
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [measure]);

  // Image may already be loaded (cache) before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) measure();
  }, [measure, project.image]);

  const scrolls = distance > 8;
  const seconds = Math.min(12, Math.max(3, distance / 130));

  return (
    <article
      className={`project-card ${scrolls ? "project-card-scroll" : ""}`}
      style={{ "--scroll-dist": `${distance}px`, "--scroll-time": `${seconds}s` }}
    >
      <div className="project-image" ref={frameRef}>
        {project.image && (
          <img
            ref={imgRef}
            src={project.image}
            alt={`${project.title} - ${project.type || "website"} by Muhammad Saqlain Hashim`}
            loading="lazy"
            decoding="async"
            onLoad={measure}
          />
        )}
        <div className="project-image-overlay"></div>
      </div>

      <div className="project-content">
        {project.type && <span className="project-type">{project.type}</span>}

        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className={`project-bottom ${project.url ? "" : "project-bottom-no-demo"}`}>
          {project.url && (
            <a href={project.url} className="project-demo" target="_blank" rel="noopener noreferrer">
              <span>{liveText}</span>

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
          )}

          <PlatformIcon platform={project.platform} />
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
