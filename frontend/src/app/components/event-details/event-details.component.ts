import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  eventId: number = 0;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails();
  }

  loadEventDetails(): void {
    this.loading = true;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.event = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  bookTickets(): void {
    this.router.navigate(['/events', this.eventId, 'book']);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}

