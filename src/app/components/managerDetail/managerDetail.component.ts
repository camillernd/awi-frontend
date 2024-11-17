// src/app/components/managerDetail/managerDetail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './managerDetail.component.html',
  styleUrls: ['./managerDetail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManagerDetailComponent implements OnInit {
  manager: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
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
