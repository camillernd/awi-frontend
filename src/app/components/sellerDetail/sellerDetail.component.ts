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
import { ChangeDetectorRef } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-seller-detail',
  templateUrl: './sellerDetail.component.html',
  styleUrls: ['./sellerDetail.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
})
export class SellerDetailComponent implements OnInit {
  seller: any = null;
  currentSession: any = null;
  refundMessage: string | null = null;
  depositedGames: any[] = [];
  transactions: any[] = [];
  refunds: any[] = [];
  sessions: any[] = [];
  isEditing = false;
  showDeleteConfirmation = false;
  selectedCategory: string = 'games';
  selectedGame: any = null;
  showPickUpConfirmation: boolean = false;
  successMessage: string | null = null; // Message de succès
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private route: ActivatedRoute,
    private sellerService: SellerService,
    private transactionService: TransactionService,
    private refundService: RefundService,
    private depositedGameService: DepositedGameService,
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService // Ajoute AuthService ici
  ) {}

  ngOnInit(): void {
    const sellerId = this.route.snapshot.paramMap.get('id');
    if (sellerId) {
      this.loadSeller(sellerId);
      this.loadDepositedGames(sellerId);
      this.loadTransactions(sellerId);
      this.loadRefunds(sellerId);
      this.cdr.detectChanges();
      this.loadCurrentSession();
    }
  }

  loadSeller(sellerId: string): void {
    this.sellerService.getSellerById(sellerId).subscribe({
      next: (seller) => (this.seller = seller),
      error: (err: any) => (this.errorMessage = 'Impossible de charger les informations du vendeur.'),
    });
  }

  loadDepositedGames(sellerId: string): void {
    this.depositedGameService.getDepositedGamesBySellerId(sellerId).subscribe({
      next: (games) => {
        this.depositedGames = games;
        console.log("🎮 Jeux déposés récupérés pour ce vendeur :", this.depositedGames);
      },
      error: (err: any) => console.error('❌ Erreur lors du chargement des jeux déposés', err),
    });
  }  

  loadTransactions(sellerId: string): void {
    this.transactionService.getTransactionsBySellerId(sellerId).subscribe({
      next: (transactions) => (this.transactions = transactions),
      error: (err: any) => (this.errorMessage = 'Erreur lors du chargement des transactions.'),
    });
  }

  loadRefunds(sellerId: string): void {
    console.log("Chargement des remboursements...");
    this.refundService.getRefundsBySellerId(sellerId).subscribe({
        next: (refunds) => {
            console.log("🔄 Remboursements récupérés :", refunds);
            this.refunds = [...refunds];
        },
        error: (err: any) => {
            console.error('Erreur lors du chargement des remboursements:', err);
            this.errorMessage = 'Erreur lors du chargement des remboursements.';
        },
    });
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
  
    // Vérifications côté frontend
    if (!this.seller.name.trim() || !this.seller.email.trim() || !this.seller.phone.trim()) {
      this.errorMessage = "Tous les champs sont obligatoires.";
      return;
    }
  
    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.seller.email)) {
      this.errorMessage = "Veuillez entrer une adresse email valide.";
      return;
    }
  
    this.sellerService.updateSeller(this.seller._id, this.seller).subscribe({
      next: (updatedSeller) => {
        this.seller = updatedSeller;
        this.isEditing = false;
        this.errorMessage = null;
        this.successMessage = "Les informations du vendeur ont été mises à jour avec succès.";
        
        // Disparition du message après quelques secondes
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du vendeur', err);
  
        if (err.error?.message?.includes("email")) {
          this.errorMessage = "Cet email est déjà utilisé par un autre vendeur.";
        } else {
          this.errorMessage = "Erreur lors de la mise à jour du vendeur.";
        }
      },
    });
  }
  

  confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  confirmDeleteSeller(): void {
    if (this.seller) {
      this.sellerService.deleteSeller(this.seller._id).subscribe({
        next: () => {
          this.showDeleteConfirmation = false;
          this.router.navigate(['/sellers']);
        },
        error: (err: any) => (this.errorMessage = 'Erreur lors de la suppression.'),
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/sellers']);
  }

  showCategory(category: string): void {
    this.selectedCategory = category;
  }

  // Ajout de cette fonction pour récupérer la session active
loadCurrentSession(): void {
  this.sessionService.getActiveSessions().subscribe({
    next: (sessions) => {
      if (sessions.length === 1) {
        this.currentSession = sessions[0];
        console.log("Session active trouvée :", this.currentSession);
      } else {
        console.warn("Aucune session active trouvée.");
        this.currentSession = null;
      }
    },
    error: (err) => {
      console.error("Erreur lors du chargement de la session active :", err);
      this.currentSession = null;
    },
  });
}

refundSeller(): void {
  console.log("Début du remboursement...");

  if (!this.seller) {
      console.error("Le vendeur n'est pas chargé.");
      this.refundMessage = "Erreur : Vendeur non chargé.";
      return;
  }

  if (!this.currentSession) {
      console.error("Aucune session active.");
      this.refundMessage = "Erreur : Aucune session active.";
      return;
  }

  if (this.seller.amountOwed <= 0) {
      console.warn("Aucun remboursement nécessaire.");
      this.refundMessage = "Aucun remboursement nécessaire.";
      return;
  }

  const managerId = localStorage.getItem('managerId');
  if (!managerId) {
      console.error("Impossible de récupérer l'ID du manager.");
      this.refundMessage = "Erreur : Impossible d'identifier le manager.";
      return;
  }

  const refundData = {
      sellerId: this.seller._id,
      sessionId: this.currentSession._id,
      managerId,
      refundAmount: this.seller.amountOwed,
      refundDate: new Date().toISOString(),
  };

  console.log("Envoi de la requête de remboursement :", refundData);

  this.refundService.createRefund(refundData).subscribe({
      next: () => {
          console.log("Remboursement effectué avec succès.");
          this.sellerService.updateSeller(this.seller._id, { amountOwed: 0 }).subscribe({
              next: () => {
                  console.log("Montant dû mis à jour à 0.");
                  this.refundMessage = "Le vendeur a été remboursé avec succès.";
                  this.seller.amountOwed = 0;
                  
                  // *** Ajout ici : recharge la liste des remboursements après le succès ***
                  this.loadRefunds(this.seller._id);
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

openPickUpConfirmation(game: any): void {
  this.selectedGame = game;
  this.showPickUpConfirmation = true;
}

confirmPickUp(): void {
  if (!this.selectedGame) return;

  const updatedGame = {
    sold: false,
    forSale: false,
    pickedUp: true,
  };

  // Récupère le token depuis AuthService
  const token = this.authService.getToken();

  // Vérifie si le token est bien présent
  if (!token) {
    console.error("❌ Aucun token d'authentification trouvé !");
    return;
  }

  // Crée les headers avec le token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  console.log("📡 Envoi de la requête avec headers :", headers);

  this.depositedGameService.updateDepositedGame(this.selectedGame._id, updatedGame, headers).subscribe({
    next: () => {
      this.selectedGame.sold = false;
      this.selectedGame.forSale = false;
      this.selectedGame.pickedUp = true;
      console.log(`🎮 Jeu récupéré : ${this.selectedGame.gameDescriptionId?.name}`);
      this.showPickUpConfirmation = false;
    },
    error: (err: any) => {
      console.error("❌ Erreur lors de la mise à jour du jeu", err);
      this.showPickUpConfirmation = false;
    },
  });
}


}
