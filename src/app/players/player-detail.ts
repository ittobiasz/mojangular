import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PlayerService } from './player.service';
import { ClanService } from '../clans/clan.service';
import { QuestsService } from '../quests/quest.service'; 
import { PlayerQuestItemComponent } from './player-quest-item';
import { getLevelForXp } from './levels';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PlayerQuestItemComponent],
  templateUrl: './player-detail.html',
  styleUrls: ['./player-detail.css']
})
export class PlayerDetailComponent {
  player: any;
  clanName?: string;
  assignedQuests: any[] = [];
  completedQuests: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    public clanService: ClanService,
    private questsService: QuestsService,
    private router: Router
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.player = this.playerService.getById(id);

    if (this.player?.clanId) {
      const clan = this.clanService.getById(this.player.clanId);
      this.clanName = clan?.name;
    }

    this.refreshQuests();
  }

  // obnovi zoznamy questov pre aktuálneho hráča
  refreshQuests() {
    if (!this.player) return;
    this.assignedQuests = (this.player.quests ?? []).map((qId: number) => this.questsService.getQuestById(qId));
    this.completedQuests = (this.player.completedQuests ?? []).map((qId: number) => this.questsService.getQuestById(qId));
  }

  // vrati info o levele pre aktualneho hraca
  getLevelInfo() {
    const xp = this.player?.xp ?? 0;
    return getLevelForXp(xp);
  }

  

  // presmeruje spat na zoznam hracov
  back() {
    this.router.navigate(['/players']);
  }

  // odstrani aktualneho hraca 
  remove() {
    if (this.player) this.playerService.removePlayer(this.player.id);
  }

  // oznaci quest ako dokonceny
  markComplete(qid: number) {
    if (!this.player) return;
    this.playerService.markQuestComplete(this.player.id, qid);
    this.player = this.playerService.getById(this.player.id);
    this.refreshQuests();
  }

  // oznaci quest ako nedokonceny
  markIncomplete(qid: number) {
    if (!this.player) return;
    this.playerService.markQuestIncomplete(this.player.id, qid);
    this.player = this.playerService.getById(this.player.id);
    this.refreshQuests();
  }
}
