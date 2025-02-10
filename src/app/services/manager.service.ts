import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl = `${environment.BACKEND_URL}/manager`;

  constructor(private http: HttpClient) {}

  getAllManagers(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createManager(managerData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.post<any>(`${this.apiUrl}/create`, managerData, { headers });
  }

  getManagerById(managerId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.get<any>(`${this.apiUrl}/${managerId}`, { headers });
  }
  
  // Supprimer cette méthode
  updateManager(managerId: string, managerData: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.patch<any>(`${this.apiUrl}/${managerId}`, managerData, { headers });
  }

  
  deleteManager(managerId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.delete<any>(`${this.apiUrl}/${managerId}`, { headers });
  }
  
}
