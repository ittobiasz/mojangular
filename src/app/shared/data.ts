export const QUESTS = [
  {
    id: 1,
    title: 'Zapomenutý chrám',
    description: 'Preskúmaj ruiny starého chrámu a odhaľ jeho tajomstvá.',
    xp: 45
  },
  {
    id: 2,
    title: 'Tieň vlka',
    description: 'Vypátraj legendárneho vlka, ktorý sužuje dedinu.',
    xp: 90
  },
  {
    id: 3,
    title: 'Hľadač pokladu',
    description: 'Nájdi ukryté poklady v podzemi.',
    xp: 120
  },
  {
    id: 4,
    title: 'Krvavý rituál',
    description: 'Zabráň temným kňazom v ich rituáli.',
    xp: 150
  },
  {
    id: 5,
    title: 'Záchrana princeznej',
    description: 'Zachráň princeznú z hradu.',
    xp: 100
  },
  {
    id: 6,
    title: 'Drak nad horou',
    description: 'Poraz legendárneho draka.',
    xp: 200
  },
  {
    id: 7,
    title: 'Hlboká jaskyna',
    description: 'Preskúmaj najhlbšie podzemie.',
    xp: 80
  },
  {
    id: 8,
    title: 'Kľúč do záhrady',
    description: 'Nájdi kľúč k zatajenej záhrade.',
    xp: 60
  }
];

export const PLAYERS = [
  {
    id: 1,
    nickname: 'Suvi',
    xp: 300,
    clanId: 1,
    quests: [1, 2],
    completedQuests: [3],
    avatarUrl: ''
  },
  {
    id: 2,
    nickname: 'Lunox',
    xp: 751,
    clanId: 2,
    quests: [2, 3],
    completedQuests: [1],
    avatarUrl: ''
  },
  {
    id: 3,
    nickname: 'Azura',
    xp: 450,
    clanId: 1,
    quests: [4, 5],
    completedQuests: [1, 2],
    avatarUrl: ''
  },
  {
    id: 4,
    nickname: 'Drake',
    xp: 600,
    clanId: 2,
    quests: [3, 6],
    completedQuests: [2, 4],
    avatarUrl: ''
  },
  {
    id: 5,
    nickname: 'Keira',
    xp: 320,
    clanId: 3,
    quests: [1, 7],
    completedQuests: [3],
    avatarUrl: ''
  },
  {
    id: 6,
    nickname: 'Theron',
    xp: 850,
    clanId: 1,
    quests: [8],
    completedQuests: [1, 2, 5, 6],
    avatarUrl: ''
  },
  {
    id: 7,
    nickname: 'Mara',
    xp: 210,
    clanId: 3,
    quests: [4],
    completedQuests: [2],
    avatarUrl: ''
  },
  {
    id: 8,
    nickname: 'Vex',
    xp: 520,
    clanId: 2,
    quests: [5, 7],
    completedQuests: [1, 3, 4],
    avatarUrl: ''
  }
];

export const CLANS = [
  {
    id: 1,
    name: 'Shadow Wolves',
    description: 'Temný klan',
    capacity: 5,
    members: [1, 3, 6],
    avatarUrl: ''
  },
  {
    id: 2,
    name: 'Dark Reign',
    description: 'Súťažný klan',
    capacity: 10,
    members: [2, 4, 8],
    avatarUrl: ''
  },
  {
    id: 3,
    name: 'Midnight Blades',
    description: 'Nočný klan bojovníkov',
    capacity: 8,
    members: [5, 7],
    avatarUrl: ''
  }
];
