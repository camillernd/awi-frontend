// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, { email, password }, { headers });
  }
  
  getManagerProfile(): Observable<any> {
    const url = `${this.apiUrl}/profile`;
    const token = localStorage.getItem('token'); // Assurez-vous que le token est bien stocké
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url, { headers });
  }
  
}
