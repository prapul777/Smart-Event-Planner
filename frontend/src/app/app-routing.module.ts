import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { TicketBookingComponent } from './components/ticket-booking/ticket-booking.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { OrganizerDashboardComponent } from './components/organizer-dashboard/organizer-dashboard.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { OrganizerGuard } from './guards/organizer.guard';
import { AttendeeGuard } from './guards/attendee.guard';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'events', component: EventListComponent, canActivate: [AttendeeGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [AttendeeGuard] },
  { path: 'events/:id/book', component: TicketBookingComponent, canActivate: [AttendeeGuard] },
  { path: 'booking/:id', component: BookingConfirmationComponent, canActivate: [AttendeeGuard] },
  { path: 'organizer/dashboard', component: OrganizerDashboardComponent, canActivate: [OrganizerGuard] },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: '/events' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

