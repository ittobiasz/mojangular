import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerService } from './player.service';
import { Player } from './player-interface';
import { getLevelForXp } from './levels';
import { playerLevels, PlayerLevel } from './levels';
import { QuestsService } from '../quests/quest.service';
import { ClanService } from '../clans/clan.service';
import { SearchComponent } from '../shared/search.component';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SearchComponent],
  templateUrl: './players.html',
  styleUrls: ['./players.css']
})
export class PlayersComponent {
  players = this.playerService.players;
  clans = this.clanService.clans;
  questsList = this.questsService.quests;

  constructor(
    private playerService: PlayerService,
    private router: Router,
    private questsService: QuestsService,
    private clanService: ClanService
  ) {}

  getQuestTitle(id: number) {
    return this.questsService.getQuestById(id)?.title ?? '';
  }

  getClanName(id?: number) {
    if (!id) return undefined;
    return this.clanService.getById(id)?.name;
  }

  isNotLastQuest(player: Player, index: number) {
    return !!player.quests && index < player.quests.length - 1;
  }
  
  formShown = false;
  newNickname = '';
  selectedQuests: number[] = [];
  selectedClanId?: number;
  newXp = 0;
  // filtering/search state
  searchTerm = '';
  selectedLevelTitle = '';
  availableLevels: PlayerLevel[] = playerLevels;

  // prepne viditelnost formulara pre pridanie hraca
  toggleForm() {
    this.formShown = !this.formShown;
    if (!this.formShown) this.resetForm();
  }

  // resetuje polia formulara do default hodnot
  resetForm() {
    this.newNickname = '';
    this.newXp = 0;
    this.selectedQuests = [];
    this.selectedClanId = undefined;
  }

  // prepinanie vyberu questu (max 2)
  toggleQuestSelection(qid: number) {
    const idx = this.selectedQuests.indexOf(qid);
    if (idx > -1) this.selectedQuests.splice(idx, 1);
    else if (this.selectedQuests.length < 5) this.selectedQuests.push(qid);
  }

  // odosle formular, vytvori hraca a pripadne ho prida do clanu
  submitAdd() {
    if (!this.newNickname.trim()) return;
    const newPlayer = this.playerService.addPlayer({
      nickname: this.newNickname.trim(),
      xp: this.newXp,
      quests: this.selectedQuests
    });
    
    if (this.selectedClanId) {
      const ok = this.clanService.addMember(this.selectedClanId, newPlayer.id);
      if (ok) this.playerService.setClan(newPlayer.id, this.selectedClanId);
    }
    this.resetForm();
    this.formShown = false;
    this.router.navigate(['/players', newPlayer.id]);
  }

  // vrati zoznam hráčov po aplikovaní search a level filtra
  getDisplayedPlayers() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    return this.players().filter(p => {
      // search by nickname
      const matchSearch = !term || p.nickname.toLowerCase().includes(term);
      // level filter (title)
      const lvl = getLevelForXp(p.xp ?? 0).current;
      const matchLevel = !this.selectedLevelTitle || lvl.title === this.selectedLevelTitle;
      return matchSearch && matchLevel;
    });
  }

  // odstrani hraca volanim service
  removePlayer(player: Player) {
    this.playerService.removePlayer(player.id);
  }

  // vrati info o levele hraca pre zobrazenie (title a percent do dalsieho levelu)
  getLevelInfo(player: Player) {
    const xp = player.xp ?? 0;
    return getLevelForXp(xp);
  }
}
