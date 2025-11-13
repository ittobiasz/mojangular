import { Injectable, signal } from '@angular/core';
import { ClanService } from '../clans/clan.service';
import { Player } from './player-interface';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _players = signal<Player[]>([
    { id: 1, nickname: 'Suvi', level: 12, clanId: 1, quests: [1], avatarUrl: '' },
    { id: 2, nickname: 'Lunox', level: 7, clanId: 2, quests: [], avatarUrl: '' },
    { id: 3, nickname: 'Nyx', level: 4, quests: [] }
  ]);
  players = this._players;

  constructor(private clanService: ClanService) {}

  getAll() { return this.players(); }
  getById(id: number) { return this.players().find(p => p.id === id); }

  addPlayer(p: Partial<Player>) {
    const newPlayer: Player = {
      id: Date.now(),
      nickname: p.nickname ?? 'Newbie',
      level: p.level ?? 1,
      clanId: p.clanId,
      quests: p.quests ?? [],
      avatarUrl: p.avatarUrl ?? ''
    };
    this._players.update(arr => [...arr, newPlayer]);
    return newPlayer;
  }

  removePlayer(id: number) {
    
    this.clanService.getAll().forEach(c => {
      if (c.members.includes(id)) this.clanService.removeMember(c.id, id);
    });
    this._players.update(arr => arr.filter(p => p.id !== id));
  }

  setClan(playerId: number, clanId?: number) {
    this._players.update(arr => arr.map(p => p.id === playerId ? { ...p, clanId } : p));
  }

  addQuestToPlayer(playerId: number, questId: number) {
    this._players.update(arr => arr.map(p => p.id === playerId ? { ...p, quests: [...(p.quests ?? []), questId] } : p));
  }
}
