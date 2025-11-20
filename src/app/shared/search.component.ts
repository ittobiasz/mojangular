import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-root">
      <input [(ngModel)]="value" (ngModelChange)="valueChange.emit($event)" [placeholder]="placeholder" class="search-input" />
    </div>
  `,
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() placeholder = 'Hľadaj...';
}
