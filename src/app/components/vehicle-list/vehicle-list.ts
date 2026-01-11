import { Component, OnInit, signal } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicle';

@Component({
  selector: 'app-vehicle-list',
  standalone: false,
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit{
  vehicles= signal<Vehicle[]>([]);
  //isLoading=true;
  errorMessage='';

 constructor(private vehicleService: VehicleService){}
  ngOnInit():void{
    this.loadVehicles();
  }

  loadVehicles(){
    //this.isLoading=true;
    this.vehicleService.getAllVehicles().subscribe({
      next:(data)=>{
        this.vehicles.set(data);
        //this.isLoading=false;
      },
      error:(error)=>{
        this.errorMessage='Error loading Vehicles.Please try again';
        console.error('Error loading Vehicles:',error);
        //this.isLoading=false;
      },
    });
  }

  deleteVehicle(id:number):void{
    if(confirm('Are you sure you want to delete this vehicle?')){
      this.vehicleService.deleteVehicle(id).subscribe({
        next:()=>{
          this.vehicles.set(this.vehicles().filter((vehicle)=>vehicle.viclId!==id));
          alert('Vehicle deleted successfully');
        },
        error:(error)=>{
          console.error('Error deleting vehicle:',error);
          alert('Error deleting vehicle.Please try again');
        },
      });
    }
  }
}
