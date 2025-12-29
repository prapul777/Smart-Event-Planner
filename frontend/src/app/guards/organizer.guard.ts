import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrganizerGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'organizer') {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      return false;
    }
  }
}

