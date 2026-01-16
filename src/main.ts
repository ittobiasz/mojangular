import { provideZoneChangeDetection } from "@angular/core";
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

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register';
import { ProfileComponent } from './auth/profile';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'quests', component: Quests, canActivate: [authGuard] },
  { path: 'quests/:id', component: QuestDetail, canActivate: [authGuard] },
  { path: 'players', component: PlayersComponent, canActivate: [authGuard] },
  { path: 'players/:id', component: PlayerDetailComponent, canActivate: [authGuard] },  
  { path: 'clans', component: ClansComponent, canActivate: [authGuard] },
  { path: 'clans/:id', component: ClanDetailComponent, canActivate: [authGuard] }     
];

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyATUsHhHNOurMWVjlRV9OdSx8V45mqybKQ",
      authDomain: "mojangularik.firebaseapp.com",
      projectId: "mojangularik",
      storageBucket: "mojangularik.firebasestorage.app",
      messagingSenderId: "316743962230",
      appId: "1:316743962230:web:d82ca048018633fc559957"
    })),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ]
}).catch(err => console.error(err));
