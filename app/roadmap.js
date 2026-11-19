// The roadmap to the platinum: five stages in the order to earn them, built
// from the official descriptions, plus the missables page.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story',
    blurb: 'Chapters 1 to 4, the named story missions and the final mission. Do the missable mission trophies as the story offers them — they are flagged on the Missables tab.',
  },
  {
    stage: 2,
    title: 'Side strands',
    blurb: 'The strangers and side characters: Andy, Kenton, Billy, Randy and Tyrone each have a final mission, Bret has a hunt, and any 8 stranger strands earn the silver.',
  },
  {
    stage: 3,
    title: 'Activities and skills',
    blurb: 'The open-world grind: shooting range golds, stunts, races, fishing, meditation, challenges, robberies and the odd one-off moments. Most of these stack up while you explore.',
  },
  {
    stage: 4,
    title: 'Collectibles and money',
    blurb: 'Card sets, WAiNK It locations, discovered vehicles, the 52 areas of Leonida, laundering marked bills, spending and the 8 garages. Save the expensive ones for when the story has paid out.',
  },
  {
    stage: 5,
    title: '100% and the platinum',
    blurb: 'Clean up whatever the checklist still shows, then attain 100% completion. The platinum pops the moment the other 54 are earned.',
  },
];

export function renderRoadmap(container, trophies, earned, onSelect) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const members = trophies.filter((t) => t.stage === stage.stage);
    const done = members.filter((t) => earned.has(t.id)).length;
    const section = document.createElement('section');
    section.className = 'stage';
    const heading = document.createElement('h2');
    heading.innerHTML = '';
    const num = document.createElement('span');
    num.className = 'stage-num';
    num.textContent = `Stage ${stage.stage} — `;
    heading.append(num, document.createTextNode(`${stage.title} · ${done}/${members.length}`));
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    const row = document.createElement('div');
    row.className = 'chips-row';
    for (const trophy of members) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'stage-chip' + (earned.has(trophy.id) ? ' earned' : '');
      chip.textContent = `${earned.has(trophy.id) ? '✓ ' : ''}${trophy.name} (${trophy.grade})`;
      chip.addEventListener('click', () => onSelect(trophy.id));
      row.append(chip);
    }
    section.append(heading, blurb, row);
    container.append(section);
  }
}

export function renderMissables(container, trophies, earned, spoilerOn, onSelect) {
  container.replaceChildren();
  const flagged = trophies.filter((t) => t.missable);
  for (const trophy of flagged) {
    const hidden = spoilerOn && trophy.kinds.includes('story') && !earned.has(trophy.id);
    const card = document.createElement('article');
    card.className = 'missable-row';
    const title = document.createElement('h3');
    title.textContent = hidden ? 'Hidden story trophy' : `${trophy.name} — ${trophy.grade}`;
    const reason = document.createElement('p');
    reason.textContent = hidden
      ? 'A named story mission. Turn spoilers off, or earn it, to see which one.'
      : `${trophy.missableNote} Official description: “${trophy.description}”`;
    card.append(title, reason);
    card.addEventListener('click', () => onSelect(trophy.id));
    container.append(card);
  }
  const note = document.createElement('p');
  note.className = 'view-intro';
  note.textContent = `${flagged.length} trophies flagged. Chapter trophies and the final mission are not flagged: finishing the story earns them no matter what.`;
  container.append(note);
}
