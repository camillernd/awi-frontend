// src/app/services/session.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = `${environment.BACKEND_URL}/session`;

  constructor(private http: HttpClient) {}

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getAllSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getSessionById(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${sessionId}`);
  }

  createSession(sessionData: any): Observable<any> {
    console.log('Envoi des données de la session au backend:', sessionData); // Log pour confirmer l'envoi
    return this.http.post<any>(`${this.apiUrl}`, sessionData);
  }

  getSessionReport(sessionId: string): Observable<any> {
    return this.http.get<any>(`${environment.BACKEND_URL}/session/${sessionId}/report`);
  }

  getActiveSessions(): Observable<any[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }; // Exemple avec localStorage
    return this.http.get<any[]>(`${this.apiUrl}/active`, { headers });
  }
  
  hasDepositedGames(sessionId: string): Observable<boolean> {
    return this.http.get<{ hasGames: boolean }>(`${this.apiUrl}/${sessionId}/hasDepositedGames`)
      .pipe(map((response: { hasGames: boolean }) => response.hasGames));
  }
  
  
  deleteSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${sessionId}`);
  }
  

}
