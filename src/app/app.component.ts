import { Component } from '@angular/core';
import { QuestsComponent } from './quests/quests.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuestsComponent],
  template: `
    <main>
      <h1>MojAngularik</h1>
      <app-quests></app-quests>
    </main>
  `
})
export class AppComponent {}
