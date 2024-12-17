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
    this.depositedGameService.getAllDepositedGamesWithSessions().subscribe({
      next: (games) => {
        console.log('Jeux déposés récupérés :', games); // Log ajouté
        this.depositedGames = games;
        this.filteredGames = games; // Initialement, afficher tous les jeux
      },
      error: (err) => console.error('Erreur lors du chargement des jeux déposés', err),
    });
  }

  // Charger les données pour les filtres
  loadFiltersData(): void {
    this.depositedGameService.getSessions().subscribe({
      next: (sessions) => {
        console.log('Sessions chargées :', sessions); // Log ajouté
        this.sessions = sessions;
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });

    this.depositedGameService.getSellers().subscribe({
      next: (sellers) => {
        console.log('Vendeurs chargés :', sellers); // Log ajouté
        this.sellers = sellers;
      },
      error: (err) => console.error('Erreur lors du chargement des vendeurs', err),
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.filteredGames = this.depositedGames.filter((game) => {
      const matchesSession = this.selectedSession ? game.sessionId?._id === this.selectedSession : true;
      const matchesSeller = this.selectedSeller ? game.sellerId?._id === this.selectedSeller : true;
      return matchesSession && matchesSeller;
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.selectedSession = '';
    this.selectedSeller = '';
    this.filteredGames = [...this.depositedGames];
  }

  // Déterminer le statut de la session
  getSessionStatus(session: any): string {
    if (!session) {
      console.error('Session inexistante ou invalide:', session); // Log ajouté
      return 'unknown'; // Gérer les cas où la session est inexistante
    }

    const now = new Date().getTime();
    const startDate = new Date(session.startDate).getTime();
    const endDate = new Date(session.endDate).getTime();

    if (now > endDate) return 'closed'; // Session clôturée (noir)
    return 'open'; // Session en cours (vert ou rouge)
  }

  // Déterminer la classe CSS du bouton
  getAvailabilityClass(game: any): string {
    const sessionStatus = this.getSessionStatus(game.sessionId);

    const result = game.sold
      ? 'sold'
      : sessionStatus === 'closed'
      ? 'closed'
      : game.forSale
      ? 'available'
      : 'not-available';

    console.log('Classe pour le jeu :', {
      gameId: game._id,
      sessionStatus,
      forSale: game.forSale,
      sold: game.sold,
      result,
    });

    return result;
  }

  // Déterminer le texte du bouton
  getAvailabilityText(game: any): string {
    const sessionStatus = this.getSessionStatus(game.sessionId);

    const result = game.sold
      ? 'Vendu'
      : sessionStatus === 'closed'
      ? 'Session clôturée'
      : game.forSale
      ? 'Oui'
      : 'Non';

    console.log('Texte pour le jeu :', {
      gameId: game._id,
      sessionStatus,
      forSale: game.forSale,
      sold: game.sold,
      result,
    });

    return result;
  }

  // Basculer la disponibilité
  toggleAvailability(game: any): void {
    const sessionStatus = this.getSessionStatus(game.sessionId);
    if (game.sold || sessionStatus === 'closed') {
      console.warn('Modification non autorisée pour ce jeu.');
      return;
    }

    game.forSale = !game.forSale;
    this.depositedGameService.updateDepositedGame(game._id, { forSale: game.forSale }).subscribe({
      next: () => console.log('Disponibilité mise à jour avec succès'),
      error: (err) => console.error('Erreur lors de la mise à jour', err),
    });
  }
}
