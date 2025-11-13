import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClanService } from './clan.service';
import { Clan } from './clan-interface';
import { PlayerService } from '../players/player.service';

@Component({
  selector: 'app-clans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './clans.html',
  styleUrls: ['./clans.css']
})
export class ClansComponent {
  clans = this.clanService.clans;
  
  formShown = false;
  newName = '';
  newDescription = '';
  newCapacity = 5;
  

  constructor(private clanService: ClanService, private router: Router, private playerService: PlayerService) {}

  toggleForm() {
    this.formShown = !this.formShown;
    if (!this.formShown) this.resetForm();
  }

  resetForm() {
    this.newName = '';
    this.newDescription = '';
    this.newCapacity = 5;
    
  }

  submitAddClan() {
    if (!this.newName.trim()) return;
    const newClan = this.clanService.addClan({
      name: this.newName.trim(),
      description: this.newDescription,
      capacity: this.newCapacity
    });
    this.resetForm();
    this.formShown = false;
    this.router.navigate(['/clans', newClan.id]);
  }
  removeClan(clan: Clan) {
    
    this.playerService.players().forEach(p => {
      if (p.clanId === clan.id) this.playerService.setClan(p.id, undefined);
    });
    this.clanService.removeClan(clan.id);
  }
}
