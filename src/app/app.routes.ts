import { Routes } from '@angular/router';
import { Quests } from './quests/quests';
import { PlayersComponent } from './players/players';
import { ClansComponent } from './clans/clans';
import { QuestDetail } from './quests/quest-detail';
import { PlayerDetailComponent } from './players/player-detail';
import { ClanDetailComponent } from './clans/clan-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/quests', pathMatch: 'full' },
  { path: 'quests', component: Quests },
  { path: 'quests/:id', component: QuestDetail },
  { path: 'players', component: PlayersComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: 'clans', component: ClansComponent },
  { path: 'clans/:id', component: ClanDetailComponent }
];
