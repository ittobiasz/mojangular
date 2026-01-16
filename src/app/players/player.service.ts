import { Injectable, signal } from '@angular/core';
import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from '@angular/fire/firestore';
import { PLAYERS } from '../shared/data';
import { ClanService } from '../clans/clan.service';
import { Player } from './player-interface';
import { QuestsService } from '../quests/quest.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  
  private _players = signal<Player[]>(PLAYERS);
  players = this._players;

  constructor(private firestore: Firestore, private clanService: ClanService, private questsService: QuestsService) {
    this.loadPlayers();
  }

  private loadPlayers() {
    const playersRef = collection(this.firestore, 'players');
    const qRef = query(playersRef, orderBy('id', 'asc'));
    onSnapshot(qRef, (snapshot) => {
      // If collection empty, show local stock and attempt lightweight seed
      if (snapshot.empty) {
        this._players.set(PLAYERS);
        // best-effort seed (will fail silently if rules block)
        PLAYERS.forEach(p => {
          addDoc(playersRef, p).catch(() => {});
        });
        return;
      }
      const data = snapshot.docs.map(d => {
        const p = d.data() as any;
        return {
          ...p,
          docId: d.id,
          id: p.id ?? 0,
          xp: p.xp ?? 0,
          quests: p.quests ?? [],
          completedQuests: p.completedQuests ?? [],
        } as Player & { docId: string };
      });
      this._players.set(data);
    }, () => {
      this._players.set(PLAYERS);
    });
  }

  getAll() { 
    return this.players(); 
  }
 
  getById(id: number) { 
    return this.players().find(p => p.id === id); 
  }

  addPlayer(p: Partial<Player>) {
    const nextId = this._players().length > 0 ? Math.max(...this._players().map(pl => typeof pl.id === 'number' ? pl.id : 0)) + 1 : 1;
    const newPlayer: Player = {
      id: nextId,
      nickname: p.nickname ?? 'Newbie',
      xp: p.xp ?? 0,
      clanId: p.clanId,
      quests: p.quests ?? [],
      completedQuests: p.completedQuests ?? [],
      avatarUrl: p.avatarUrl ?? ''
    };
    const playersRef = collection(this.firestore, 'players');
    addDoc(playersRef, newPlayer).then(() => {
      if (newPlayer.clanId) this.clanService.addMember(newPlayer.clanId, newPlayer.id);
    }).catch(() => {
      this._players.update(arr => [...arr, newPlayer]);
      if (newPlayer.clanId) this.clanService.addMember(newPlayer.clanId, newPlayer.id);
    });
    return newPlayer;
  }

  removePlayer(id: number) {
    const existing = this._players().find(p => p.id === id) as (Player & { docId?: string }) | undefined;
    if (existing?.docId) {
      const docRef = doc(this.firestore, 'players', existing.docId);
      deleteDoc(docRef).catch(() => {
        this._players.update(arr => arr.filter(p => p.id !== id));
      });
    }
  }

  setClan(playerId: number, clanId?: number) {
    const existing = this._players().find(p => p.id === playerId) as (Player & { docId?: string }) | undefined;
    if (existing?.docId) {
      const docRef = doc(this.firestore, 'players', existing.docId);
      updateDoc(docRef, { clanId }).catch(() => {
        this._players.update(arr => arr.map(p => p.id === playerId ? { ...p, clanId } : p));
      });
    }
  }

  addQuestToPlayer(playerId: number, questId: number) {
    const player = this.getById(playerId);
    if (!player) return;
    
    const q = player.quests ?? [];
    if (q.includes(questId)) return;
    
    const updatedQuests = [...q, questId];
    const existing = this._players().find(p => p.id === playerId) as (Player & { docId?: string }) | undefined;
    if (existing?.docId) {
      const docRef = doc(this.firestore, 'players', existing.docId);
      updateDoc(docRef, { quests: updatedQuests }).catch(() => {
        this._players.update(arr => arr.map(p => p.id === playerId ? { ...p, quests: updatedQuests } : p));
      });
    }
  }

  markQuestComplete(playerId: number, questId: number) {
    const quest = this.questsService.getQuestById(questId);
    const xpGain = quest?.xp ?? 0;
    const player = this.getById(playerId);
    if (!player) return;
    
    const quests = (player.quests ?? []).filter(id => id !== questId);
    const completed = [...(player.completedQuests ?? [])];
    if (!completed.includes(questId)) completed.push(questId);
    const newXp = (player.xp ?? 0) + xpGain;
    
    const existing = this._players().find(p => p.id === playerId) as (Player & { docId?: string }) | undefined;
    if (existing?.docId) {
      const docRef = doc(this.firestore, 'players', existing.docId);
      updateDoc(docRef, { quests, completedQuests: completed, xp: newXp }).catch(() => {
        this._players.update(arr => arr.map(p => p.id === playerId ? { 
          ...p, 
          quests, 
          completedQuests: completed, 
          xp: newXp 
        } : p));
      });
    }
  }

  markQuestIncomplete(playerId: number, questId: number) {
    const quest = this.questsService.getQuestById(questId);
    const xpLoss = quest?.xp ?? 0;
    const player = this.getById(playerId);
    if (!player) return;
    
    const completed = (player.completedQuests ?? []).filter(id => id !== questId);
    const quests = [...(player.quests ?? [])];
    if (!quests.includes(questId)) quests.push(questId);
    const newXp = Math.max(0, (player.xp ?? 0) - xpLoss);
    
    const existing = this._players().find(p => p.id === playerId) as (Player & { docId?: string }) | undefined;
    if (existing?.docId) {
      const docRef = doc(this.firestore, 'players', existing.docId);
      updateDoc(docRef, { quests, completedQuests: completed, xp: newXp }).catch(() => {
        this._players.update(arr => arr.map(p => p.id === playerId ? { 
          ...p, 
          quests, 
          completedQuests: completed, 
          xp: newXp 
        } : p));
      });
    }
  }
}
