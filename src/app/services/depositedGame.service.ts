// src/app/services/depositedGame.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepositedGameService {
  private apiUrl = 'http://localhost:8000/depositedGame';

  constructor(private http: HttpClient) {}

  getDepositedGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getDepositedGameById(depositedGameId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${depositedGameId}`);
  }

  createDepositedGame(depositedGameData: any): Observable<any> {
    console.log('Envoi des données du depositedGame au backend:', depositedGameData); // Log pour confirmer l'envoi
    return this.http.post<any>(`${this.apiUrl}`, depositedGameData);
  }
}
