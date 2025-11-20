import { Injectable, signal } from '@angular/core';
import { Quest } from './quest-interface';

@Injectable({ providedIn: 'root' })
export class QuestsService {
  quests = signal<Quest[]>([
    { id: 1, title: 'Zapomenutý chrám', description: 'Preskúmaj ruiny starého chrámu a odhaľ jeho tajomstvá.', xp: 45 },
    { id: 2, title: 'Tieň vlka', description: 'Vypátraj legendárneho vlka, ktorý sužuje dedinu.', xp: 90 },
    { id: 3, title: 'Majstrovstvo elixírov', description: 'Zlož vzácne ingrediencie a priprav mocný liečivý elixír.', xp: 60 },
  ]);

  // prida novy quest do zoznamu
  addQuest() {
    const nextId = this.quests().length > 0 ? Math.max(...this.quests().map(q => q.id)) + 1 : 1;
    const newQuest: Quest = {
      id: nextId,
      title: `Nový quest ${nextId}`,
      description: 'Toto je práve pridaný quest.',
      xp: Math.floor(Math.random() * 150) + 20
    };
    this.quests.update(qs => [...qs, newQuest]);
  }

  // odstrani quest podla id
  deleteQuest(id: number) {
    this.quests.update(qs => qs.filter(q => q.id !== id));
  }

  // ziska quest podla id
  getQuestById(id: number) {
    return this.quests().find(q => q.id === id);
  }
}
