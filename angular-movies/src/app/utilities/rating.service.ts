import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl + 'ratings';

  rate(movieId: number, rate: number) {
    return this.http.post(this.apiUrl, { movieId, rate });
  }
}
