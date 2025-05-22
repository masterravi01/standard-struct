import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated() as boolean;

  if (isAuth) {
    return true;
  } else {
    // Displaying the error message
    console.log('Access Denied! Please log in first to access this page.');

    router.navigate(['/login']);
    return false;
  }
};
