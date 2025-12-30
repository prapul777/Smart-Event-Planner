import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

export interface Event {
  id: number;
  organizer_id: string;
  name: string;
  description: string;
  venue: string;
  date_time: string;
  category: string;
  capacity: number;
  image_path?: string | null;
  tickets_sold?: number;
  available_seats?: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  // Create Event
  createEvent(event: any): Observable<any> {
    return this.http.post(`${API_URL}/events`, event);
  }

  // Get All Events (with optional filters)
  getEvents(filters?: { 
    category?: string; 
    organizer_id?: string; 
    upcoming?: boolean;
    venue?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<Event[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.organizer_id) params = params.set('organizer_id', filters.organizer_id);
      if (filters.venue) params = params.set('venue', filters.venue);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.upcoming) params = params.set('upcoming', 'true');
    }
    return this.http.get<Event[]>(`${API_URL}/events`, { params });
  }

  // Get Event by ID
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${API_URL}/events/${id}`);
  }

  // Update Event
  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${API_URL}/events/${id}`, event);
  }

  // Cancel Event
  cancelEvent(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/events/${id}`);
  }
}

