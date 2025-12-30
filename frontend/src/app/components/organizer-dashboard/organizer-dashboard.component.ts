import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';
import { BookingService, Booking } from '../../services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  bookings: Booking[] = [];
  bookingSummary: any = null;
  eventForm: FormGroup;
  selectedFile: File | null = null;
  isEditing: boolean = false;
  editingEventId: number | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      venue: ['', Validators.required],
      date_time: ['', Validators.required],
      category: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    this.loading = true;
    const organizerId = localStorage.getItem('organizerId') || 'organizer_1';
    this.eventService.getEvents({ organizer_id: organizerId }).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onCreateEvent(): void {
    this.isEditing = false;
    this.editingEventId = null;
    this.selectedFile = null;
    this.eventForm.reset();
  }

  onSubmitEvent(): void {
    if (this.eventForm.valid) {
      const organizerId = localStorage.getItem('organizerId') || 'organizer_1';
      // Build payload — use FormData if file selected
      let payload: any;
      if (this.selectedFile) {
        payload = new FormData();
        const formVal = this.eventForm.value;
        // Only add organizer_id for create, not for update
        if (!this.isEditing) {
          payload.append('organizer_id', organizerId);
        }
        payload.append('name', formVal.name);
        payload.append('description', formVal.description || '');
        payload.append('venue', formVal.venue);
        payload.append('date_time', formVal.date_time);
        payload.append('category', formVal.category);
        payload.append('capacity', String(formVal.capacity));
        payload.append('image', this.selectedFile);
      } else {
        payload = {
          ...this.eventForm.value,
          organizer_id: organizerId
        };
      }

      if (this.isEditing && this.editingEventId) {
        // Update event (remove organizer_id from payload if it's JSON)
        if (!this.selectedFile) {
          delete payload.organizer_id;
        }
        this.eventService.updateEvent(this.editingEventId, payload).subscribe({
          next: () => {
            this.snackBar.open('Event updated successfully', 'Close', { duration: 3000 });
            this.loadMyEvents();
            this.eventForm.reset();
            this.selectedFile = null;
            this.isEditing = false;
            this.editingEventId = null;
          },
          error: (error) => {
            const errorMsg = error.error?.error || 'Failed to update event';
            this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
          }
        });
      } else {
        // Create event
        this.eventService.createEvent(payload).subscribe({
          next: () => {
            this.snackBar.open('Event created successfully', 'Close', { duration: 3000 });
            this.loadMyEvents();
            this.eventForm.reset();
            this.selectedFile = null;
          },
          error: (error) => {
            const errorMsg = error.error?.error || 'Failed to create event';
            this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onEditEvent(event: Event): void {
    this.isEditing = true;
    this.editingEventId = event.id;
    this.selectedFile = null;  // Clear file selection when editing
    this.eventForm.patchValue({
      name: event.name,
      description: event.description,
      venue: event.venue,
      date_time: new Date(event.date_time).toISOString().slice(0, 16),
      category: event.category,
      capacity: event.capacity
    });
  }

  onCancelEvent(eventId: number): void {
    if (confirm('Are you sure you want to cancel this event?')) {
      this.eventService.cancelEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open('Event cancelled successfully', 'Close', { duration: 3000 });
          this.loadMyEvents();
          if (this.selectedEvent?.id === eventId) {
            this.selectedEvent = null;
            this.bookings = [];
            this.bookingSummary = null;
          }
        },
        error: (error) => {
          const errorMsg = error.error?.error || 'Failed to cancel event';
          this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
        }
      });
    }
  }

  onViewBookings(event: Event): void {
    this.selectedEvent = event;
    this.loading = true;
    this.bookingService.getBookingsByEvent(event.id).subscribe({
      next: (data) => {
        this.bookings = data.bookings;
        this.bookingSummary = data.summary;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.snackBar.open('Failed to load bookings', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

