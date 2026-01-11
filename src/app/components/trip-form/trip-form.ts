// trip-form.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip';
import { DriverService } from '../../services/driver';
import { VehicleService } from '../../services/vehicle';
import { Driver } from '../../models/driver.model';
import { Vehicle } from '../../models/vehicle.model';
import { ImageUploadService } from '../../services/image-upload';
import { ValidationHelper } from '../../services/validation-helper';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trip-form',
  standalone: false,
  templateUrl: './trip-form.html',
  styleUrls: ['./trip-form.css'],
})
export class TripForm implements OnInit {
  tripForm: FormGroup;
  isEditMode = false;
  tripId?: number;
  isLoading = false;
  errorMessage = '';
 //formattedDate: string;
  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];

  // Store passenger images temporarily
  passengerImages: { [index: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private uploadService: ImageUploadService,
    public ValidationHelper: ValidationHelper
    //, private datePipe: DatePipe
  ) {
    this.tripForm = this.createTripForm();
    // const now = new Date();
  
    // this.formattedDate = this.datePipe.transform(now, 'yyyy-MM-dd HH:mm')!;
    // console.log(this.formattedDate); 
  }

  createTripForm(): FormGroup {
    return this.fb.group({
      startLocation: ['', Validators.required],
      destination: ['', Validators.required],
      //startDateTime: [new Date().toISOString().slice(0, 16), Validators.required],
        startDateTime: [this.getMyLocalTime()],
      endDate: [''],
      distanceKm: [0, [Validators.required, Validators.min(0)]],
      driverId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      status: ['Scheduled', Validators.required],
      helper: [''],
      passengers: this.fb.array([]),
    });
  }


getMyLocalTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
  onFileSelected(event: any, passengerIndex: number): void {
    const file: File = event.target.files[0];
    if (!file) return;

    console.log(`Uploading for passenger ${passengerIndex}:`, file.name);

    // For testing, you can try both methods:
    this.uploadService.uploadImage(file).subscribe({
      next: (response: string) => {
        console.log(`✅ Upload successful for passenger ${passengerIndex}:`, response);

        // The response is a plain string like "/images/passengers/filename.png"
        let imagePath = response.trim();

        // Clean up the path if needed
        const baseUrl = 'https://localhost:7131';
        if (imagePath.startsWith(baseUrl)) {
          imagePath = imagePath.substring(baseUrl.length);
        }

        // Ensure it has leading slash for storage
        if (!imagePath.startsWith('/')) {
          imagePath = '/' + imagePath;
        }

        console.log(`Processed image path: ${imagePath}`);

        // Store the image path
        this.passengerImages[passengerIndex] = imagePath;

        // Update form control
        const passengerGroup = this.passengers.at(passengerIndex);
        if (passengerGroup) {
          passengerGroup.patchValue({
            imageUrl: imagePath,
          });

          // Force form update
          passengerGroup.updateValueAndValidity();

          console.log(`✅ Image URL saved to form: ${imagePath}`);
        }

        // alert('Image uploaded successfully!');
      },
      error: (error) => {
        console.error(`❌ Upload error for passenger ${passengerIndex}:`, error);

        // Try alternative method if first fails
        this.tryAlternativeUpload(file, passengerIndex);
      },
    });
  }

  // Alternative upload method using XMLHttpRequest
  tryAlternativeUpload(file: File, passengerIndex: number): void {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://localhost:7131/api/Trip/Upload/passengers', true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = xhr.responseText;
        console.log(`Alternative upload successful: ${response}`);

        // Store the response
        this.passengerImages[passengerIndex] = response.trim();

        const passengerGroup = this.passengers.at(passengerIndex);
        if (passengerGroup) {
          passengerGroup.patchValue({
            imageUrl: response.trim(),
          });
        }

        // alert('Image uploaded successfully!');
      } else {
        console.error(`Alternative upload failed: ${xhr.status}`);
        alert('Upload failed. Please try again.');
      }
    };

    xhr.onerror = () => {
      console.error('Network error in alternative upload');
      alert('Network error. Please check your connection.');
    };

    xhr.send(formData);
  }


  get passengers(): FormArray {
    return this.tripForm.get('passengers') as FormArray;
  }

  // In createPassengerFormGroup method:
  createPassengerFormGroup(passengerData?: any): FormGroup {
    return this.fb.group({
      psngrName: [passengerData?.psngrName || '', Validators.required],
      psngrContact: [passengerData?.psngrContact || '', Validators.required],
      seatno: [passengerData?.seatno || '', Validators.required],
      imageUrl: [passengerData?.imageUrl || passengerData?.image || passengerData?.photo || ''],
    });
  }

  // Update addPassenger method:
  addPassenger(passengerData?: any): void {
    const newIndex = this.passengers.length;
    const passengerGroup = this.createPassengerFormGroup(passengerData);
    this.passengers.push(passengerGroup);

    if (passengerData?.imageUrl) {
      this.passengerImages[newIndex] = passengerData.imageUrl;
    }
  }

  removePassenger(index: number): void {
    this.passengers.removeAt(index);
    if (this.passengerImages[index]) {
      delete this.passengerImages[index];
    }
  }

  ngOnInit(): void {
    this.loadDrivers();
    this.loadVehicles();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.tripId = +params['id'];
        this.loadTripData(this.tripId);
      }
    });
  }

  loadDrivers(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
        this.errorMessage = 'Error loading drivers. Please try again.';
      },
    });
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.errorMessage = 'Error loading vehicles. Please try again.';
      },
    });
  }

  loadTripData(id: number): void {
    this.isLoading = true;
    this.tripService.getTripById(id).subscribe({
      next: (trip) => {
        this.tripForm.patchValue({
          startLocation: trip.startLocation,
          destination: trip.destination,
          
    //startDateTime: this.getMyLocalTime() ,
          startDateTime: new Date(trip.startDateTime).toISOString().slice(0, 16),
          //startDateTime: [this.getMyLocalTime()],
          endDate: trip.endDate ? new Date(trip.endDate).toISOString().slice(0, 10) : '',
          distanceKm: trip.distanceKm,
          driverId: trip.driverId,
          vehicleId: trip.vehicleId,
          status: trip.status,
          helper: trip.helper,
        });

        this.passengers.clear();
        this.passengerImages = {};

        if (trip.passengers && trip.passengers.length > 0) {
          trip.passengers.forEach((passenger, index) => {
            const imageUrl = passenger.imageUrl;

            this.passengers.push(
              this.fb.group({
                psngrId: [passenger.psngrId],
                psngrName: [passenger.psngrName, Validators.required],
                psngrContact: [passenger.psngrContact, Validators.required],
                seatno: [passenger.seatno, Validators.required],
                imageUrl: [imageUrl],
              })
            );

            if (imageUrl) {
              this.passengerImages[index] = imageUrl;
              console.log(`Loaded image for passenger ${index}: ${imageUrl}`);
            }
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading trip:', error);
        this.errorMessage = 'Error loading trip data. Please try again.';
        this.isLoading = false;
      },
    });
  }
  onSubmit(): void {
    if (this.tripForm.invalid) {
      Object.keys(this.tripForm.controls).forEach((key) => {
        const control = this.tripForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    const formData = this.tripForm.value;

    if (formData.passengers && formData.passengers.length > 0) {
      formData.passengers.forEach((passenger: any, index: number) => {
        if (this.passengerImages[index]) {
          passenger.imageUrl = this.passengerImages[index];
        } else if (passenger.imageUrl) {
        }

        if (passenger.psngrId) {
          passenger.psngrId = passenger.psngrId;
        }
      });
    }

    formData.startDateTime = new Date(formData.startDateTime);
    if (formData.endDate) {
      formData.endDate = new Date(formData.endDate);
    }

    if (this.isEditMode && this.tripId) {
      const updateData = {
        tripId: this.tripId,
        ...formData,
      };

      this.tripService.updateTrip(this.tripId, updateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Trip updated successfully!');
          this.router.navigate(['/trips']);
        },
        error: (error) => {
          console.error('Error updating trip:', error);
          this.errorMessage = 'Error updating trip. Please try again.';
          this.isLoading = false;
        },
      });
    } else {
      this.tripService.createTrip(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Trip created successfully!');
          this.router.navigate(['/trips']);
        },
        error: (error) => {
          console.error('Error creating trip:', error);
          this.errorMessage = 'Error creating trip. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }
}
