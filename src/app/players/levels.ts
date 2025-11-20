export interface PlayerLevel {
  level: number;
  xpRequired: number;
  title: string;
}

export const playerLevels: PlayerLevel[] = [
  { level: 1, xpRequired: 0, title: 'Novice' },
  { level: 2, xpRequired: 100, title: 'Apprentice' },
  { level: 3, xpRequired: 300, title: 'Adept' },
  { level: 4, xpRequired: 600, title: 'Expert' },
  { level: 5, xpRequired: 1000, title: 'Master' },
  { level: 6, xpRequired: 2000, title: 'Grandmaster' },
  { level: 7, xpRequired: 3500, title: 'Legend' },
  { level: 8, xpRequired: 5500, title: 'Mythic' },
  { level: 9, xpRequired: 8000, title: 'Immortal' },
  { level: 10, xpRequired: 12000, title: 'Eternal' }
];

// Vrati udaje o leveli pre zadane xp: aktualny level, nasledujuci level (ak existuje) a percento naplnenia
export function getLevelForXp(xp: number) {
  let current = playerLevels[0];
  let next = playerLevels[1];
  for (let i = 0; i < playerLevels.length; i++) {
    const lvl = playerLevels[i];
    const nextLvl = playerLevels[i + 1];
    if (xp >= lvl.xpRequired && (!nextLvl || xp < nextLvl.xpRequired)) {
      current = lvl;
      next = nextLvl;
      break;
    }
  }
  if (!next) {
    return { current, next: undefined, percent: 100 };
  }
  const range = next.xpRequired - current.xpRequired;
  const progress = Math.max(0, Math.min(100, Math.round(((xp - current.xpRequired) / range) * 100)));
  return { current, next, percent: progress };
}
