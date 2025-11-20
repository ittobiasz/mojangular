import { Injectable, signal } from '@angular/core';
import { Clan } from './clan-interface';

@Injectable({ providedIn: 'root' })
export class ClanService {
  private _clans = signal<Clan[]>([
    { id: 1, name: 'Shadow Wolves', description: 'Temný klan', capacity: 5, members: [1], avatarUrl: '' },
    { id: 2, name: 'Dark Reign', description: 'Súťažný klan', capacity: 10, members: [2], avatarUrl: '' }
  ]);
  clans = this._clans;

  // vrati zoznam vsetkych clanov
  getAll() { return this.clans(); }
  // ziska clan podla id
  getById(id: number) { return this.clans().find(c => c.id === id); }

  // prida novy clan a vrati ho
  addClan(c: Partial<Clan>) {
    const newClan: Clan = {
      id: Date.now(),
      name: c.name ?? 'New Clan',
      description: c.description ?? '',
      capacity: c.capacity ?? 5,
      members: c.members ?? [],
      avatarUrl: c.avatarUrl ?? ''
    };
    this._clans.update(arr => [...arr, newClan]);
    return newClan;
  }

  // odstrani clan podla id
  removeClan(id: number) {
    this._clans.update(arr => arr.filter(c => c.id !== id));
  }

  // prida hraca do clanu ak nie je plny; vrati true ak uspesne
  addMember(clanId: number, playerId: number): boolean {
    const clan = this.getById(clanId);
    if (!clan) return false;
    if (clan.members.length >= clan.capacity) return false;
    this._clans.update(arr => arr.map(c => c.id === clanId ? { ...c, members: [...c.members, playerId] } : c));
    return true;
  }

  // odstrani hraca z clanu
  removeMember(clanId: number, playerId: number) {
    this._clans.update(arr => arr.map(c => c.id === clanId ? { ...c, members: c.members.filter(id => id !== playerId) } : c));
  }
}
