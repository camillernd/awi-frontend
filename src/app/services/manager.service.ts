import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl = 'http://localhost:8000/manager';

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
}
