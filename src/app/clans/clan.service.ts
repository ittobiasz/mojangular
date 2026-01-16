import { Injectable, signal } from '@angular/core';
import { Firestore, collection, doc, addDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from '@angular/fire/firestore';
import { CLANS } from '../shared/data';
import { Clan } from './clan-interface';

@Injectable({ providedIn: 'root' })
export class ClanService {
  
  private _clans = signal<Clan[]>(CLANS);
  clans = this._clans;

  constructor(private firestore: Firestore) {
    this.loadClans();
  }

  private loadClans() {
    const clansRef = collection(this.firestore, 'clans');
    const qRef = query(clansRef, orderBy('id', 'asc'));
    onSnapshot(qRef, (snapshot) => {
      if (snapshot.empty) {
        this._clans.set(CLANS);
        CLANS.forEach(c => {
          addDoc(clansRef, c).catch(() => {});
        });
        return;
      }
      const data = snapshot.docs.map(d => {
        const c = d.data() as any;
        return {
          ...c,
          docId: d.id,
          id: c.id ?? 0,
          members: c.members ?? [],
          capacity: c.capacity ?? 5,
        } as Clan & { docId: string };
      });
      this._clans.set(data);
    }, () => this._clans.set(CLANS));
  }

  // vrati zoznam vsetkych clanov
  getAll() { return this.clans(); }
  
  // ziska clan podla id
  getById(id: number) { return this.clans().find(c => c.id === id); }

  // prida novy clan a vrati ho
  addClan(c: Partial<Clan>) {
    const nextId = this._clans().length > 0 ? Math.max(...this._clans().map(cl => typeof cl.id === 'number' ? cl.id : 0)) + 1 : 1;
    const newClan: Clan = {
      id: nextId,
      name: c.name ?? 'New Clan',
      description: c.description ?? '',
      capacity: c.capacity ?? 5,
      members: c.members ?? [],
      avatarUrl: c.avatarUrl ?? ''
    };
    const clansRef = collection(this.firestore, 'clans');
    addDoc(clansRef, newClan).catch(() => {
      this._clans.update(arr => [...arr, newClan]);
    });
    return newClan;
  }

  // odstrani clan podla id
  removeClan(id: number) {
    const existing = this._clans().find(c => c.id === id) as (Clan & { docId?: string }) | undefined;
    if (existing?.docId) {
      const docRef = doc(this.firestore, 'clans', existing.docId);
      deleteDoc(docRef).catch(() => {
        this._clans.update(arr => arr.filter(c => c.id !== id));
      });
    }
  }

  // prida hraca do clanu ak nie je plny; vrati true ak uspesne
  addMember(clanId: number, playerId: number): boolean {
    const clan = this.getById(clanId);
    if (!clan) return false;
    if (clan.members.length >= clan.capacity) return false;
    if (clan.members.includes(playerId)) return false;
    
    const updatedMembers = [...clan.members, playerId];
    if ((clan as any).docId) {
      const docRef = doc(this.firestore, 'clans', (clan as any).docId);
      updateDoc(docRef, { members: updatedMembers }).catch(() => {
        this._clans.update(arr => arr.map(c => c.id === clanId ? { ...c, members: updatedMembers } : c));
      });
    }
    return true;
  }

  // odstrani hraca z clanu
  removeMember(clanId: number, playerId: number) {
    const clan = this.getById(clanId);
    if (!clan) return;
    
    const updatedMembers = clan.members.filter(id => id !== playerId);
    if ((clan as any).docId) {
      const docRef = doc(this.firestore, 'clans', (clan as any).docId);
      updateDoc(docRef, { members: updatedMembers }).catch(() => {
        this._clans.update(arr => arr.map(c => c.id === clanId ? { ...c, members: updatedMembers } : c));
      });
    }
  }
}
