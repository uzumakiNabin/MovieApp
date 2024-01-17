import { Injectable } from '@angular/core';
import {
  UserCredentials,
  AuthenicationResponse,
  UserDTO,
} from './security.model';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  apiUrl = environment.apiUrl + 'accounts';
  private readonly tokenKey: string = 'token';
  private readonly expirationKey: string = 'tokenExpiryDate';
  private readonly roleKey: string = 'role';

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return false;
    }
    const expiration = localStorage.getItem(this.expirationKey);
    const expirationDate = expiration && new Date(expiration);
    if (expirationDate && expirationDate <= new Date()) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.expirationKey);
    this.router.navigate(['/login']);
  }

  getRole(): string {
    return this.getFieldFromJWT(this.roleKey);
  }

  register(user: UserCredentials): Observable<AuthenicationResponse> {
    return this.httpClient.post<AuthenicationResponse>(
      `${this.apiUrl}/create`,
      user
    );
  }

  login(user: UserCredentials): Observable<AuthenicationResponse> {
    return this.httpClient.post<AuthenicationResponse>(
      `${this.apiUrl}/login`,
      user
    );
  }

  saveToken(response: AuthenicationResponse) {
    localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
    localStorage.setItem(
      this.expirationKey,
      JSON.stringify(response.expiryDate)
    );
  }

  getToken() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      return JSON.parse(token);
    }
    return null;
  }

  getUsers(
    page: number,
    recordsPerPage: number
  ): Observable<HttpResponse<UserDTO[]>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('recordsPerPage', recordsPerPage.toString());
    return this.httpClient.get<UserDTO[]>(`${this.apiUrl}/listUsers`, {
      observe: 'response',
      params,
    });
  }

  makeAdmin(userId: string) {
    let headers = new HttpHeaders('Content-Type: application/json');
    return this.httpClient.post(
      `${this.apiUrl}/addRole`,
      JSON.stringify({
        userId,
        role: 'admin',
      }),
      { headers }
    );
  }

  removeAdmin(userId: string) {
    let headers = new HttpHeaders('Content-Type: application/json');
    return this.httpClient.post(
      `${this.apiUrl}/removeRole`,
      JSON.stringify({
        userId,
        role: 'admin',
      }),
      { headers }
    );
  }

  getFieldFromJWT(field: string) {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return '';
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData[field];
  }
}
