import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClanService } from './clan.service';
import { Clan } from './clan-interface';
import { PlayerService } from '../players/player.service';
import { SearchComponent } from '../shared/search.component';

@Component({
  selector: 'app-clans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchComponent], 
  templateUrl: './clans.html',
  styleUrls: ['./clans.css']
})
export class ClansComponent {
  clans = this.clanService.clans;
  searchTerm = '';
  
  formShown = false;
  newName = '';
  newDescription = '';
  newCapacity = 5;
  

  constructor(private clanService: ClanService, private router: Router, private playerService: PlayerService) {}

  getDisplayedClans() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    return this.clans().filter(c => !term || c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term));
  }

  // prepne viditelnost formulara pre pridanie klanu
  toggleForm() {
    this.formShown = !this.formShown;
    if (!this.formShown) this.resetForm();
  }

  // resetuje polia formulara do default hodnot
  resetForm() {
    this.newName = '';
    this.newDescription = '';
    this.newCapacity = 5;
    
  }

  // prida novy klan a presmeruje na jeho detail
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
  // odstrani klan a nastavi clanId na undefined u jeho clenov
  removeClan(clan: Clan) {
    
    this.playerService.players().forEach(p => {
      if (p.clanId === clan.id) this.playerService.setClan(p.id, undefined);
    });
    this.clanService.removeClan(clan.id);
  }
}
