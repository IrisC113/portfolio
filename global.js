console.log("IT’S ALIVE!");

// Helper function
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// --- Dynamic Navigation ---
const pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "resume/", title: "Resume" },
  { url: "contact/", title: "Contact" },
  { url: "meta/", title: "Meta" },
  { url: "https://github.com/IrisC113", title: "GitHub" },
];

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";

const nav = document.createElement("nav");
document.body.prepend(nav);

for (const p of pages) {
  let url = p.url;
  const title = p.title;

  if (!url.startsWith("http")) {
    url = BASE_PATH + url;
  }

  const a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // Highlight current page
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // External links open in new tab
  a.toggleAttribute("target", a.host !== location.host);

  nav.append(a);
}

// --- Theme Toggle Button ---
const themes = [
  { value: "light", icon: "☀️", label: "Light" },
  { value: "dark", icon: "🌙", label: "Dark" },
  { value: "light dark", icon: "🌓", label: "Auto" },
];

const root = document.documentElement;

let currentThemeIndex = 2; // default: auto
if ("colorScheme" in localStorage) {
  const saved = localStorage.colorScheme;
  const idx = themes.findIndex((t) => t.value === saved);
  if (idx !== -1) currentThemeIndex = idx;
}

root.style.setProperty("color-scheme", themes[currentThemeIndex].value);

const themeBtn = document.createElement("button");
themeBtn.id = "theme-toggle";
themeBtn.setAttribute("aria-label", "Toggle theme");
themeBtn.title = themes[currentThemeIndex].label;
themeBtn.textContent = themes[currentThemeIndex].icon;
document.body.appendChild(themeBtn);

themeBtn.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const theme = themes[currentThemeIndex];
  root.style.setProperty("color-scheme", theme.value);
  localStorage.colorScheme = theme.value;
  themeBtn.textContent = theme.icon;
  themeBtn.title = theme.label;
});


/*contact*/
const form = document.querySelector("form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  let params = [];

  for (let [name, value] of data) {

    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  const url = `${form.action}?${params.join("&")}`;

  console.log("Final mailto URL:", url);

  location.href = url;
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

/*projects*/
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error('Container element not found.');
    return;
  }

  const basePath = typeof BASE_PATH !== 'undefined' ? BASE_PATH : '/';

  containerElement.innerHTML = '';

  for (const project of projects) {
    const article = document.createElement('article');

    let imageUrl = project.image;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${basePath}${project.image}`;
    }

    let projectLinkHtml = '';

    if (project.link) {
      projectLinkHtml = `<p class="project-link"><a href="${project.link}" target="_blank">View Project &rarr;</a></p>`;
    }

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div class="project-text">
        <p>${project.description}</p>
        <p class="project-year">
            ${project.year ? project.year : ''}
            ${projectLinkHtml} 
        </p>
      </div>
    `;
    containerElement.appendChild(article);
  }

  if (projects.length === 0) {
    containerElement.innerHTML = '<p>No projects available at the moment.</p>';
  }
}


// --- Fetch GitHub Data ---
export async function fetchGitHubData(username) {
  try {
    return await fetchJSON(`https://api.github.com/users/${username}`);
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
  }
}


