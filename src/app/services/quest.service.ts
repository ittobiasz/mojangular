import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Quest {
  id?: string;
  name: string;
  description?: string;
  reward?: number;
}

@Injectable({ providedIn: 'root' })
export class QuestService {
  constructor(private firestore: Firestore) {}

  getQuests(): Observable<Quest[]> {
    const questsRef = collection(this.firestore, 'quests');
    return collectionData(questsRef, { idField: 'id' }) as Observable<Quest[]>;
  }
}
