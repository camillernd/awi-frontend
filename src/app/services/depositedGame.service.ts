// src/app/services/depositedGame.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import nécessaire pour `tap`
import { map } from 'rxjs/operators';


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

  // Récupérer les détails d'un jeu par son ID
  getGameDescriptionById(gameDescriptionId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/gameDescription/${gameDescriptionId}`);
  }

  // Créer un jeu déposé
  createDepositedGame(depositedGameData: any): Observable<any> {
    console.log('Envoi des données du depositedGame au backend:', depositedGameData); // Log pour confirmer l'envoi
    return this.http.post<any>(this.apiUrl, depositedGameData);
  }

  // Récupérer tous les jeux déposés
  getAllDepositedGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      tap((games) => {
        // Vérifie si les sessions sont incluses
        games.forEach((game) => {
          if (!game.sessionId || !game.sessionId.startDate || !game.sessionId.endDate) {
            console.error('Session manquante ou incomplète pour le jeu :', game);
          }
        });
      })
    );
  }

  // Mettre à jour un jeu déposé
  updateDepositedGame(id: string, updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updateData);
  }

  createDepositedGameWithoutSession(data: {
    sellerId: string;
    gameDescriptionId: string;
    salePrice: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createWithoutSession`, data);
  }
  
  getOpenSession(): Observable<any> {
    return this.http.get<any[]>('http://localhost:8000/session/active').pipe(
      map((sessions: any[]) => {
        const today = new Date();
        return sessions.find(
          (session: any) =>
            new Date(session.startDate) <= today && new Date(session.endDate) >= today
        );
      })
    );
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

  getAllDepositedGamesWithSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/with-sessions`);
  }
  

  // Récupérer toutes les sessions
  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.sessionUrl).pipe(
      tap((sessions) => {
        console.log('Sessions retournées par l\'API :', sessions); // Log ajouté
      })
    );
  }

  // Récupérer tous les vendeurs
  getSellers(): Observable<any[]> {
    return this.http.get<any[]>(this.sellerUrl);
  }

  getDepositedGamesBySellerId(sellerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller/${sellerId}`).pipe(
      tap((games) => console.log(`🔄 Jeux récupérés pour le vendeur ${sellerId}:`, games))
    );
  }
  
}
