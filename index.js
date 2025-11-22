import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function renderLatestProjects() {
  try {
    const projects = await fetchJSON('./lib/projects.json') || [];
    const latestProjects = projects.slice(0, 3);

    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) {
      console.error('Missing .projects container in index.html');
      return;
    }

    renderProjects(latestProjects, projectsContainer, 'h2');

    if (latestProjects.length === 0) {
      projectsContainer.innerHTML = '<p>No projects to display at the moment.</p>';
    }
  } catch (err) {
    console.error('Error rendering latest projects:', err);
  }
}

renderLatestProjects();

async function renderGitHubStats(username) {
  try {
    const githubData = await fetchGitHubData(username);

    const profileStats = document.querySelector('#profile-stats');
    if (!profileStats) {
      console.warn('No #profile-stats container found');
      return;
    }
    
    profileStats.innerHTML = `
      <div class="github-header">
        <img src="${githubData.avatar_url}" alt="${githubData.login} GitHub Avatar" class="github-avatar">
        <h2>${githubData.login}</h2>
      </div>
      <dl class="github-grid">
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  } catch (err) {
    console.error('Error fetching GitHub data:', err);
  }
}

renderGitHubStats('IrisC113');
