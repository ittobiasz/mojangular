export interface Player {
  id: number;
  nickname: string;

  xp?: number;
  clanId?: number;    
  quests?: number[];  
  completedQuests?: number[]; 
  avatarUrl?: string;
}
