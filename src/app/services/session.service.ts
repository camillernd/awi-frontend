// src/app/services/session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:8000/session';

  constructor(private http: HttpClient) {}

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getSessionById(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${sessionId}`);
  }

  createSession(sessionData: any): Observable<any> {
    console.log('Envoi des données de la session au backend:', sessionData); // Log pour confirmer l'envoi
    return this.http.post<any>(`${this.apiUrl}`, sessionData);
  }
}
