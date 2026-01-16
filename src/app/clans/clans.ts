import { Component, signal } from '@angular/core';

import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { form, Field } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';
import { ClanService } from './clan.service';
import { Clan } from './clan-interface';
import { PlayerService } from '../players/player.service';
import { SearchComponent } from '../shared/search.component';

@Component({
  selector: 'app-clans',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchComponent, Field], 
  templateUrl: './clans.html',
  styleUrls: ['./clans.css']
})
export class ClansComponent {
  clans = this.clanService.clans;
  searchTerm = '';
  
  formShown = false;
  
  clanFormModel = signal({
    name: '',
    description: '',
    capacity: 5
  });
  clanForm = form(this.clanFormModel);

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
    this.clanFormModel.set({
      name: '',
      description: '',
      capacity: 5
    });
  }

  // prida novy klan a presmeruje na jeho detail
  submitAddClan() {
    const nameValue = this.clanForm.name().value();
    if (!nameValue.trim()) return;
    const newClan = this.clanService.addClan({
      name: nameValue.trim(),
      description: this.clanForm.description().value(),
      capacity: this.clanForm.capacity().value()
    });
    this.resetForm();
    this.formShown = false;
    this.router.navigate(['/clans', newClan.id]);
  }
  // odstrani klan a nastavi clanId na undefined u jeho clenov
  removeClan(clan: Clan) {
    this.playerService.getAll().forEach(p => {
      if (p.clanId === clan.id) {
        this.playerService.setClan(p.id, undefined);
      }
    });
    this.clanService.removeClan(clan.id);
  }
}
