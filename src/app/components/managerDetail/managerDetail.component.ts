// src/app/components/managerDetail/managerDetail.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // Ajout de CommonModule pour les directives *ngIf et *ngFor

@Component({
  selector: 'app-manager-detail',
  templateUrl: './managerDetail.component.html',
  styleUrls: ['./managerDetail.component.css'],
  standalone: true,
  imports: [CommonModule]  // Importation de CommonModule
})
export class ManagerDetailComponent implements OnInit {
  manager: any;

  constructor(private authService: AuthService) {
    console.log('ManagerDetailComponent instancié');
  }

  ngOnInit(): void {
    console.log('ManagerDetailComponent chargé');
    this.getManagerProfile();
  }

  getManagerProfile(): void {
    this.authService.getManagerProfile().subscribe({
      next: (managerData) => {
        console.log('Données du manager récupérées :', managerData);
        this.manager = managerData;
      },
      error: (error) => console.error('Erreur de récupération du profil manager:', error),
    });
  }
}
