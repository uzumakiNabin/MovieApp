import { Injectable } from '@angular/core';
import { GenreDTO, GenreCreationDTO } from './genre.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl + 'genres';

  getAll(): Observable<GenreDTO[]> {
    return this.http.get<GenreDTO[]>(this.apiUrl);
  }

  create(genre: GenreCreationDTO) {
    return this.http.post(this.apiUrl, genre);
  }

  getById(id: number): Observable<GenreDTO> {
    return this.http.get<GenreDTO>(`${this.apiUrl}/${id}`);
  }

  edit(id: number, genre: GenreCreationDTO): Observable<GenreDTO> {
    return this.http.put<GenreDTO>(`${this.apiUrl}/${id}`, genre);
  }

  deleteById(id: number) {
    return this.http.delete<GenreDTO>(`${this.apiUrl}/${id}`);
  }
}
