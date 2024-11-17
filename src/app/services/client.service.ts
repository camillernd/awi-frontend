import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Permet l'injection à travers l'application
})
export class ClientService {
  private apiUrl = 'http://localhost:8000/client'; // URL de l'API backend pour les clients

  constructor(private http: HttpClient) {}

  // Récupérer tous les clients
  getAllClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Récupérer un client par son ID
  getClientById(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${clientId}`);
  }

  // Créer un nouveau client
  createClient(clientData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, clientData);
  }

  // Mettre à jour un client
  updateClient(clientId: string, clientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${clientId}`, clientData);
  }

  // Supprimer un client
  deleteClient(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${clientId}`);
  }
}
