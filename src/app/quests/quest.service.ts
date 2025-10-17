import { Injectable, signal } from '@angular/core';
import { Quest } from './quest-interface';

@Injectable({ providedIn: 'root' })
export class QuestsService {
  // Premenná quests ako signal
  quests = signal<Quest[]>([
    { id: 1, title: 'The Forgotten Temple', description: 'Explore the ruins of a long-forgotten temple and uncover its secrets.', xp: 45 },
    { id: 2, title: 'Shadow of the Wolf', description: 'Track down the legendary wolf that has been terrorizing the village.', xp: 90 },
    { id: 3, title: 'Potion Mastery', description: 'Collect rare ingredients and craft a powerful healing potion.', xp: 60 },
  ]);

  // Vráti quest podľa ID
  getQuestById(id: number): Quest | undefined {
    return this.quests().find(q => q.id === id);
  }

  // Pridá nový quest
  addQuest(): void {
    const nextId = this.quests().length > 0 ? Math.max(...this.quests().map(q => q.id)) + 1 : 1;
    const newQuest: Quest = {
      id: nextId,
      title: `New Quest ${nextId}`,
      description: 'This is a newly added quest.',
      xp: Math.floor(Math.random() * 150) + 20
    };
    this.quests.update(qs => [...qs, newQuest]);
  }

  // Vymaže quest podľa ID
  deleteQuest(id: number): void {
    this.quests.update(qs => qs.filter(q => q.id !== id));
  }
}
