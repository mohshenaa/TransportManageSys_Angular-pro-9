import { Component, OnInit, signal } from '@angular/core';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-list',
  standalone: false,

  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css'],
})
export class TripList implements OnInit {
  //trips: Trip[] = [];
  trips = signal<Trip[]>([]);
  //  isLoading = true;
  errorMessage = '';

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    // this.isLoading = true;
    this.tripService.getAllTrips().subscribe({
      next: (data) => {
        //alert('load');
        // Log your trips data to see what's happening
console.log('Trips:', this.trips());
console.log('TripIds:', this.trips().map(t => t.tripId));
console.log('Empty TripIds:',this.trips().filter(t => !t.tripId));
        this.trips.set(data);
        //this.trips = this.signaldata();
        //console.table(this.trips());
        //  this.isLoading = false;
        
      },
      error: (error) => {
        this.errorMessage = 'Error loading trips. Please try again.';
        console.error('Error loading trips:', error);
        //   this.isLoading = false;
      },
    });
  }

  deleteTrip(id: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripService.deleteTrip(id).subscribe({
        next: () => {
          this.trips.set(this.trips().filter((trip) => trip.tripId !== id));
          alert('Trip deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting trip:', error);
          alert('Error deleting trip. Please try again.');
        },
      });
    }
  }
}
