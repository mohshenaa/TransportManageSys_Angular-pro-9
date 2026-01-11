import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

export interface Division {
  id: number;
  name: string;
  bn_name: string;
}

export interface District {
  id: number;
  division_id: number;
  name: string;
  bn_name: string;
}

export interface Upazila {
  id: number;
  district_id: number;
  name: string;
  bn_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class Area {
  private basePath = 'assets/data/';

  constructor(private http: HttpClient) {}

  getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.basePath}divisions.json`);
  }

  getDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.basePath}districts.json`);
  }

  getUpazilas(): Observable<Upazila[]> {
    return this.http.get<Upazila[]>(`${this.basePath}upazilas.json`);
  }

  getDistrictsByDivision(divisionId: number): Observable<District[]> {
    return this.getDistricts().pipe(
      map((districts) => districts.filter((d) => d.division_id === divisionId))
    );
  }

  getUpazilasByDistrict(districtId: number): Observable<Upazila[]> {
    return this.getUpazilas().pipe(
      map((upazilas) => upazilas.filter((u) => u.district_id === districtId))
    );
  }

  getAllAreas(): Observable<{ divisions: Division[]; districts: District[]; upazilas: Upazila[] }> {
    return forkJoin({
      divisions: this.getDivisions(),
      districts: this.getDistricts(),
      upazilas: this.getUpazilas(),
    });
  }
}
