import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';
import { RefundService } from '../../services/refund.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { DepositedGameService } from '../../services/depositedGame.service';
import { TransactionService } from '../../services/transaction.service';
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
  currentSession: any = null; // Session active
  refundMessage: string | null = null;
  depositedGames: any[] = [];
  transactions: any[] = []; // Transactions
  refunds: any[] = []; // Remboursements
  filteredGames: any[] = [];
  sessions: any[] = [];
  selectedSession: string = '';
  selectedGameName: string = '';
  isEditing = false;
  errorMessage: string | null = null;
  selectedCategory: string = 'games'; // Catégorie sélectionnée par défaut

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private sessionService: SessionService, // Ajout du service SessionService
    private refundService: RefundService, // Ajout du service RefundService
    private authService: AuthService, // Pour récupérer le manager connecté
    private depositedGameService: DepositedGameService, // Ajout du service DepositedGame
    private router: Router,
    private transactionService: TransactionService, // Service Transactions
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    const sellerId = this.route.snapshot.paramMap.get('id');
    if (sellerId) {
      this.loadSellerData(sellerId);
      this.loadDepositedGames(sellerId);
      this.loadSessions();
      this.loadCurrentSession();
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


  loadTransactions(sellerId: string): void {
    this.transactionService.getTransactionsBySellerId(sellerId).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
      },
      error: (err) => console.error('Erreur lors du chargement des transactions', err),
    });
  }

  loadRefunds(sellerId: string): void {
    this.refundService.getRefundsBySellerId(sellerId).subscribe({
      next: (refunds) => {
        this.refunds = refunds;
      },
      error: (err) => console.error('Erreur lors du chargement des remboursements', err),
    });
  }

  // Méthode pour afficher la catégorie sélectionnée
  showCategory(category: string): void {
    this.selectedCategory = category;
    const sellerId = this.seller?._id;
    if (category === 'transactions' && sellerId) {
      this.loadTransactions(sellerId);
    } else if (category === 'refunds' && sellerId) {
      this.loadRefunds(sellerId);
    }
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

  // Basculer la disponibilité du jeu
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


  private loadCurrentSession(): void {
    this.sessionService.getActiveSessions().subscribe({
      next: (sessions) => {
        if (sessions.length === 1) {
          this.currentSession = sessions[0];
        }
      },
      error: (err) => console.error('Erreur lors du chargement de la session active:', err),
    });
  }

  refundSeller(): void {
    if (!this.seller || !this.currentSession) return;

    const refundAmount = this.seller.amountOwed;
    const managerId = localStorage.getItem('managerId'); // Récupération via localStorage

    const refundData = {
      sellerId: this.seller._id,
      sessionId: this.currentSession._id,
      managerId,
      refundAmount,
      refundDate: new Date(),
    };

    this.refundService.createRefund(refundData).subscribe({
      next: () => {
        this.sellerService.updateSeller(this.seller._id, { amountOwed: 0 }).subscribe({
          next: () => {
            this.refundMessage = 'Le vendeur a été remboursé avec succès.';
            this.seller.amountOwed = 0;
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du vendeur:', err);
            this.refundMessage = 'Une erreur est survenue lors de la mise à jour du vendeur.';
          },
        });
      },
      error: (err) => {
        console.error('Erreur lors de la création du remboursement:', err);
        this.refundMessage = 'Une erreur est survenue lors du remboursement.';
      },
    });
  }
}
