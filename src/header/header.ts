import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
