const { pageSize, tickerIntervalMs, tickerVisibleRows, storageKey } = window.APP_CONFIG;

const grid = document.getElementById('agents');
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const resultsCount = document.getElementById('results-count');
const topbar = document.querySelector('.topbar');
const backToTop = document.getElementById('back-to-top');
const progress = document.getElementById('read-progress');
const tickerToggle = document.getElementById('ticker-toggle');
const preview = document.getElementById('row-preview');
const scrollContext = document.getElementById('scroll-context');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour12: false, timeZone: 'UTC' });
}

function countByAgent(events) {
  const counts = {};
  events.forEach((event) => {
    counts[event.agent] = (counts[event.agent] || 0) + 1;
  });
  return counts;
}

function renderAgents() {
  const counts = countByAgent(window.ACTIVITY);
  grid.innerHTML = window.AGENTS.map((agent, index) => {
    const image = 'assets/agents/agent-' + String((index % 12) + 1).padStart(2, '0') + '.webp';
    return (
      '<article class="agent-card">' +
      '<img class="agent-avatar" src="' + image + '" width="48" height="48" loading="lazy" decoding="async" alt="">' +
      '<h3>' + escapeHtml(agent.name) + '</h3>' +
      '<p class="agent-owner">' + escapeHtml(agent.owner) + '</p>' +
      '<p class="agent-description">' + escapeHtml(agent.description) + '</p>' +
      '<p class="agent-count">' + (counts[agent.name] || 0).toLocaleString() + ' calls today</p>' +
      '</article>'
    );
  }).join('');
}

function loadViewed() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function rememberViewed(items) {
  const viewed = loadViewed();
  for (const item of items) {
    if (!viewed.includes(item.id)) {
      viewed.push(item.id);
    }
    localStorage.setItem(storageKey, JSON.stringify(viewed));
  }
}

const newestFirst = window.ACTIVITY.slice().sort((a, b) =>
  a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
);

let searchText;

function search(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return newestFirst;
  searchText ??= newestFirst.map((event) => JSON.stringify(event).toLowerCase());
  return newestFirst.filter((_, index) => searchText[index].includes(needle));
}

function renderResults(query) {
  const matches = search(query);
  const page = matches.slice(0, pageSize);
  const viewed = loadViewed();
  resultsCount.textContent = matches.length.toLocaleString() + ' matching tool calls';
  resultsList.innerHTML = page.map((event) => {
    const isNew = !viewed.includes(event.id);
    return (
      '<li class="result-row status-' + event.status + '" data-id="' + event.id + '" data-minute="' + event.timestamp.slice(11, 16) + '">' +
      '<span class="result-time">' + formatTime(event.timestamp) + '</span>' +
      '<span class="result-agent">' + escapeHtml(event.agent) + '</span>' +
      '<span class="result-tool">' + escapeHtml(event.tool) + '</span>' +
      '<span class="result-status">' + event.status + '</span>' +
      '<span class="result-latency">' + event.latencyMs + ' ms</span>' +
      '<span class="result-summary">' + escapeHtml(event.summary) + '</span>' +
      (isNew ? '<span class="badge-new">New</span>' : '') +
      '</li>'
    );
  }).join('');
  fitSummaries();
  rememberViewed(page);
}


function fitSummaries() {
  let size = 14;
  let cells = Array.from(resultsList.querySelectorAll('.result-summary'));
  cells.forEach((cell) => (cell.style.fontSize = size + 'px'));
  while (size > 11) {
    cells = cells.filter((cell) => cell.scrollWidth > cell.clientWidth);
    if (cells.length === 0) break;
    size -= 0.5;
    cells.forEach((cell) => (cell.style.fontSize = size + 'px'));
  }
}

let callsPerMinute = null;

function countCallsPerMinute() {
  if (!callsPerMinute) {
    callsPerMinute = new Map();
    for (const event of window.ACTIVITY) {
      const minute = event.timestamp.slice(11, 16);
      callsPerMinute.set(minute, (callsPerMinute.get(minute) || 0) + 1);
    }
  }
  return callsPerMinute;
}

let scrollFrame = 0;

function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    updateOnScroll();
  });
}

let lastPadding = '';
let lastContext = '';

function updateOnScroll() {
  const scrolled = window.scrollY;
  const viewport = window.innerHeight;
  const max = document.documentElement.scrollHeight - viewport;
  const rows = Array.from(resultsList.querySelectorAll('.result-row'));
  const inFocus = rows.map((row) => {
    const top = row.getBoundingClientRect().top;
    return top > viewport * 0.3 && top < viewport * 0.6;
  });

  progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  topbar.classList.toggle('topbar-raised', scrolled > 8);
  const padding = Math.max(6, 12 - scrolled / 20) + 'px';
  if (padding !== lastPadding) {
    topbar.style.paddingBlock = padding;
    lastPadding = padding;
  }
  backToTop.classList.toggle('visible', scrolled > viewport);
  
  rows.forEach((row, index) => row.classList.toggle('in-focus', inFocus[index]));

  const focused = rows[inFocus.indexOf(true)];
  let context = '';
  if (focused) {
    const minute = focused.dataset.minute;
    context = minute + ' UTC · ' + (countCallsPerMinute().get(minute) || 0) + ' calls that minute';
  }
  if (context !== lastContext) {
    scrollContext.textContent = context;
    lastContext = context;
  }
}

function hidePreview() {
  preview.hidden = true;
}

function showPreview(event) {
  const row = event.target.closest('.result-row');
  if (!row) return;
  const item = window.ACTIVITY.find((candidate) => candidate.id === row.dataset.id);
  if (!item) return;
  preview.textContent = item.summary;
  preview.style.top = event.clientY + 12 + 'px';
  preview.style.left = event.clientX + 12 + 'px';
  preview.hidden = false;
}

let tickerPanel = null;
let tickerTimer = null;


function tickerRow(event) {
  const row = document.createElement('li');
  row.className = 'ticker-row status-' + event.status;
  row.innerHTML =
    '<span class="ticker-time">' + formatTime(event.timestamp) + '</span>' +
    '<span class="ticker-agent">' + escapeHtml(event.agent) + '</span>' +
    '<span class="ticker-tool">' + escapeHtml(event.tool) + '</span>';
  return row;
}

function onTickerKeydown(event) {
  if (event.key === 'Escape') closeTicker();
}

function positionTicker() {
  if (!tickerPanel) return;
  tickerPanel.style.maxHeight = window.innerHeight - 120 + 'px';
}

function openTicker() {
  const panel = document.createElement('aside');
  panel.className = 'ticker';
  panel.innerHTML = '<header class="ticker-header">Live tool calls</header><ul class="ticker-list"></ul>';
  document.body.appendChild(panel);
  tickerPanel = panel;
  const list = panel.querySelector('.ticker-list');

  tickerTimer = setInterval(() => {
    const event = window.ACTIVITY[Math.floor(Math.random() * window.ACTIVITY.length)];
    list.prepend(tickerRow(event));
    while (list.children.length > tickerVisibleRows) {
      list.lastElementChild.remove();
    }
  }, tickerIntervalMs);

  window.addEventListener('resize', positionTicker);
  window.addEventListener('keydown', onTickerKeydown);
  positionTicker();
  tickerToggle.setAttribute('aria-pressed', 'true');
  tickerToggle.textContent = 'Hide live calls';
}

function closeTicker() {
  if (!tickerPanel) return;
  clearInterval(tickerTimer);
  tickerTimer = null;
  window.removeEventListener('resize', positionTicker);
  window.removeEventListener('keydown', onTickerKeydown);
  tickerPanel.remove();
  tickerPanel = null;
  tickerToggle.setAttribute('aria-pressed', 'false');
  tickerToggle.textContent = 'Show live calls';
}

let searchTimer = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => renderResults(searchInput.value), 150);
});
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', fitSummaries);
resultsList.addEventListener('mousemove', showPreview);
resultsList.addEventListener('mouseleave', hidePreview);
resultsList.addEventListener('wheel', hidePreview);
resultsList.addEventListener('touchstart', hidePreview);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
tickerToggle.addEventListener('click', () => (tickerPanel ? closeTicker() : openTicker()));

renderAgents();
renderResults('');
