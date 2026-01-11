import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, TripFormData } from '../models/trip.model';
import { Passenger } from '../models/passenger.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private apiUrl = 'https://localhost:7131/api/Trip';

  constructor(private http: HttpClient) {
    
  }

  getAllTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
  }

  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.apiUrl}/${id}`);
  }

  createTrip(tripData: TripFormData): Observable<Trip> {
    return this.http.post<Trip>(this.apiUrl, tripData);
  }

  updateTrip(id: number, tripData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.apiUrl}/${id}`, tripData);
  }

  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
