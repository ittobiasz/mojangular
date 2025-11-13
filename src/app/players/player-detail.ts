import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PlayerService } from './player.service';
import { ClanService } from '../clans/clan.service';
import { QuestsService } from '../quests/quest.service'; 

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './player-detail.html',
  styleUrls: ['./player-detail.css']
})
export class PlayerDetailComponent {
  player: any;
  clanName?: string;
  quests: any[] = [];
  
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

    if (this.player?.quests) {
      this.quests = this.player.quests.map((qId: number) => this.questsService.getQuestById(qId));
    }
  }

  back() {
    this.router.navigate(['/players']);
  }

  remove() {
    if (this.player) this.playerService.removePlayer(this.player.id);
  }
}
