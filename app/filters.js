// Filtering and the spoiler rule: which trophies a view shows, and what a
// spoiler-hidden story trophy looks like until it is earned.

export const KIND_LABELS = {
  all: 'All kinds',
  story: 'Story',
  missable: 'Missable',
  side: 'Side strands',
  collectibles: 'Collectibles',
  activities: 'Activities',
  platinum: 'Platinum',
};

export function filterTrophies(trophies, state) {
  const query = state.query.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (state.kind !== 'all' && !trophy.kinds.includes(state.kind)) return false;
    if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
    if (state.status === 'earned' && !state.earned.has(trophy.id)) return false;
    if (state.status === 'remaining' && state.earned.has(trophy.id)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function isSpoilerHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.kinds.includes('story') && !earned.has(trophy.id);
}

export function maskSpoilers(trophy, spoilerOn, earned) {
  if (!isSpoilerHidden(trophy, spoilerOn, earned)) return trophy;
  return {
    ...trophy,
    name: 'Hidden story trophy',
    description: 'Hidden until earned — turn spoilers off, or earn it to reveal it.',
    guide: '',
    sources: '',
  };
}
