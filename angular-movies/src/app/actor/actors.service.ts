import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ActorCreationDTO, ActorDTO, ActorMovieDTO } from './actor.model';
import { formatDateFormData } from '../utilities/utils';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActorsService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl + 'actors';

  getAll(
    page: number,
    recordsPerPage: number
  ): Observable<HttpResponse<ActorDTO[]>> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('recordsPerPage', recordsPerPage);
    return this.http.get<ActorDTO[]>(this.apiUrl, {
      observe: 'response',
      params,
    });
  }

  create(actor: ActorCreationDTO) {
    return this.http.post(this.apiUrl, this.buildFormData(actor));
  }

  getById(id: number): Observable<ActorDTO> {
    return this.http.get<ActorDTO>(`${this.apiUrl}/${id}`);
  }

  edit(id: number, actor: ActorCreationDTO): Observable<ActorDTO> {
    return this.http.put<ActorDTO>(
      `${this.apiUrl}/${id}`,
      this.buildFormData(actor)
    );
  }

  deleteById(id: number) {
    return this.http.delete<ActorDTO>(`${this.apiUrl}/${id}`);
  }

  searchByName(query: string): Observable<ActorMovieDTO[]> {
    const headers = new HttpHeaders('Content-Type: application/json');
    return this.http.post<ActorMovieDTO[]>(
      `${this.apiUrl}/searchByName`,
      JSON.stringify(query),
      { headers }
    );
  }

  private buildFormData(actor: ActorCreationDTO): FormData {
    const formData = new FormData();

    formData.append('name', actor.name);

    if (actor.biography) {
      formData.append('biography', actor.biography);
    }
    if (actor.dateOfBirth) {
      formData.append('dateOfBirth', formatDateFormData(actor.dateOfBirth));
    }
    if (actor.photo) {
      formData.append('photo', actor.photo);
    }

    return formData;
  }
}
