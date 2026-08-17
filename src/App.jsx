import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/about/about";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import ProjectsPage from "./components/ProjectsPage/ProjectsPage";

import "./App.css";

function App() {
  const currentPath = window.location.pathname;

  // =========================
  // ALL PROJECTS PAGE
  // =========================
  if (currentPath === "/projects") {
    return (
      <>
        <Header />

        <main className="site-main">
          <ProjectsPage />
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // HOME PAGE
  // =========================
  return (
    <>
      <Header />

      <main className="site-main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;