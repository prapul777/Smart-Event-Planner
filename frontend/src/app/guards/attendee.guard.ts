import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AttendeeGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('userRole');
    
    // Allow access if user is attendee or if no role is set (default to attendee)
    if (userRole === 'attendee' || !userRole) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}

