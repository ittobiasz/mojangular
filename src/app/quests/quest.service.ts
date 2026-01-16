import { Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from '@angular/fire/firestore';
import { Quest } from './quest-interface';
import { QUESTS } from '../shared/data';

@Injectable({ providedIn: 'root' })
export class QuestsService {
  quests = signal<Quest[]>([]);

  constructor(private firestore: Firestore) {
    this.loadQuests();
  }

  private loadQuests() {
    const questsRef = collection(this.firestore, 'quests');
    const q = query(questsRef, orderBy('id', 'asc'));
    
    onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          ...docData,
          docId: doc.id,
          id: docData['id'] ?? 0,
          xp: docData['xp'] ?? 0,
          title: docData['title'] ?? '',
          description: docData['description'] ?? '',
          difficulty: docData['difficulty'],
          imageUrl: docData['imageUrl']
        } as Quest & { docId: string };
      });
      this.quests.set(data);
    }, () => {
      this.quests.set(QUESTS);
    });
  }

  getQuestById(id: number) {
    return this.quests().find(q => q.id === id);
  }

  addQuest() {
    const currentQuests = this.quests();
    const nextId = currentQuests.length > 0 ? Math.max(...currentQuests.map(q => q.id || 0)) + 1 : 1;
    const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const newQuest: Quest = {
      id: nextId,
      title: `Nový quest ${nextId}`,
      description: 'Toto je práve pridaný quest.',
      xp: Math.floor(Math.random() * 150) + 20,
      difficulty: randomDifficulty
    };
    const questsRef = collection(this.firestore, 'quests');
    addDoc(questsRef, newQuest);
  }

  deleteQuest(id: number) {
    // Find the quest with this id to get its Firestore document ID
    const quest = this.quests().find(q => q.id === id);
    if (quest && (quest as any).docId) {
      const docRef = doc(this.firestore, 'quests', (quest as any).docId);
      deleteDoc(docRef);
    }
  }

  updateQuest(id: number, quest: Partial<Quest>) {
    const existingQuest = this.quests().find(q => q.id === id);
    if (existingQuest && (existingQuest as any).docId) {
      const docRef = doc(this.firestore, 'quests', (existingQuest as any).docId);
      updateDoc(docRef, quest as any);
    }
  }
}
