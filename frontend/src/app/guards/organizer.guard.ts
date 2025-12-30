import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(): boolean {
    // Check if token exists
    const token = this.auth.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Prefer JWT role if available
    const jwtRole = this.auth.getRole();
    if (jwtRole) {
      if (jwtRole === 'organizer') return true;
      this.router.navigate(['/not-authorized']);
      return false;
    }

    const userRole = localStorage.getItem('userRole');
    if (userRole === 'organizer') {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}

