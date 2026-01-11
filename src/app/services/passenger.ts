import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Passenger } from '../models/passenger.model';

@Injectable({
  providedIn: 'root',
})
export class PassengerService {

  private apiUrl = 'https://localhost:7131/api'; 

  constructor(private http: HttpClient) {}


  getPassengersByTripId(tripId: number) {
    return this.http.get(`${this.apiUrl}/Trip/${tripId}/passengers`);
  }

  
  getAllPassengers() {
    return this.http.get(`${this.apiUrl}/Trip/passengers`);
  }
}