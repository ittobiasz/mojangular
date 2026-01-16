import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { QuestService, Quest } from '../services/quest.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <section>
      <h2>Quests</h2>

      <div *ngIf="quests$ | async as quests; else loading">
        <div *ngFor="let q of quests">
          <h3>{{ q.name }}</h3>
          <p>{{ q.description }}</p>
          <small>Reward: {{ q.reward }}</small>
        </div>
      </div>

      <ng-template #loading>Načítavam...</ng-template>
    </section>
  `
})
export class QuestsComponent {
  quests$ = this.questService.getQuests();
  constructor(private questService: QuestService) {}
}
