import { lazy, Suspense, useEffect } from "react";

import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/about/about";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

import ProjectsPage from "./components/ProjectsPage/ProjectsPage";

import useSeo from "./hooks/useSeo";
import useContent from "./content/useContent";

import "./App.css";

// Admin panel is loaded only when someone opens the admin address
const Admin = lazy(() => import("./admin/Admin"));

// Change the address with VITE_ADMIN_PATH (default: /wp-admin)
const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || "/wp-admin").replace(/\/+$/, "") || "/wp-admin";

function App() {
  const { seo } = useContent();

  // "/projects/" and "/projects" are treated the same
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  const isAdmin = currentPath === ADMIN_PATH || currentPath.startsWith(`${ADMIN_PATH}/`);
  const isHome = currentPath === "/";
  const isProjectsPage = currentPath === "/projects";
  const isUnknownPage = !isHome && !isProjectsPage && !isAdmin;

  const homeSeo = { title: seo.homeTitle, description: seo.homeDescription, path: "/" };
  const projectsSeo = { title: seo.projectsTitle, description: seo.projectsDescription, path: "/projects" };

  // Per-page title, description & canonical (admin / unknown pages are never indexed)
  useSeo(
    isAdmin
      ? { title: "Admin", description: "Admin", path: ADMIN_PATH, noindex: true }
      : isProjectsPage
      ? projectsSeo
      : isUnknownPage
      ? { ...homeSeo, noindex: true }
      : homeSeo
  );

  // Any unknown URL goes back to the home page (avoids duplicate content)
  useEffect(() => {
    if (isUnknownPage) {
      window.location.replace("/");
    }
  }, [isUnknownPage]);

  if (isUnknownPage) {
    return null;
  }

  // =========================
  // ADMIN PANEL
  // =========================
  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }

  // =========================
  // ALL PROJECTS PAGE
  // =========================
  if (isProjectsPage) {
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
