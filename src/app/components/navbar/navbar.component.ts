import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  managerConnected = false; // Vérifie si le manager est connecté
  adminConnected = false; // Vérifie si le manager est un administrateur
  isDropdownOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.checkManagerConnection();
  }

  checkManagerConnection(): void {
    this.managerConnected = this.authService.isManagerConnected();
    if (this.managerConnected) {
      this.authService.getManagerProfile().subscribe((profile) => {
        this.adminConnected = profile.admin; // Vérifie si le manager est admin
      });
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Navigation Methods
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

  goToCreateSession() {
    this.router.navigate(['/createSession']);
  }

  goToCreateDepositedGame() {
    this.router.navigate(['/createDepositedGame']);
  }

  goToDepositedGamesAdmin() {
    this.router.navigate(['/depositedGamesAdmin']);
  }

  goToClients() {
    this.router.navigate(['/clients']);
    this.isDropdownOpen = false;
  }

  goToSellers() {
    this.router.navigate(['/sellers']);
    this.isDropdownOpen = false;
  }

  goToManagers() {
    this.router.navigate(['/managers']);
    this.isDropdownOpen = false;
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  goToTransactions() {
    this.router.navigate(['/transactions']);
  }

  logout() {
    this.authService.logout();
    this.managerConnected = false;
    this.router.navigate(['/home']);
  }
}
