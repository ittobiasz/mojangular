import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-player-quest-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="quest-item">
      <div class="left">
        <a [routerLink]="['/quests', quest?.id]" class="title">{{ quest?.title }}</a>
        <div class="meta">{{ quest?.xp }} XP</div>
      </div>
      <div class="actions">
        <button class="nav-btn small" (click)="action.emit(quest?.id)">{{ actionLabel }}</button>
      </div>
    </div>
  `,
  styleUrls: ['./player-quest-item.css']
})
export class PlayerQuestItemComponent {
  @Input() quest: any;
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<number>();
}
