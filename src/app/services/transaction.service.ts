//src/app/components/services/transaction.service.ts :
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.BACKEND_URL}/transaction`;

  constructor(private http: HttpClient) {}

  // Méthode pour créer plusieurs transactions
  createMultipleTransactions(transactions: any[]): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any[]>(`${this.apiUrl}/bulk`, transactions, { headers });
  }

  getTransactionsBySellerId(sellerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/seller/${sellerId}`);
  }

  getTransactionsByClientId(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client/${clientId}`);
  }
  
  
}
