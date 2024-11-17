import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameDescriptionService {
  private apiUrl = 'http://localhost:8000/gameDescription'; // URL de votre API

  constructor(private http: HttpClient) {}

  getAllGameDescriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}
