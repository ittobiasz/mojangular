import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../shared/search.component';
import { QuestsService } from './quest.service';
import { Quest } from './quest-interface';      

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchComponent],
  templateUrl: './quests.html',
  styleUrls: ['./quests.css']
})
export class Quests {

  searchTerm = '';

  constructor(public questsService: QuestsService) {}


  addQuest() {
    this.questsService.addQuest();
  }

  deleteQuest(id: number) {
    this.questsService.deleteQuest(id);
  }

  getDisplayedQuests() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    return this.questsService.quests().filter(q => !term || q.title.toLowerCase().includes(term) || q.description.toLowerCase().includes(term));
  }
}
