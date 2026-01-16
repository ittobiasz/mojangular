import { Component, effect } from '@angular/core';
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
    // Watch for player changes
    effect(() => {
      this.refreshQuests();
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.player = this.playerService.getById(id);
    this.loadClanAndQuests();
  }

  loadClanAndQuests() {
    if (this.player?.clanId) {
      const clan = this.clanService.getById(this.player.clanId);
      this.clanName = clan?.name;
    }
    this.refreshQuests();
  }

  refreshQuests() {
    if (!this.player) return;
    this.assignedQuests = (this.player.quests ?? [])
      .map((qId: number) => this.questsService.getQuestById(qId))
      .filter(Boolean);
    this.completedQuests = (this.player.completedQuests ?? [])
      .map((qId: number) => this.questsService.getQuestById(qId))
      .filter(Boolean);
  }

  getLevelInfo() {
    const xp = this.player?.xp ?? 0;
    return getLevelForXp(xp);
  }

  back() {
    this.router.navigate(['/players']);
  }

  remove() {
    if (!this.player) return;
    this.playerService.removePlayer(this.player.id);
    setTimeout(() => this.router.navigate(['/players']), 300);
  }

  markComplete(qid: number) {
    if (!this.player) return;
    const questId = Number(qid);
    this.playerService.markQuestComplete(this.player.id, questId);
    this.player = this.playerService.getById(this.player.id);
    this.refreshQuests();
  }

  markIncomplete(qid: number) {
    if (!this.player) return;
    const questId = Number(qid);
    this.playerService.markQuestIncomplete(this.player.id, questId);
    this.player = this.playerService.getById(this.player.id);
    this.refreshQuests();
  }
}
