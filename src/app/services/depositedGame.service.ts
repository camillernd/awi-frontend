// src/app/services/depositedGame.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepositedGameService {
  private apiUrl = 'http://localhost:8000/depositedGame';
  private sessionUrl = 'http://localhost:8000/depositedGame/sessions'; // Endpoint corrigé pour récupérer les sessions
  private sellerUrl = 'http://localhost:8000/depositedGame/sellers'; // Endpoint corrigé pour récupérer les vendeurs

  constructor(private http: HttpClient) {}

  getDepositedGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  

  // Récupérer un jeu déposé par ID
  getDepositedGameById(depositedGameId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${depositedGameId}`);
  }

  // Créer un jeu déposé
  createDepositedGame(depositedGameData: any): Observable<any> {
    console.log('Envoi des données du depositedGame au backend:', depositedGameData); // Log pour confirmer l'envoi
    return this.http.post<any>(this.apiUrl, depositedGameData);
  }

  // Récupérer tous les jeux déposés
  getAllDepositedGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Mettre à jour un jeu déposé
  updateDepositedGame(id: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updateData);
  }

  // Récupérer tous les jeux déposés pour une session spécifique
  getDepositedGamesBySessionId(sessionId: string): Observable<any[]> {
    if (!sessionId) {
      console.error('Session ID manquant ou invalide !');
      return new Observable<any[]>((observer) => {
        observer.error(new Error('Session ID est requis'));
      });
    }
    return this.http.get<any[]>(`${this.apiUrl}/by-session-id/${sessionId}`);
  }

  // Récupérer toutes les sessions
  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.sessionUrl);
  }

  // Récupérer tous les vendeurs
  getSellers(): Observable<any[]> {
    return this.http.get<any[]>(this.sellerUrl);
  }
}
