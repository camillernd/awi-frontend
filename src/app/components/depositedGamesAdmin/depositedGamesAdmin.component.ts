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
  filteredSellers: any[] = []; // Liste des vendeurs filtrés
  sessions: any[] = [];
  sellers: any[] = [];
  selectedSession: string = 'all'; // Filtre par défaut
  selectedSeller: string = 'Tous les vendeurs'; // Filtre par défaut (Tous les vendeurs)
  searchQuery: string = ''; // Recherche par nom ou ID


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
        console.log('Jeux déposés récupérés :', games);
        this.depositedGames = games;
        this.filteredGames = games;
        this.applyFilters(); // Appliquer le filtre par défaut

        // Charger les descriptions et les images des jeux
        this.depositedGames.forEach((game) => {
          console.log(`Données du vendeur pour ${game._id}:`, game.sellerId);
          if (game.gameDescriptionId && typeof game.gameDescriptionId === 'string') {
            this.depositedGameService.getGameDescriptionById(game.gameDescriptionId).subscribe({
              next: (gameDescription) => {
                game.gameDescriptionId = gameDescription;
                console.log(`Détails du jeu récupérés pour ${game._id}:`, gameDescription);
              },
              error: (err) => console.error(`Erreur lors du chargement du jeu ${game._id}`, err),
            });
          }
        });
      },
      error: (err) => console.error('Erreur lors du chargement des jeux déposés', err),
    });
  }

  // Charger les sessions et vendeurs
  loadFiltersData(): void {
    this.depositedGameService.getSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions.map((session) => ({
          ...session,
          status: this.getSessionStatus(session)
        }));
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });

    this.depositedGameService.getSellers().subscribe({
      next: (sellers) => {
        this.sellers = sellers;
        this.filteredSellers = [{ email: 'Tous les vendeurs' }, ...sellers];
      },
      error: (err) => console.error('Erreur lors du chargement des vendeurs', err),
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredGames = this.depositedGames.filter((game) => {
      const matchesSession = this.selectedSession === 'all' || game.sessionId?._id === this.selectedSession;
      const matchesSeller = this.selectedSeller === 'Tous les vendeurs' || game.sellerId?.email === this.selectedSeller;
      const matchesSearch =
        !query ||
        (game.gameDescriptionId?.name?.toLowerCase().includes(query) || game._id.includes(query));

      return matchesSession && matchesSeller && matchesSearch;
    });
  }

  // Filtrer dynamiquement la liste des vendeurs
  filterSellerSuggestions(): void {
    const query = this.selectedSeller.toLowerCase().trim();
    this.filteredSellers = [{ email: 'Tous les vendeurs' }, ...this.sellers.filter(seller =>
      seller.email.toLowerCase().includes(query)
    )];
  }

  // Appliquer le filtre vendeur après sélection
  applySellerFilter(): void {
    if (this.selectedSeller === 'Tous les vendeurs') {
      this.selectedSeller = 'Tous les vendeurs'; // Valeur par défaut
    }
    this.applyFilters();
  }

  

  // Déterminer le statut de la session
  getSessionStatus(session: any): string {
    if (!session) {
      console.error('Session inexistante ou invalide:', session);
      return 'unknown';
    }

    const now = new Date().getTime();
    const startDate = new Date(session.startDate).getTime();
    const endDate = new Date(session.endDate).getTime();

    if (now < startDate) return 'à venir';
    if (now > endDate) return 'clôturée';
    return 'ouverte';
  }

  // Déterminer la classe CSS pour le statut de la session
  getSessionClass(session: any): string {
    const status = this.getSessionStatus(session);

    switch (status) {
      case 'ouverte': return 'session-open';
      case 'clôturée': return 'session-closed';
      case 'à venir': return 'session-upcoming';
      default: return '';
    }
  }

  // Déterminer le statut de l’objet
  getObjectStatusClass(game: any): string {
    const sessionStatus = this.getSessionStatus(game.sessionId);

    if (sessionStatus === 'clôturée') {
      return game.sold ? 'sold' : 'not-sold';
    }
    return game.forSale ? 'available' : 'not-available';
  }

  getObjectStatusText(game: any): string {
    const sessionStatus = this.getSessionStatus(game.sessionId);

    if (sessionStatus === 'clôturée') {
      return game.sold ? 'Vendu' : 'Pas vendu';
    }
    return game.forSale ? 'Oui' : 'Non';
  }

  // Basculer la disponibilité de l’objet
  toggleAvailability(game: any): void {
    const sessionStatus = this.getSessionStatus(game.sessionId);
    if (sessionStatus === 'clôturée') {
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
