import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[^@]+@[^@]+\.[^@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Vyplňte všetky polia správne.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.registerForm.value;

    try {
      await this.authService.register(email, password);
      this.router.navigate(['/profile']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Tento email je už používaný.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'Heslo je príliš slabé. Použite aspoň 6 znakov.';
      } else {
        this.errorMessage = error.message || 'Nepodarilo sa zaregistrovať.';
      }
    } finally {
      this.loading = false;
    }
  }
}
