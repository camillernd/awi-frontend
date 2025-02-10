import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root', // Permet l'injection du service dans toute l'application
})
export class ClientService {
  private apiUrl = `${environment.BACKEND_URL}/client`; // URL de l'API backend pour les clients

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Récupérer tous les clients
  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Récupérer un client par son ID
  getClientById(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${clientId}`, { headers: this.getAuthHeaders() });
  }

  // Créer un nouveau client
  createClient(clientData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log("📡 Envoi de la requête avec headers:", headers);
  
    return this.http.post<any>(this.apiUrl, clientData, { headers });
  }

  // Mettre à jour un client
  updateClient(clientId: string, clientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${clientId}`, clientData, { headers: this.getAuthHeaders() });
  }

  // Supprimer un client
  deleteClient(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${clientId}`, { headers: this.getAuthHeaders() });
  }

  // Générer les headers avec le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('⚠️ Aucun token disponible, requête potentiellement refusée.');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
