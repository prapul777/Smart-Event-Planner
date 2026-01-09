import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, Event } from '../../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  categories: string[] = ['Wedding', 'Birthday', 'Corporate', 'Conference', 'Party', 'Other'];
  
  // Filter properties
  selectedCategory: string = '';
  selectedVenue: string = '';
  startDate: string = '';
  endDate: string = '';
  showFilters: boolean = false;
  loading: boolean = false;

  constructor(
    private eventService: EventService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    const filters: any = { upcoming: true };
    
    if (this.selectedCategory && this.selectedCategory !== '') {
      filters.category = this.selectedCategory;
    }
    if (this.selectedVenue && this.selectedVenue !== '') {
      filters.venue = this.selectedVenue;
    }
    if (this.startDate && this.startDate !== '') {
      filters.startDate = this.startDate;
    }
    if (this.endDate && this.endDate !== '') {
      filters.endDate = this.endDate;
    }

    this.eventService.getEvents(filters).subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadEvents();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedVenue = '';
    this.startDate = '';
    this.endDate = '';
    this.loadEvents();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  bookTickets(eventId: number): void {
    this.router.navigate(['/events', eventId, 'book']);
  }

  getImageUrl(path: string | undefined | null): string {
    if (!path) return '';
    return `http://localhost:5001/${path}`;
  }
}

