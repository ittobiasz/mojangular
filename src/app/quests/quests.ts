import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuestsService } from './quest.service';
import { Quest } from './quest-interface';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {

  constructor(public questsService: QuestsService) {}


  addQuest() {
    this.questsService.addQuest();
  }

  deleteQuest(id: number) {
    this.questsService.deleteQuest(id);
  }
}
