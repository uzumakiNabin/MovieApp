import { Injectable } from '@angular/core';
import {
  MovieCreationDTO,
  MovieDTO,
  GenresAndTheatersDTO,
  HomeDTO,
} from './movie.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { formatDateFormData } from '../utilities/utils';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl + 'movies';

  getAll(): Observable<MovieDTO[]> {
    return this.http.get<MovieDTO[]>(this.apiUrl);
  }

  create(movie: MovieCreationDTO): Observable<MovieDTO> {
    return this.http.post<MovieDTO>(this.apiUrl, this.buildFormData(movie));
  }

  getById(id: number): Observable<MovieDTO> {
    return this.http.get<MovieDTO>(`${this.apiUrl}/${id}`);
  }

  edit(id: number, movie: MovieCreationDTO): Observable<MovieDTO> {
    return this.http.put<MovieDTO>(
      `${this.apiUrl}/${id}`,
      this.buildFormData(movie)
    );
  }

  deleteById(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllGenresAndTheaters(): Observable<GenresAndTheatersDTO> {
    return this.http.get<GenresAndTheatersDTO>(
      `${this.apiUrl}/genresntheaters`
    );
  }

  getHomePageMovies(): Observable<HomeDTO> {
    return this.http.get<HomeDTO>(`${this.apiUrl}/home`);
  }

  filter(values: any): Observable<HttpResponse<MovieDTO[]>> {
    const params = new HttpParams({
      fromObject: values,
    });
    return this.http.get<MovieDTO[]>(`${this.apiUrl}/filter`, {
      params,
      observe: 'response',
    });
  }

  private buildFormData(movie: MovieCreationDTO): FormData {
    const formData = new FormData();

    formData.append('title', movie.title);
    formData.append('summary', movie.summary);
    formData.append('trailer', movie.trailer);
    formData.append('inTheaters', movie.inTheaters.toString());

    if (movie.releaseDate) {
      formData.append('releaseDate', formatDateFormData(movie.releaseDate));
    }
    if (movie.poster) {
      formData.append('poster', movie.poster);
    }

    formData.append('genreIds', JSON.stringify(movie.genreIds));
    formData.append('theaterIds', JSON.stringify(movie.theaterIds));
    formData.append('actors', JSON.stringify(movie.actors));

    return formData;
  }
}
