import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { TheaterDTO, TheaterCreationDTO } from './theater.model';

@Injectable({
  providedIn: 'root',
})
export class TheatersService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl + 'theaters';

  getAll(): Observable<TheaterDTO[]> {
    return this.http.get<TheaterDTO[]>(this.apiUrl);
  }

  create(theater: TheaterCreationDTO) {
    return this.http.post(this.apiUrl, theater);
  }

  getById(id: number): Observable<TheaterDTO> {
    return this.http.get<TheaterDTO>(`${this.apiUrl}/${id}`);
  }

  edit(id: number, theater: TheaterCreationDTO): Observable<TheaterDTO> {
    return this.http.put<TheaterDTO>(`${this.apiUrl}/${id}`, theater);
  }

  deleteById(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
