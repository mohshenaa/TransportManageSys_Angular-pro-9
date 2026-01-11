import { Component, OnInit, signal } from '@angular/core';
import { DriverService } from '../../services/driver';
import { Driver } from '../../models/driver.model';
import { ImageUploadService } from '../../services/image-upload';

@Component({
  selector: 'app-driver-list',
  standalone: false, 
  templateUrl: './driver-list.html',
  styleUrls: ['./driver-list.css'],
})
export class DriverList implements OnInit {
  uploadedImages: any[] = [];
  drivers=signal< Driver[]> ([]);
 // isLoading = true;
  errorMessage = '';
  //showDebug = false; 
  constructor(private driverService: DriverService,private uploadservice: ImageUploadService) {}

  ngOnInit(): void {
    this.loadDrivers();
     //this.uploadedImages = this.uploadservice.uploadImage;
    
      const storedImages = localStorage.getItem('uploadedImages');
    if (storedImages) {
      this.uploadedImages = JSON.parse(storedImages);
    }
  }

  loadDrivers(){
    //this.isLoading = true;
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers .set(data);
   //    this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading drivers. Please try again.';
        console.error('Error loading drivers:', error);
    //    this.isLoading = false;
      },
    });
  }

  deleteDriver(id: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(id).subscribe({
        next: () => {
          this.drivers .set(this.drivers().filter((driver) => driver.driId !== id));
          alert('Driver deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting driver:', error);
          alert('Error deleting driver. Please try again.');
        },
      });
    }
  }
}
