import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'https://localhost:7131/api/Driver';

  constructor(private http: HttpClient) {}

  // getAllDrivers(): Observable<Driver[]> {
  //   return this.http.get<Driver[]>(this.apiUrl);
  // }
  
 getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      // tap(drivers => console.log('Fetched drivers:', drivers))
    );
  }
  
  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  // createDriver(driver: Driver): Observable<Driver> {
  //   return this.http.post<Driver>(this.apiUrl, driver);
  // }
  createDriver(driver: any): Observable<any> {
  return this.http.post(this.apiUrl, driver
  //, { headers: { 'Content-Type': 'application/json' }}
  );
}

  updateDriver(id: number, driver: Driver): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, driver);
  }

  deleteDriver(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
