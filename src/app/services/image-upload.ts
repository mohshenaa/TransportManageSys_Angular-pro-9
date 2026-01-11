import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private apiUrl = 'https://localhost:7131/api';

  constructor(private http: HttpClient) {}

  uploadPassengerImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Use 'file' as parameter name

    console.log('📤 Uploading image:', file.name);

    // Set responseType to 'text' to handle plain text response
    return this.http
      .post(`${this.apiUrl}/Trip/Upload/passengers`, formData, {
        responseType: 'text', // IMPORTANT: Tell Angular to expect text, not JSON
      })
      .pipe(
        tap({
          next: (response: string) => {
            console.log('✅ Upload successful. Response text:', response);

            // The response is a plain string path like: "/images/passengers/a1aefa2c-f7b7-4c3b-ba76-be2fda573553.png"
            // You can return it as is, or convert to an object
          },
          error: (error) => {
            console.error('❌ Upload Error:', error);
          },
        }),
        catchError((error) => {
          console.error('❌ Complete error:', error);
          return throwError(() => error);
        })
      );
  }

  uploadImage(file: File): Observable<any> {
    return this.uploadPassengerImage(file);
  }

  // Optional: If you want to handle both text and JSON responses
  uploadImageWithResponseType(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return new Observable((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open('POST', `${this.apiUrl}/Trip/Upload/passengers`, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          console.log('XHR Response:', xhr.responseText);
          observer.next(xhr.responseText);
          observer.complete();
        } else {
          observer.error(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        observer.error(new Error('Network error'));
      };

      xhr.send(formData);
    });
  }
  // Add this to image-upload.service.ts
  uploadImageAnyResponseType(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Use observe: 'response' to get full HttpResponse
    return this.http
      .post(`${this.apiUrl}/Trip/Upload/passengers`, formData, {
        observe: 'response',
        responseType: 'text', // This is key!
      })
      .pipe(
        tap((response) => {
          console.log('Full response:', response);
          console.log('Response body:', response.body);
          console.log('Response type:', typeof response.body);
        }),
        catchError((error) => {
          console.error('Upload error:', error);
          return throwError(() => error);
        })
      );
  }
}
