import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DriverService } from '../../services/driver';
import { ImageUploadService } from '../../services/image-upload';


@Component({
  selector: 'app-driver-form',
  standalone: false,
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.css',
})
export class DriverForm {
  driverForm: FormGroup;
  isLoading = false;
  message = '';

   constructor(
    private fb: FormBuilder,
    private driverService: DriverService,private uploadservice:ImageUploadService
  ) {
    this.driverForm = this.fb.group({
      driName: ['', Validators.required],
      licenseNum: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern(/^01\d{9}$/)]],
      imageUrl: [],
      isAvailable: [true]
    });
  }

onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    console.log('Selected file:', file);
    
    this.uploadservice.uploadImage(file).subscribe({
      next: (response) => {
        console.log('Upload response:', response);
        // Check what the API returns
        // It should return the file path/URL
      },
      error: (error) => {
        console.error('Upload error:', error);
      }
    });
  }
}

  onSubmit() {
    if (this.driverForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    this.driverService.createDriver(this.driverForm.value).subscribe({
      next: (response) => {
        this.message = 'Driver saved successfully!';
        this.driverForm.reset({
          imageUrl: '',
          isAvailable: true
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Error saving driver. Please try again.';
        console.log('Error:', error);
        this.isLoading = false;
      }
    });
  }

  
}
