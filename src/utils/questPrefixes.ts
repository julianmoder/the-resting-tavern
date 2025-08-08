export function prefixQuestName (name) {
  const randomPrefix = questPrefixes[Math.floor(Math.random() * questPrefixes.length)];
  const prefixedName = name.trim() ? `${randomPrefix} ${name.trim()}` : '';

  return prefixedName;
}

export const questPrefixes = [
  'The Depths of',
  'The Crypts of',
  'The Ruins of',
  'The Halls of',
  'The Shadows of',
  'The Caverns of',
  'The Fortress of',
  'The Ashes of',
  'The Peaks of',
  'The Labyrinth of'
];