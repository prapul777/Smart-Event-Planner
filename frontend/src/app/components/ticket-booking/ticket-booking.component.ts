import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.scss']
})
export class TicketBookingComponent implements OnInit {
  bookingForm: FormGroup;
  event: Event | null = null;
  eventId: number = 0;
  loading: boolean = false;
  ticketPrice: number = 100; // Default ticket price

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      attendee_id: ['', Validators.required],
      tickets_booked: [1, [Validators.required, Validators.min(1)]],
      total_price: [this.ticketPrice]
    });
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails();
    
    // Calculate total price when tickets change
    this.bookingForm.get('tickets_booked')?.valueChanges.subscribe(tickets => {
      const total = tickets * this.ticketPrice;
      this.bookingForm.patchValue({ total_price: total }, { emitEvent: false });
    });
  }

  loadEventDetails(): void {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
        
        // Set max tickets based on available seats
        const maxTickets = this.event.available_seats || this.event.capacity;
        this.bookingForm.get('tickets_booked')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(maxTickets)
        ]);
        this.bookingForm.get('tickets_booked')?.updateValueAndValidity();
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.event) {
      const bookingData = {
        event_id: this.eventId,
        attendee_id: this.bookingForm.value.attendee_id,
        tickets_booked: this.bookingForm.value.tickets_booked,
        total_price: this.bookingForm.value.total_price
      };

      // Check available seats
      const availableSeats = this.event.available_seats || this.event.capacity;
      if (bookingData.tickets_booked > availableSeats) {
        this.snackBar.open(`Only ${availableSeats} seats available`, 'Close', { duration: 3000 });
        return;
      }

      this.bookingService.bookTickets(bookingData).subscribe({
        next: (response) => {
          this.snackBar.open('Tickets booked successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/booking', response.id]);
        },
        error: (error) => {
          console.error('Error booking tickets:', error);
          const errorMsg = error.error?.error || 'Failed to book tickets';
          this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
        }
      });
    }
  }

  getMaxTickets(): number {
    return this.event ? (this.event.available_seats || this.event.capacity) : 0;
  }

  goBack(): void {
    this.router.navigate(['/events', this.eventId]);
  }
}

