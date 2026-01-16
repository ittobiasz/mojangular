import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  user = computed(() => this.authService.user());
  userEmail = computed(() => this.authService.getUser()?.email);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
