import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameDescriptionService {
  private apiUrl = `${environment.BACKEND_URL}/gameDescription`; // URL de votre API

  constructor(private http: HttpClient) {}

  getAllGameDescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  createGameDescription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }
  
}
