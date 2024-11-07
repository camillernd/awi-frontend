// src/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  managerConnected = false; // Variable pour vérifier la connexion du manager

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkManagerConnection();
  }

  // Méthode pour vérifier si le manager est connecté
  checkManagerConnection(): void {
    this.managerConnected = this.authService.isManagerConnected();
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/managerDetail']);
  }

  goToSessions() {
    this.router.navigate(['/sessions']);
  }

  goToDepositedGames() {
    this.router.navigate(['/depositedGames']);
  }

  logout() {
    this.authService.logout();
    this.managerConnected = false;
    this.router.navigate(['/home']);
  }
}
