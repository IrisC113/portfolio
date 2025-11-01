import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const container = document.querySelector('.projects');
const title = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

renderProjects(projects, container, 'h2');
title.textContent = `Projects (${projects.length})`;

let query = '';
let selectedIndex = -1;
let data = [];

function getFilteredProjects() {
  return projects.filter((p) => {
    const matchesSearch = Object.values(p)
      .join('\n')
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesYear =
      selectedIndex === -1 || p.year.trim() === data[selectedIndex]?.label;
    return matchesSearch && matchesYear;
  });
}

function renderPieChart(projectsGiven) {
  const svg = d3.select('#projects-pie-plot');
  svg.selectAll('*').remove();

  const legend = d3.select('.legend');
  legend.selectAll('*').remove();

  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year.trim()
  );

  data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);
  const arcs = arcData.map((d) => arcGenerator(d));

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;

        svg
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr(
            'class',
            (_, idx) => `legend-item${idx === selectedIndex ? ' selected' : ''}`
          );

        const filtered = getFilteredProjects();
        renderProjects(filtered, container, 'h2');
        title.textContent =
          selectedIndex === -1
            ? `Projects (${filtered.length})`
            : `Projects (${filtered.length}) in ${data[selectedIndex].label}`;
      });
  });

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr(
        'class',
        `legend-item${idx === selectedIndex ? ' selected' : ''}`
      )
      .html(
        `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`
      )
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        svg
          .selectAll('path')
          .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr(
            'class',
            (_, i) => `legend-item${i === selectedIndex ? ' selected' : ''}`
          );

        const filtered = getFilteredProjects();
        renderProjects(filtered, container, 'h2');
        title.textContent =
          selectedIndex === -1
            ? `Projects (${filtered.length})`
            : `Projects (${filtered.length}) in ${data[selectedIndex].label}`;
      });
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  const filtered = getFilteredProjects();
  renderProjects(filtered, container, 'h2');
  renderPieChart(projects); 
});
