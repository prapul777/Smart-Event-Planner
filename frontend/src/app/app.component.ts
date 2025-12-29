import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Smart Event Planner';

  // Get current user role from localStorage
  getCurrentRole(): string {
    return localStorage.getItem('userRole') || 'attendee';
  }

  isOrganizer(): boolean {
    return this.getCurrentRole() === 'organizer';
  }

  isAttendee(): boolean {
    return this.getCurrentRole() === 'attendee';
  }

  // Switch role (for demo purposes)
  switchRole(role: string): void {
    localStorage.setItem('userRole', role);
    window.location.reload();
  }
}

