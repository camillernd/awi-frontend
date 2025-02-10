import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  private apiUrl = `${environment.BACKEND_URL}/seller`; // URL de votre API

  constructor(private http: HttpClient) {}

  // Récupérer tous les vendeurs
  getAllSellers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Récupérer un vendeur par son ID
  getSellerById(sellerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${sellerId}`);
  }

  // Créer un nouveau vendeur
  createSeller(sellerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, sellerData);
  }

  // Mettre à jour un vendeur
  updateSeller(sellerId: string, sellerData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${sellerId}`, sellerData);
  }

  // Supprimer un vendeur
  deleteSeller(sellerId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${sellerId}`);
  }
}
