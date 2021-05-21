// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LoggedGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {
      console.log( 'Logged guard constructed')
  }
  canActivate(): boolean {
    if ( this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}