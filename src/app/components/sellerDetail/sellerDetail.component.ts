import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';
import { DepositedGameService } from '../../services/depositedGame.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seller-detail',
  templateUrl: './sellerDetail.component.html',
  styleUrls: ['./sellerDetail.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
})
export class SellerDetailComponent implements OnInit {
  seller: any = null;
  depositedGames: any[] = [];
  filteredGames: any[] = [];
  sessions: any[] = [];
  selectedSession: string = '';
  selectedGameName: string = '';
  isEditing = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private depositedGameService: DepositedGameService, // Ajout du service DepositedGame
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    const sellerId = this.route.snapshot.paramMap.get('id');
    if (sellerId) {
      this.loadSellerData(sellerId);
      this.loadDepositedGames(sellerId);
      this.loadSessions();
    }
  }

  loadSellerData(sellerId: string): void {
    this.sellerService.getSellerById(sellerId).subscribe({
      next: (seller) => (this.seller = seller),
      error: (err) => {
        console.error('Erreur lors du chargement du vendeur', err);
        this.errorMessage = 'Impossible de charger les informations du vendeur.';
      },
    });
  }

  loadDepositedGames(sellerId: string): void {
    this.depositedGameService.getAllDepositedGamesWithSessions().subscribe({
      next: (games) => {
        console.log('Jeux déposés avec sessions chargées :', games);
        this.depositedGames = games.filter((game) => game.sellerId?._id === sellerId);
        this.filteredGames = [...this.depositedGames];
      },
      error: (err) => console.error('Erreur lors du chargement des jeux déposés', err),
    });
  }
  
  

  loadSessions(): void {
    this.depositedGameService.getSessions().subscribe({
      next: (sessions) => {
        console.log('Sessions chargées :', sessions); // Log ajouté
        this.sessions = sessions;
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });
  }
  

  applyFilters(): void {
    this.filteredGames = this.depositedGames.filter((game) => {
      const matchesSession = this.selectedSession ? game.sessionId?._id === this.selectedSession : true;
      const matchesGameName = this.selectedGameName
        ? game.gameDescriptionId?.name.toLowerCase().includes(this.selectedGameName.toLowerCase())
        : true;
      return matchesSession && matchesGameName;
    });
  }

  resetFilters(): void {
    this.selectedSession = '';
    this.selectedGameName = '';
    this.filteredGames = [...this.depositedGames];
  }

  editSeller(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = null;
  }

  saveChanges(): void {
    if (!this.seller) return;

    this.sellerService.updateSeller(this.seller._id, this.seller).subscribe({
      next: (updatedSeller) => {
        this.seller = updatedSeller;
        this.isEditing = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du vendeur', err);
        this.errorMessage = 'Erreur lors de la mise à jour.';
      },
    });
  }

  deleteSeller(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vendeur ?')) {
      this.sellerService.deleteSeller(this.seller._id).subscribe({
        next: () => {
          alert('Vendeur supprimé avec succès.');
          this.router.navigate(['/sellers']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du vendeur', err);
          this.errorMessage = 'Erreur lors de la suppression.';
        },
      });
    }
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
  
    if (now < startDate) return 'upcoming'; // Session à venir (bleu)
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
      : sessionStatus === 'upcoming'
      ? 'upcoming'
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
      : sessionStatus === 'upcoming'
      ? 'Session à venir'
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

  // Basculer la disponibilité du jeu
  toggleAvailability(game: any): void {
    const sessionStatus = this.getSessionStatus(game.sessionId);
    if (game.sold || sessionStatus === 'upcoming' || sessionStatus === 'closed') {
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
