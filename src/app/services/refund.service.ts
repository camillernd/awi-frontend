import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefundService {
  private apiUrl = 'http://localhost:8000/refund'; // Endpoint des remboursements

  constructor(private http: HttpClient) {}

    /**
   * Crée un remboursement
   */
    createRefund(refundData: any): Observable<any> {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.post(this.apiUrl, refundData, { headers });
    }

  /**
   * Récupère tous les remboursements.
   * @returns Observable contenant la liste des remboursements.
   */
  getAllRefunds(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("Aucun jeton trouvé pour l'authentification.");
      throw new Error("Vous devez être connecté pour effectuer cette opération.");
    }

    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getRefundsBySellerId(sellerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller/${sellerId}`);
  }
  
}
