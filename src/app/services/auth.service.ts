import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.BACKEND_URL}/auth`;
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<{ token: string }>(url, { email, password }).pipe(
      tap((response) => {
        this.token = response.token;
        localStorage.setItem('authToken', this.token);

        const payload = JSON.parse(atob(this.token.split('.')[1]));
        const managerId = payload.id;

        this.getManagerProfile().subscribe((managerData) => {
          localStorage.setItem('managerId', managerId);
          localStorage.setItem('firstName', managerData.firstName);
          localStorage.setItem('lastName', managerData.lastName);
          localStorage.setItem('isAdmin', managerData.admin); // Ajout du statut admin
        });
      })
    );
  }

  getToken(): string | null {
    const token = this.token || localStorage.getItem('authToken');
    console.log('🔑 Token récupéré:', token); // Vérifie dans la console si le token est bien récupéré
    return token;
  }
  

  getManagerProfile(): Observable<any> {
    const url = `${this.apiUrl}/profile`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });
    return this.http.get(url, { headers });
  }

  isManagerConnected(): boolean {
    return !!this.getToken();
  }

  isAdminConnected(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  logout() {
    this.token = null;
    localStorage.clear();
  }
}
