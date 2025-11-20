import { Injectable, signal } from '@angular/core';
import { ClanService } from '../clans/clan.service';
import { Player } from './player-interface';
import { QuestsService } from '../quests/quest.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private _players = signal<Player[]>([
    { id: 1, nickname: 'Suvi', xp: 0, clanId: 1, quests: [1], completedQuests: [], avatarUrl: '' },
    { id: 2, nickname: 'Lunox', xp: 0, clanId: 2, quests: [], completedQuests: [], avatarUrl: '' },
    { id: 3, nickname: 'Nyx', xp: 0, quests: [], completedQuests: [] }
  ]);
  players = this._players;

  constructor(private clanService: ClanService, private questsService: QuestsService) {}

  // vrati zoznam vsetkych hracov
  getAll() { return this.players(); }
  // ziska hraca podla id
  getById(id: number) { return this.players().find(p => p.id === id); }

  // prida hraca a vrati noveho hraca
  addPlayer(p: Partial<Player>) {
    const newPlayer: Player = {
      id: Date.now(),
      nickname: p.nickname ?? 'Newbie',
      xp: p.xp ?? 0,
      clanId: p.clanId,
      quests: p.quests ?? [],
      completedQuests: p.completedQuests ?? [],
      avatarUrl: p.avatarUrl ?? ''
    };
    this._players.update(arr => [...arr, newPlayer]);
    return newPlayer;
  }

  // odstrani hraca a odstrani ho z clanov, ak je clenom
  removePlayer(id: number) {
    this.clanService.getAll().forEach(c => {
      if (c.members.includes(id)) this.clanService.removeMember(c.id, id);
    });
    this._players.update(arr => arr.filter(p => p.id !== id));
  }

  // nastavi clanId pre hraca (musi byt synchronizovane s ClanService pri potrebe)
  setClan(playerId: number, clanId?: number) {
    this._players.update(arr => arr.map(p => p.id === playerId ? { ...p, clanId } : p));
  }

  // prida quest id do zoznamu questov hraca
  addQuestToPlayer(playerId: number, questId: number) {
    this._players.update(arr => arr.map(p => {
      if (p.id !== playerId) return p;
      const q = p.quests ?? [];
      if (q.includes(questId)) return p; // prevent duplicates
      return { ...p, quests: [...q, questId] } as Player;
    }));
  }

  // oznaci quest ako dokonceny pre daneho hraca (presunie z quests do completedQuests)
  markQuestComplete(playerId: number, questId: number) {
    const quest = this.questsService.getQuestById(questId);
    const xpGain = quest?.xp ?? 0;
    this._players.update(arr => arr.map(p => {
      if (p.id !== playerId) return p;
      const quests = (p.quests ?? []).filter(id => id !== questId);
      const completed = [...(p.completedQuests ?? [])];
      if (!completed.includes(questId)) completed.push(questId);
      const newXp = (p.xp ?? 0) + xpGain;
      return { ...p, quests, completedQuests: completed, xp: newXp } as Player;
    }));
  }

  // oznaci quest ako nedokonceny (presunie z completedQuests do quests)
  markQuestIncomplete(playerId: number, questId: number) {
    const quest = this.questsService.getQuestById(questId);
    const xpLoss = quest?.xp ?? 0;
    this._players.update(arr => arr.map(p => {
      if (p.id !== playerId) return p;
      const completed = (p.completedQuests ?? []).filter(id => id !== questId);
      const quests = [...(p.quests ?? [])];
      if (!quests.includes(questId)) quests.push(questId);
      const newXp = Math.max(0, (p.xp ?? 0) - xpLoss);
      return { ...p, quests, completedQuests: completed, xp: newXp } as Player;
    }));
  }
}
