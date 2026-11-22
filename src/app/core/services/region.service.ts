import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { District, Province, Regency, Village } from '../models/region.model';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private readonly http = inject(HttpClient);

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(`${BASE_URL}/provinces.json`);
  }

  getRegencies(provinceId: string): Observable<Regency[]> {
    return this.http.get<Regency[]>(`${BASE_URL}/regencies/${provinceId}.json`);
  }

  getDistricts(regencyId: string): Observable<District[]> {
    return this.http.get<District[]>(`${BASE_URL}/districts/${regencyId}.json`);
  }

  getVillages(districtId: string): Observable<Village[]> {
    return this.http.get<Village[]>(`${BASE_URL}/villages/${districtId}.json`);
  }
}
