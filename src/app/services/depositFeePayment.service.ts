import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DepositFeePaymentService {
  private apiUrl = `${environment.BACKEND_URL}/depositFeePayment`;

  constructor(private http: HttpClient) {}

  /**
   * Crée un paiement des frais de dépôt.
   * @param paymentData - Données nécessaires pour le paiement.
   * @returns Observable du résultat de la requête HTTP.
   */
  createPayment(paymentData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Aucun jeton trouvé pour l\'authentification.');
      throw new Error('Vous devez être connecté pour effectuer cette opération.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(this.apiUrl, paymentData, { headers });
  }

  getAllDepositFeePayments(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("Aucun jeton trouvé pour l'authentification.");
      throw new Error("Vous devez être connecté pour effectuer cette opération.");
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
