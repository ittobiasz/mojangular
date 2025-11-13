import { Routes } from '@angular/router';
import { Quests } from './quests/quests';
import { PlayersComponent } from './players/players';
import { ClansComponent } from './clans/clans';

export const routes: Routes = [
  { path: '', redirectTo: '/quests', pathMatch: 'full' },
  { path: 'quests', component: Quests },
  { path: 'players', component: PlayersComponent },
{ path: 'clans', component: ClansComponent }

];
