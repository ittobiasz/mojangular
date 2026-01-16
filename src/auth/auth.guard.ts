import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for authentication state to be determined
  const user = await authService.waitForAuthState();

  if (user) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
