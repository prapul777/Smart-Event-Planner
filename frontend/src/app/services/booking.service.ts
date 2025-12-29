import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5000/api';

export interface Booking {
  id: number;
  event_id: number;
  attendee_id: string;
  tickets_booked: number;
  total_price: number;
  booking_time: string;
  event_name?: string;
  venue?: string;
  date_time?: string;
  category?: string;
}

export interface BookingSummary {
  total_bookings: number;
  total_tickets_sold: number;
  total_revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) {}

  // Book Tickets
  bookTickets(booking: any): Observable<any> {
    return this.http.post(`${API_URL}/bookings`, booking);
  }

  // Get Bookings by Event ID
  getBookingsByEvent(eventId: number): Observable<{ bookings: Booking[]; summary: BookingSummary }> {
    return this.http.get<{ bookings: Booking[]; summary: BookingSummary }>(`${API_URL}/bookings/event/${eventId}`);
  }

  // Get Booking Confirmation by Booking ID
  getBookingConfirmation(bookingId: number): Observable<Booking> {
    return this.http.get<Booking>(`${API_URL}/bookings/${bookingId}`);
  }
}

