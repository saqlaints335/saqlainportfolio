import "./about.css";
import aboutImage from "../../assets/images/about.webp";

const About = () => {
  const infoCards = [
    {
      title: "Name",
      value: "Saqlain",
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M4.5 21c.4-5 3-7.5 7.5-7.5s7.1 2.5 7.5 7.5H4.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Age",
      value: "27",
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="4" y="5.5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7"/>
          <path d="M8 3v5M16 3v5M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
          <path d="M8 14h3M13 14h3M8 17h3M13 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "Location",
      value: "Pakistan",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.7"/>
          <circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7"/>
        </svg>
      ),
    },
    {
      title: "Email",
      value: "saqlain@example.com",
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7"/>
          <path d="m4 6 8 7 8-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="about-section" id="about">
      <div className="about-container">

        <div className="about-image-side">
          <div className="about-dots about-dots-left"></div>
          <div className="about-dots about-dots-right"></div>

          <div className="about-image-frame">
            <img src={aboutImage} alt="Saqlain working on web development" />
          </div>
        </div>

        <div className="about-content">
          <span className="about-label">ABOUT ME</span>

          <h2 className="about-heading">Who I Am</h2>

          <p className="about-description">
            I'm a passionate React Developer with 2+ years of experience
            building high-quality web applications. I love turning ideas
            into real products with clean, efficient and maintainable code.
          </p>

          <div className="about-info-grid">
            {infoCards.map((item) => (
              <div className="about-info-card" key={item.title}>
                <div className="about-info-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;