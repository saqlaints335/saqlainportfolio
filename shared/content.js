// =====================================================================
// SINGLE SOURCE OF TRUTH for all editable website content.
//  - The admin panel builds its forms from SCHEMA
//  - The server validates / cleans saved data with sanitizeContent()
//  - The website uses buildDefaults() until saved content is loaded
// To make a new piece of text editable: add a field here, then use it
// in the component with useContent().
// =====================================================================

const T = (key, label, def = "", extra = {}) => ({ key, label, type: "text", default: def, ...extra });
const A = (key, label, def = "", extra = {}) => ({ key, label, type: "textarea", default: def, ...extra });
const U = (key, label, def = "", extra = {}) => ({ key, label, type: "url", default: def, ...extra });
const I = (key, label, def = "", extra = {}) => ({ key, label, type: "image", default: def, ...extra });
const F = (key, label, def = "", extra = {}) => ({ key, label, type: "file", default: def, ...extra });
const B = (key, label, def = false, extra = {}) => ({ key, label, type: "bool", default: def, ...extra });
const S = (key, label, options, def, extra = {}) => ({ key, label, type: "select", options, default: def ?? options[0].value, ...extra });
const L = (key, label, itemFields, def, extra = {}) => ({ key, label, type: "list", itemFields, default: def, ...extra });

const ICONS = [
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "wordpress", label: "WordPress" },
  { value: "autocad", label: "AutoCAD" },
  { value: "graphics", label: "Graphics" },
  { value: "custom", label: "Custom (upload below)" },
];

const PLATFORMS = [
  { value: "wordpress", label: "WordPress" },
  { value: "react", label: "React" },
  { value: "code", label: "HTML / CSS / JavaScript" },
  { value: "none", label: "No icon" },
];

const HELP_PLACEHOLDERS = "Tip: {years} and {projects} are replaced automatically with the numbers from General.";

export const SCHEMA = [
  {
    id: "general",
    title: "General & Social",
    description: "Used in many places (hero, about, contact, footer).",
    fields: [
      T("fullName", "Full name", "Muhammad Saqlain Hashim"),
      T("email", "Email", "saqlaints335@gmail.com"),
      T("phone", "Phone (shown on the site)", "+92 304 1528632"),
      T("location", "Location", "Pakistan"),
      T("yearsExperience", "Years of experience", "3+", { help: "Used as {years} everywhere." }),
      T("projectsCompleted", "Projects completed", "20+", { help: "Used as {projects} everywhere." }),
      U("github", "GitHub link", "https://github.com/saqlaints335"),
      U("linkedin", "LinkedIn link", "https://www.linkedin.com/in/muhammad-saqlain-hashim-7923071a5"),
      U("facebook", "Facebook link", "https://www.facebook.com/saqlain.malik.3192/"),
      U("instagram", "Instagram link", "https://www.instagram.com/saqlainmalik661"),
      F("resume", "CV / Resume (PDF)", "/M-Saqlain-Resume.pdf", { help: "Upload a new PDF to replace the Download CV file." }),
    ],
  },
  {
    id: "header",
    title: "Header",
    fields: [
      T("navHome", "Menu: Home", "Home"),
      T("navAbout", "Menu: About", "About"),
      T("navExperience", "Menu: Experience", "Experience"),
      T("navProjects", "Menu: Projects", "Projects"),
      T("navSkills", "Menu: Skills", "Skills"),
      T("navContact", "Menu: Contact", "Contact"),
      T("cvButton", "Download CV button", "Download CV"),
    ],
  },
  {
    id: "hero",
    title: "Hero (top section)",
    fields: [
      T("greeting", "Small greeting", "HI, I'M"),
      T("name", "Big name", "Saqlain"),
      T("roleHighlight", "Role - gold word", "Web"),
      T("roleRest", "Role - white word", "Developer"),
      A("description", "Description", "I build modern, responsive and user-friendly web applications using React.js and other modern technologies."),
      T("primaryButton", "Button 1 (calls your phone)", "Hire Me"),
      T("secondaryButton", "Button 2 (goes to projects)", "View Projects"),
      T("followTitle", "Social title", "Follow Me"),
      T("cardLine1", "Experience card - line 1", "Years of"),
      T("cardLine2", "Experience card - line 2", "Experience"),
      I("image", "Hero image (transparent PNG/WebP looks best)", "/images/hero-person.webp"),
    ],
  },
  {
    id: "about",
    title: "About",
    fields: [
      T("label", "Small label", "ABOUT ME"),
      T("heading", "Heading", "Who I Am"),
      A("description", "Description", "I'm a passionate web developer with {years} years of experience building responsive WordPress websites and modern React applications. I love turning ideas into real products with clean, efficient and maintainable code.", { help: HELP_PLACEHOLDERS }),
      T("age", "Age", "28"),
      I("image", "About image", "/images/about.webp"),
    ],
  },
  {
    id: "experience",
    title: "Experience & Skills",
    fields: [
      T("title", "Experience title", "EXPERIENCE"),
      L(
        "items",
        "Jobs",
        [
          T("year", "Years (e.g. 2022 - 2025)", ""),
          T("role", "Job title", ""),
          T("company", "Company", ""),
          A("description", "Description", ""),
        ],
        [
          {
            year: "2026 - Present",
            role: "WordPress Developer",
            company: "Predawn Solution (Software House), Multan",
            description: "Developing, customizing and maintaining WordPress websites on live client projects, including plugins, themes, content updates and website optimization.",
          },
          {
            year: "2022 - 2025",
            role: "WordPress Developer",
            company: "TS Software House, Layyah",
            description: "Built and managed multiple business websites, customizing themes and plugins, and fixing layout, responsiveness and functionality issues across all devices.",
          },
          {
            year: "2021 - 2022",
            role: "Graphic Designer",
            company: "Freelance (Fiverr)",
            description: "Designed logos, business cards and branding materials, along with image editing and visual enhancements using Photoshop, Illustrator and InDesign.",
          },
        ],
        { itemLabel: "role", itemName: "job", max: 12 }
      ),
      T("skillsTitle", "Skills title", "SKILLS"),
      L(
        "skills",
        "Skills",
        [
          T("name", "Skill name", ""),
          S("icon", "Icon", ICONS, "html"),
          I("customIcon", "Custom icon (only if icon = Custom)", ""),
        ],
        [
          { name: "HTML", icon: "html", customIcon: "" },
          { name: "CSS", icon: "css", customIcon: "" },
          { name: "JavaScript", icon: "javascript", customIcon: "" },
          { name: "WordPress", icon: "wordpress", customIcon: "" },
          { name: "AutoCAD", icon: "autocad", customIcon: "" },
          { name: "Graphics", icon: "graphics", customIcon: "" },
        ],
        { itemLabel: "name", itemName: "skill", max: 18 }
      ),
    ],
  },
  {
    id: "projects",
    title: "Projects (add / edit)",
    description: "Every project appears on the All Projects page. Turn on 'Show on home page' for the ones you want on the home page (4 looks best).",
    fields: [
      T("liveButton", "Live link button text", "View Live", { help: "Example: View Live, Visit Website, Open Site" }),
      L(
        "items",
        "Projects",
        [
          T("title", "Project name", ""),
          T("type", "Project type", "", { help: "Example: Dental Clinic Website, E-commerce Store" }),
          U("url", "Live website link", "", { help: "Full link starting with https://" }),
          I("image", "Feature image (full-page screenshot works best)", "", {
            help: "Upload a tall full-page screenshot: on hover the card scrolls the whole page smoothly.",
          }),
          A("description", "Short description", ""),
          S("platform", "Built with", PLATFORMS, "wordpress"),
          B("featured", "Show on home page", false),
        ],
        [
          {
            title: "Belmont Fitness",
            type: "Personal Training & Fitness Coaching",
            url: "https://belmontfitness.com.au/",
            image: "/projects/project-1.webp",
            description: "WordPress website for a Brisbane personal trainer with coaching programs, free downloads and online coaching enquiries.",
            platform: "wordpress",
            featured: true,
          },
          {
            title: "Downtown Funk DJs",
            type: "Wedding DJ & Entertainment",
            url: "https://downtownfunkdjs.com/",
            image: "/projects/project-2.webp",
            description: "Elegant WordPress website for a wedding DJ and MC service with pricing packages, event services and a booking form.",
            platform: "wordpress",
            featured: true,
          },
          {
            title: "Leon Elite Ride",
            type: "Luxury Chauffeur & Private Transportation",
            url: "https://leoneliteride.com/",
            image: "/projects/project-3.webp",
            description: "Premium WordPress website for a private ride service with a clear ride request flow and quick WhatsApp contact.",
            platform: "wordpress",
            featured: true,
          },
          {
            title: "Prosper & Smile",
            type: "Dental Clinic Website",
            url: "https://prosperandsmile.com/",
            image: "/projects/project-4.webp",
            description: "Calm, modern WordPress website for a dental practice with service pages, patient resources and appointment requests.",
            platform: "wordpress",
            featured: true,
          },
        ],
        { itemLabel: "title", itemName: "project", max: 60, quickAdd: true }
      ),
    ],
  },
  {
    id: "projectsSection",
    title: "Home: Projects section text",
    fields: [
      T("label", "Small label", "FEATURED PROJECTS"),
      T("heading", "Heading", "My Recent Projects"),
      T("viewAll", "View all button", "View All Projects"),
      L(
        "stats",
        "Stats bar (4 items)",
        [T("number", "Number", "", { help: HELP_PLACEHOLDERS }), T("label", "Label", "")],
        [
          { number: "{projects}", label: "Projects Completed" },
          { number: "{years}", label: "Years Experience" },
          { number: "5K+", label: "Lines of Code" },
          { number: "10+", label: "Happy Clients" },
        ],
        { itemLabel: "label", fixed: true }
      ),
    ],
  },
  {
    id: "projectsPage",
    title: "All Projects page",
    fields: [
      T("label", "Small label", "PORTFOLIO"),
      T("titleBefore", "Title - white part", "My All"),
      T("titleHighlight", "Title - gold part", "Projects"),
      A("description", "Description", "Here you can see all of my WordPress projects. Each project is carefully designed and developed to deliver the best results."),
      L(
        "stats",
        "Stats (2 items)",
        [T("number", "Number", "", { help: HELP_PLACEHOLDERS }), T("label", "Label", "")],
        [
          { number: "{projects}", label: "Projects Completed" },
          { number: "100%", label: "Client Satisfaction" },
        ],
        { itemLabel: "label", fixed: true }
      ),
      I("image", "Right side image", "/images/projects-showcase.webp"),
      T("breadcrumbHome", "Breadcrumb: home", "Home"),
      T("breadcrumbCurrent", "Breadcrumb: this page", "My All Projects"),
      T("gridLabel", "Projects list: small label", "SELECTED WORK"),
      T("gridHeading", "Projects list: heading", "Websites I've Built"),
      T("gridDescription", "Projects list: text", "Hover over a card to preview the complete website."),
      T("emptyText", "Text when there are no projects", "Projects are coming soon."),
    ],
  },
  {
    id: "contact",
    title: "Contact section & form",
    fields: [
      T("label", "Small label", "CONTACT"),
      T("heading", "Heading", "Get In Touch"),
      A("description", "Description", "I'm currently available for freelance work. If you have a project in mind, feel free to contact me."),
      T("namePlaceholder", "Name field", "Your Name"),
      T("emailPlaceholder", "Email field", "Your Email"),
      T("countryPlaceholder", "Country field", "Select your country"),
      T("budgetPlaceholder", "Budget field", "Your Budget (e.g. $500)"),
      T("subjectPlaceholder", "Subject field", "Subject"),
      T("messagePlaceholder", "Message field", "Your Message"),
      T("button", "Send button", "Send Message"),
      T("sending", "Sending text", "Sending..."),
      T("success", "Success message", "Message sent successfully."),
      T("error", "Error message", "Something went wrong. Please try again."),
    ],
  },
  {
    id: "footer",
    title: "Footer",
    fields: [
      A("description", "Description", "I build modern, responsive and user-focused digital experiences with clean code and thoughtful design."),
      T("navTitle", "Navigation title", "NAVIGATION"),
      T("ctaTitle", "Right column title", "LET'S WORK TOGETHER"),
      T("ctaBefore", "Heading - start", "Let's build something"),
      T("ctaHighlight", "Heading - gold word", "great"),
      T("ctaAfter", "Heading - end", "together."),
      A("ctaDescription", "Text under heading", "I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision."),
      T("ctaButton", "Button", "Let's Talk"),
      T("crafted", "Bottom middle text", "Crafted with passion & code"),
      T("backToTop", "Back to top", "Back to top"),
    ],
  },
  {
    id: "seo",
    title: "SEO (Google)",
    description: "Title ~60 characters, description ~155 characters. These are what people see in Google.",
    fields: [
      T("homeTitle", "Home page title", "Muhammad Saqlain Hashim | WordPress & Web Developer in Pakistan"),
      A("homeDescription", "Home page description", "Portfolio of Muhammad Saqlain Hashim, a WordPress and web developer from Pakistan. I build fast, responsive business websites, WooCommerce stores and React apps."),
      T("projectsTitle", "Projects page title", "WordPress Projects | Muhammad Saqlain Hashim"),
      A("projectsDescription", "Projects page description", "Browse WordPress websites built by Muhammad Saqlain Hashim: business sites, WooCommerce stores, corporate and service websites with responsive design."),
    ],
  },
];

// ---------------------------------------------------------------------
const clone = (v) => JSON.parse(JSON.stringify(v));

export function blankItem(itemFields) {
  const out = {};
  itemFields.forEach((f) => (out[f.key] = clone(f.default ?? (f.type === "bool" ? false : ""))));
  return out;
}

export function buildDefaults() {
  const out = {};
  SCHEMA.forEach((g) => {
    out[g.id] = {};
    g.fields.forEach((f) => (out[g.id][f.key] = clone(f.default)));
  });
  return out;
}

// Allows: empty, "/relative", "https://..." (blocks javascript: and others)
function safeUrl(value, fallback) {
  if (value === undefined || value === null) return fallback ?? "";
  const v = String(value).trim().slice(0, 1000);
  if (v === "") return "";
  if (/^\/(?!\/)/.test(v)) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return fallback ?? "";
}

function sanitizeField(field, value) {
  switch (field.type) {
    case "bool":
      return value === undefined ? !!field.default : value === true || value === "true";
    case "select": {
      const allowed = field.options.map((o) => o.value);
      return allowed.includes(value) ? value : field.default;
    }
    case "url":
    case "image":
    case "file":
      return safeUrl(value, field.default);
    case "list": {
      if (!Array.isArray(value)) return clone(field.default);
      const max = field.max || 50;
      return value.slice(0, max).map((item) => sanitizeObject(field.itemFields, item || {}));
    }
    case "textarea":
      return value === undefined || value === null ? field.default : String(value).slice(0, 4000);
    default:
      return value === undefined || value === null ? field.default : String(value).slice(0, 500);
  }
}

function sanitizeObject(fields, obj) {
  const out = {};
  fields.forEach((f) => {
    out[f.key] = sanitizeField(f, obj ? obj[f.key] : undefined);
  });
  return out;
}

// Takes anything (saved data, user input) and returns a complete, safe content object.
export function sanitizeContent(input) {
  const src = input && typeof input === "object" ? input : {};
  const out = {};
  SCHEMA.forEach((g) => {
    out[g.id] = sanitizeObject(g.fields, src[g.id]);
    // fixed-length lists keep their length
    g.fields.forEach((f) => {
      if (f.type === "list" && f.fixed) {
        out[g.id][f.key] = f.default.map((d, i) => ({
          ...d,
          ...(out[g.id][f.key][i] || {}),
        }));
      }
    });
  });
  return out;
}
