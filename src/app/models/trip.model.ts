import { Driver } from './driver.model';
import { Passenger } from './passenger.model';
import { Vehicle } from './vehicle.model';

export interface Trip {
  tripId: number;
  vehicleId: number;
  driverId: number;
  startLocation: string;
  destination: string;
  startDateTime: Date;
  endDate: Date;
  distanceKm: number;
  status: string;
  helper: string;
  driver?: Driver;
  vehicle?: Vehicle;
  passengers?: Passenger[];
}

export interface TripFormData {
  vehicleId: number;
  driverId: number;
  startLocation: string;
  destination: string;
  startDateTime: Date;
  endDate: Date;
  distanceKm: number;
  status: string;
  helper: string;
  driver?: Driver;
  vehicle?: Vehicle;
  passengers: Passenger[];
}
