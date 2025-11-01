import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const container = document.querySelector('.projects');
renderProjects(projects, container, 'h2');

const title = document.querySelector('.projects-title');
title.textContent = `Projects (${projects.length})`;

let searchInput = document.querySelector('.searchBar');
let query = '';

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('*').remove();

  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year.trim()
  );

  let data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg
        .selectAll('path')
        .attr('class', (_, idx) => (
          idx === selectedIndex ? 'selected' : ''));

      legend
        .selectAll('li')
          .attr('class', (_, idx) => `legend-item${idx === selectedIndex ? ' selected' : ''}`);

      if (selectedIndex === -1) {
          renderProjects(projects, container, 'h2');
          title.textContent = `Projects (${projects.length})`;
        } else {
          let selectedYear = data[selectedIndex].label;
          let filtered = projects.filter((p) => p.year.trim() === selectedYear);
          renderProjects(filtered, container, 'h2');
          title.textContent = `Projects (${filtered.length}) in ${selectedYear}`;
        }
      });
});

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg
        .selectAll('path')
        .attr('class', (_, idx) => (
          idx === selectedIndex ? 'selected' : ''));

      legend
        .selectAll('li')
          .attr('class', (_, idx) => `legend-item${idx === selectedIndex ? ' selected' : ''}`);

      if (selectedIndex === -1) {
          renderProjects(projects, container, 'h2');
          title.textContent = `Projects (${projects.length})`;
        } else {
          let selectedYear = data[selectedIndex].label;
          let filtered = projects.filter((p) => p.year.trim() === selectedYear);
          renderProjects(filtered, container, 'h2');
          title.textContent = `Projects (${filtered.length}) in ${selectedYear}`;
        }
      });
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, container, 'h2');
  renderPieChart(filteredProjects);
});
