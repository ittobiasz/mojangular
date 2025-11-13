import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ClanService } from './clan.service';
import { PlayerService } from '../players/player.service';

@Component({
  selector: 'app-clan-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clan-detail.html',
  styleUrls: ['./clan-detail.css']
})
export class ClanDetailComponent {
  clan: any;

  constructor(private route: ActivatedRoute, public clanService: ClanService, public playerService: PlayerService, private router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clan = this.clanService.getById(id);
  }

  removeMember(playerId: number) {
    if (!this.clan) return;
    this.clanService.removeMember(this.clan.id, playerId);
    this.playerService.setClan(playerId, undefined);
  }
  removeClan() {
    if (!this.clan) return;
    
    this.playerService.players().forEach(p => {
      if (p.clanId === this.clan.id) this.playerService.setClan(p.id, undefined);
    });
    this.clanService.removeClan(this.clan.id);
  }

  back() {
    this.router.navigate(['/clans']);
  }
}
