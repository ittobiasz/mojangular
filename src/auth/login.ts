import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[^@]+@[^@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Vyplňte všetky polia správne.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      this.router.navigate(['/profile']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Nepodarilo sa prihlásiť.';
    } finally {
      this.loading = false;
    }
  }
}
