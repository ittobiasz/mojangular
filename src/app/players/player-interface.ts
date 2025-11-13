export interface Player {
  id: number;
  nickname: string;
  level: number;
  clanId?: number;    
  quests?: number[];  
  avatarUrl?: string;
}
