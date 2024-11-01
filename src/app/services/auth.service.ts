// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<{ token: string }>(url, { email, password }).pipe(
      tap(response => {
        this.token = response.token; // Stocke le token après connexion
        localStorage.setItem('authToken', this.token); // Sauvegarde également le token dans localStorage pour persistance
      })
    );
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('authToken'); // Récupère le token stocké
  }

  getManagerProfile(): Observable<any> {
    const url = `${this.apiUrl}/profile`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}` // Inclut le token JWT dans l'en-tête
    });
    return this.http.get(url, { headers });
  }
}
