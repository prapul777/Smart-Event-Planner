import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Booking } from '../../services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking | null = null;
  bookingId: number = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBookingConfirmation();
  }

  loadBookingConfirmation(): void {
    this.loading = true;
    this.bookingService.getBookingConfirmation(this.bookingId).subscribe({
      next: (data) => {
        this.booking = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading booking:', error);
        this.snackBar.open('Failed to load booking confirmation', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }
}

