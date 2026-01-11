import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripService } from '../../services/trip';

@Component({
  selector: 'app-trip-details',
  standalone: false,
  templateUrl: './trip-details.html',
  styleUrls: ['./trip-details.css'],
})
export class TripDetails implements OnInit {
  trip = signal<any>(null);

  constructor(private route: ActivatedRoute, private tripService: TripService) {}

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id');
    if (tripId) {
      this.loadTripDetails(+tripId);
    }
  }

  loadTripDetails(tripId: number): void {
    this.tripService.getTripById(tripId).subscribe({
      next: (trip) => {
        console.log('=== TRIP DETAILS DEBUG ===');
        console.log('Full trip object:', trip);

        if (trip.passengers && trip.passengers.length > 0) {
          console.log('Passengers found:', trip.passengers.length);
          trip.passengers.forEach((passenger: any, index: number) => {
            console.log(`Passenger ${index + 1}:`, {
              name: passenger.psngrName,
              imageUrl: passenger.imageUrl,
              image: passenger.image,
              photo: passenger.photo,
              allProperties: Object.keys(passenger),
              allValues: passenger,
            });
          });
        }
        console.log('=== END DEBUG ===');

        this.trip.set(trip);
      },
      error: (error) => {
        console.error('Error loading trip:', error);
      },
    });
  }
  onImageError(event: any): void {
    console.log('Image failed to load:', event);
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = `
    <div class="image-error-placeholder bg-light rounded d-flex align-items-center justify-content-center" 
         style="height: 150px;">
      <span class="text-danger">Image not found</span>
    </div>
  `;
  }
  getPassengerImage(passenger: any): string {
    if (!passenger) return '';

    // Try all possible image property names
    const imageProp = this.findImageProperty(passenger);
    if (!imageProp) return '';

    const imageValue = passenger[imageProp];
    return this.getFullImagePath(imageValue);
  }

  findImageProperty(passenger: any): string | null {
    if (!passenger) return null;

    const possibleProps = ['imageUrl', 'image', 'photo', 'filePath', 'url', 'imagePath'];
    for (const prop of possibleProps) {
      if (passenger[prop] && passenger[prop].toString().trim() !== '') {
        console.log(`Found image in property "${prop}": ${passenger[prop]}`);
        return prop;
      }
    }
    return null;
  }

  getFullImagePath(imagePath: string): string {
    if (!imagePath || imagePath.toString().trim() === '') {
      return '';
    }

    const baseUrl = 'https://localhost:7131';

    // Convert to string and trim
    imagePath = imagePath.toString().trim();

    // Already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If it starts with /images/
    if (imagePath.startsWith('/images/')) {
      return baseUrl + imagePath;
    }

    // If it starts with images/ (no leading slash)
    if (imagePath.startsWith('images/')) {
      return baseUrl + '/' + imagePath;
    }

    // If it's just a filename or relative path
    if (!imagePath.startsWith('/')) {
      return baseUrl + '/images/passengers/' + imagePath;
    }

    // Any other relative path
    return baseUrl + imagePath;
  }

  hasPassengerImage(passenger: any): boolean {
    const imageProp = this.findImageProperty(passenger);
    return !!imageProp;
  }
}
