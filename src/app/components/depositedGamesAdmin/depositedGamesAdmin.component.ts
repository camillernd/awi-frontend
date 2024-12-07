import { Component, OnInit } from '@angular/core';
import { DepositedGameService } from '../../services/depositedGame.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deposited-games-admin',
  templateUrl: './depositedGamesAdmin.component.html',
  styleUrls: ['./depositedGamesAdmin.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
})
export class DepositedGamesAdminComponent implements OnInit {
  depositedGames: any[] = [];
  filteredGames: any[] = [];
  sessions: any[] = [];
  sellers: any[] = [];
  selectedSession: string = '';
  selectedSeller: string = '';

  constructor(private depositedGameService: DepositedGameService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadDepositedGames();
    this.loadFiltersData();
  }

  // Charger les jeux déposés
  loadDepositedGames(): void {
    this.depositedGameService.getAllDepositedGames().subscribe({
      next: (games) => {
        console.log('Jeux déposés récupérés :', games); // Ajout de log
        this.depositedGames = games;
        this.filteredGames = games; // Initialement, afficher tous les jeux
      },
      error: (err) => console.error('Erreur lors du chargement des jeux déposés', err),
    });
  }

  // Charger les données pour les filtres
  loadFiltersData(): void {
    this.depositedGameService.getSessions().subscribe({
      next: (sessions) => (this.sessions = sessions),
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });

    this.depositedGameService.getSellers().subscribe({
      next: (sellers) => (this.sellers = sellers),
      error: (err) => console.error('Erreur lors du chargement des vendeurs', err),
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.filteredGames = this.depositedGames.filter((game) => {
      const matchesSession = this.selectedSession ? game.sessionId._id === this.selectedSession : true;
      const matchesSeller = this.selectedSeller ? game.sellerId._id === this.selectedSeller : true;
      return matchesSession && matchesSeller;
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.selectedSession = '';
    this.selectedSeller = '';
    this.filteredGames = [...this.depositedGames];
  }

  // Basculer la disponibilité
  toggleAvailability(game: any): void {
    if (game.sold) {
      console.warn(`Le jeu ${game.gameDescriptionId?.name} est déjà vendu et ne peut pas être modifié.`);
      return;
    }

    game.forSale = !game.forSale;
    this.depositedGameService.updateDepositedGame(game._id, { forSale: game.forSale }).subscribe({
      next: () => console.log('Disponibilité mise à jour avec succès'),
      error: (err) => console.error('Erreur lors de la mise à jour', err),
    });
  }

}
