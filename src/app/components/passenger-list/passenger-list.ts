import { Component, OnInit, signal } from '@angular/core';
import { Passenger } from '../../models/passenger.model';
import { PassengerService } from '../../services/passenger';

@Component({
  selector: 'app-passenger-list',
  standalone: false,
  templateUrl: './passenger-list.html',
  styleUrl: './passenger-list.css',
})
export class PassengerList implements OnInit{
  tripId!: number;
passengers=signal< Passenger[]>([]);
errorMessage='';


 constructor(private passengerService: PassengerService){}
  ngOnInit():void{
    this.getAll();
  }

    getAll() {
  this.passengerService.getAllPassengers()
    .subscribe(res => {
      this.passengers .set( res as any[]);
    });
}

 getByTrip() {
  this.passengerService.getPassengersByTripId(this.tripId)
    .subscribe(res => {
      this.passengers .set( res as any[]);
    });
}
}
