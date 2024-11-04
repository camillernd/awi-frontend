import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-connected',
  templateUrl: './homeConnected.component.html',
  styleUrls: ['./homeConnected.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeConnectedComponent implements OnInit {
  manager = { firstName: '', lastName: '' }; // Initialisation avec des valeurs par défaut

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getManagerProfile();
  }

  getManagerProfile(): void {
    this.authService.getManagerProfile().subscribe({
      next: (managerData) => {
        console.log('Données du manager récupérées :', managerData);
        this.manager = managerData || { firstName: '', lastName: '' }; // Protection contre null/undefined
      },
      error: (error) => console.error('Erreur de récupération du profil manager:', error),
    });
  }

  // Navigate to the manager profile page
  goToProfile() {
    this.router.navigate(['/managerDetail']);
  }

  // Navigate to the sessions page
  goToSessions() {
    this.router.navigate(['/sessions']);
  }

  // Navigate to the depositedGames page
  goToDepositedGames() {
    this.router.navigate(['/depositedGames']);
  }
}
