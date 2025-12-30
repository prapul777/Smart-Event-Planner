import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttendeeOnlyGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(): boolean {
    // Check if token exists
    const token = this.auth.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check JWT role - ONLY allow ATTENDEE
    const jwtRole = this.auth.getRole();
    if (jwtRole) {
      if (jwtRole === 'attendee') return true;
      // Organizers and admins cannot book events
      this.router.navigate(['/not-authorized']);
      return false;
    }

    // Fallback to localStorage-based role
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'attendee' || userRole === 'ATTENDEE') {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}
