export interface Player {
  id: number;
  nickname: string;
  // xp miesto statickeho levelu; level sa vypocita z XP
  xp?: number;
  clanId?: number;    
  quests?: number[];  // priradene, este nedokoncene
  completedQuests?: number[]; // dokoncené questy
  avatarUrl?: string;
}
