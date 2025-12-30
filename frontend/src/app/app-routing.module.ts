import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { TicketBookingComponent } from './components/ticket-booking/ticket-booking.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { OrganizerDashboardComponent } from './components/organizer-dashboard/organizer-dashboard.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { OrganizerGuard } from './guards/organizer.guard';
import { AttendeeGuard } from './guards/attendee.guard';
import { AttendeeOnlyGuard } from './guards/attendee-only.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'events', component: EventListComponent, canActivate: [AttendeeGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [AttendeeGuard] },
  { path: 'events/:id/book', component: TicketBookingComponent, canActivate: [AttendeeOnlyGuard] },
  { path: 'booking/:id', component: BookingConfirmationComponent, canActivate: [AttendeeOnlyGuard] },
  { path: 'organizer/dashboard', component: OrganizerDashboardComponent, canActivate: [OrganizerGuard] },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

