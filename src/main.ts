import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { App } from './app/app';
import { Home } from './home/home';
import { Quests } from './app/quests/quests';
import { QuestDetail } from './app/quests/quest-detail';
import { PlayersComponent } from './app/players/players';
import { ClansComponent } from './app/clans/clans';
import { PlayerDetailComponent } from './app/players/player-detail';
import { ClanDetailComponent } from './app/clans/clan-detail';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'quests', component: Quests },
  { path: 'quests/:id', component: QuestDetail },
  { path: 'players', component: PlayersComponent },
  { path: 'players/:id', component: PlayerDetailComponent },  
  { path: 'clans', component: ClansComponent },
  { path: 'clans/:id', component: ClanDetailComponent }     
];


bootstrapApplication(App, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
