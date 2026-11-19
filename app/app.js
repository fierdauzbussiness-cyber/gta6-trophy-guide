// Leonida Trophy Guide — boot, checklist, detail pane and tabs.
// Loads app/data/trophies.json, renders the 55 trophies, and keeps the
// checklist, roadmap and missables views in sync with saved progress.

import {
  loadProgress,
  saveProgress,
  loadSpoilerSetting,
  saveSpoilerSetting,
  exportProgress,
  parseImportFile,
  resetProgress,
} from './store.js';
import { filterTrophies, maskSpoilers, isSpoilerHidden } from './filters.js';
import { renderRoadmap, renderMissables } from './roadmap.js';

const listEl = document.getElementById('list');
const detailEl = document.getElementById('detail');
const roadmapEl = document.getElementById('roadmap');
const missablesEl = document.getElementById('missables');
const searchInput = document.getElementById('searchInput');
const kindChips = document.getElementById('kindChips');
const gradeFilter = document.getElementById('gradeFilter');
const statusFilter = document.getElementById('statusFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const resultsLine = document.getElementById('resultsLine');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const state = {
  kind: 'all',
  grade: 'all',
  status: 'all',
  query: '',
  spoiler: loadSpoilerSetting(),
  earned: loadProgress(),
  selectedId: null,
  view: 'checklist',
};
spoilerToggle.checked = state.spoiler;

function gradeCountsText() {
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
    const total = trophies.filter((t) => t.grade === grade).length;
    const done = trophies.filter((t) => t.grade === grade && state.earned.has(t.id)).length;
    return `${done}/${total} ${grade}`;
  });
  return parts.join(' · ');
}

function renderProgress() {
  const done = state.earned.size;
  document.getElementById('earnedCount').textContent = done;
  document.getElementById('progressText').textContent = `${done} of ${trophies.length} earned`;
  document.getElementById('progressBar').style.width = `${Math.round((done / trophies.length) * 100)}%`;
  document.getElementById('gradeCounts').textContent = gradeCountsText();
}

function trophyTags(trophy) {
  const tags = [];
  for (const kind of trophy.kinds) {
    if (kind === 'platinum') continue;
    tags.push({ text: kind, cls: kind === 'missable' ? 'tag missable' : 'tag' });
  }
  if (trophy.missable) tags.push({ text: '⚠ missable', cls: 'tag missable' });
  if (trophy.count) tags.push({ text: `PSN count: ${trophy.count}`, cls: 'tag count' });
  return tags;
}

function renderChecklist() {
  const shown = filterTrophies(trophies, state);
  listEl.replaceChildren();
  for (const trophy of shown) {
    const view = maskSpoilers(trophy, state.spoiler, state.earned);
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'trophy' + (state.earned.has(trophy.id) ? ' earned' : '') + (state.selectedId === trophy.id ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(trophy.id);
    box.setAttribute('aria-label', `Mark ${view.name} earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleEarned(trophy.id);
    });
    const body = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = view.name;
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = view.description;
    body.append(name, document.createElement('br'), desc);
    const tags = document.createElement('span');
    tags.className = 'tags';
    for (const tag of trophyTags(trophy)) {
      const el = document.createElement('span');
      el.className = tag.cls;
      el.textContent = tag.text;
      tags.append(el);
    }
    body.append(tags);
    const medal = document.createElement('span');
    medal.className = `medal ${trophy.grade}`;
    medal.textContent = trophy.grade;
    row.append(box, body, medal);
    row.addEventListener('click', () => {
      state.selectedId = trophy.id;
      renderChecklist();
      renderDetail();
    });
    listEl.append(row);
  }
  resultsLine.textContent = shown.length === trophies.length
    ? `Showing all ${trophies.length} trophies.`
    : `Showing ${shown.length} of ${trophies.length} trophies.`;
}

function renderDetail() {
  detailEl.replaceChildren();
  const trophy = trophies.find((t) => t.id === state.selectedId);
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Select a trophy on the left to see its full guide, its sources and whether it can be missed.';
    detailEl.append(empty);
    return;
  }
  const hidden = isSpoilerHidden(trophy, state.spoiler, state.earned);
  const view = maskSpoilers(trophy, state.spoiler, state.earned);
  const title = document.createElement('h2');
  title.textContent = view.name;
  const medal = document.createElement('span');
  medal.className = `medal ${trophy.grade}`;
  medal.textContent = trophy.grade;
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden ? 'Story trophy — hidden until earned.' : `Official description: “${trophy.description}”`;
  detailEl.append(title, medal, official);
  if (hidden) {
    const note = document.createElement('p');
    note.textContent = 'Spoilers are on. Turn the “Hide story spoilers” setting off, or earn this trophy, to reveal its guide.';
    detailEl.append(note);
  } else {
    const guideHead = document.createElement('h3');
    guideHead.textContent = 'Guide';
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    detailEl.append(guideHead, guide);
    if (trophy.missable) {
      const missHead = document.createElement('h3');
      missHead.textContent = 'Can it be missed?';
      const miss = document.createElement('p');
      miss.textContent = trophy.missableNote;
      detailEl.append(missHead, miss);
    }
    if (trophy.count) {
      const countHead = document.createElement('h3');
      countHead.textContent = 'PSN count';
      const count = document.createElement('p');
      count.textContent = `PlayStation tracks a count for this trophy: ${trophy.count}. The count is cumulative across your playthrough.`;
      detailEl.append(countHead, count);
    }
    const srcHead = document.createElement('h3');
    srcHead.textContent = 'Sources';
    const src = document.createElement('p');
    src.className = 'sources';
    src.textContent = trophy.sources;
    detailEl.append(srcHead, src);
  }
  const earnBtn = document.createElement('button');
  earnBtn.type = 'button';
  earnBtn.className = 'earn-btn' + (state.earned.has(trophy.id) ? ' earned' : '');
  earnBtn.textContent = state.earned.has(trophy.id) ? '✓ Earned — click to unmark' : 'Mark as earned';
  earnBtn.addEventListener('click', () => toggleEarned(trophy.id));
  detailEl.append(earnBtn);
}

function toggleEarned(id) {
  if (state.earned.has(id)) state.earned.delete(id);
  else state.earned.add(id);
  saveProgress(state.earned);
  renderProgress();
  renderChecklist();
  renderDetail();
  renderRoadmap(roadmapEl, trophies, state.earned, selectTrophy);
  renderMissables(missablesEl, trophies, state.earned, state.spoiler, selectTrophy);
}

function selectTrophy(id) {
  state.selectedId = id;
  showView('checklist');
  renderChecklist();
  renderDetail();
  document.getElementById('view-checklist').scrollIntoView();
}

function showView(view) {
  state.view = view;
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.view === view);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${view}`;
  }
  if (view === 'roadmap') renderRoadmap(roadmapEl, trophies, state.earned, selectTrophy);
  if (view === 'missables') renderMissables(missablesEl, trophies, state.earned, state.spoiler, selectTrophy);
}

for (const button of document.querySelectorAll('.tab')) {
  button.addEventListener('click', () => showView(button.dataset.view));
}
for (const chip of kindChips.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    state.kind = chip.dataset.kind;
    for (const other of kindChips.querySelectorAll('.chip')) {
      other.classList.toggle('active', other === chip);
    }
    renderChecklist();
  });
}
gradeFilter.addEventListener('change', () => {
  state.grade = gradeFilter.value;
  renderChecklist();
});
statusFilter.addEventListener('change', () => {
  state.status = statusFilter.value;
  renderChecklist();
});
searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderChecklist();
});
spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  saveSpoilerSetting(state.spoiler);
  renderChecklist();
  renderDetail();
  renderMissables(missablesEl, trophies, state.earned, state.spoiler, selectTrophy);
});
document.getElementById('exportBtn').addEventListener('click', () => exportProgress(state.earned));
document.getElementById('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    state.earned = parseImportFile(await file.text());
    saveProgress(state.earned);
    renderProgress();
    renderChecklist();
    renderDetail();
  } catch {
    alert('That file is not a trophy progress export from this guide.');
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  state.earned = resetProgress();
  renderProgress();
  renderChecklist();
  renderDetail();
  renderRoadmap(roadmapEl, trophies, state.earned, selectTrophy);
  renderMissables(missablesEl, trophies, state.earned, state.spoiler, selectTrophy);
});

renderProgress();
renderChecklist();
renderDetail();
renderRoadmap(roadmapEl, trophies, state.earned, selectTrophy);
renderMissables(missablesEl, trophies, state.earned, state.spoiler, selectTrophy);
