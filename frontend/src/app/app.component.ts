import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Smart Event Planner';

  constructor(private auth: AuthService, private router: Router) {}

  isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  getCurrentRole(): string {
    const jwtRole = this.auth.getRole();
    if (jwtRole) return jwtRole.toUpperCase();
    return localStorage.getItem('userRole') || 'ATTENDEE';
  }

  isOrganizer(): boolean {
    const role = this.auth.getRole() || localStorage.getItem('userRole');
    return role === 'organizer' || role === 'ORGANIZER';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

