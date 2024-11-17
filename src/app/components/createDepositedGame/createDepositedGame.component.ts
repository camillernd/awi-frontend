import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepositedGameService } from '../../services/depositedGame.service';
import { SellerService } from '../../services/seller.service';
import { SessionService } from '../../services/session.service';
import { GameDescriptionService } from '../../services/gameDescription.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-create-deposited-game',
  templateUrl: './createDepositedGame.component.html',
  styleUrls: ['./createDepositedGame.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
})
export class CreateDepositedGameComponent implements OnInit {
  selectedSeller: any = null;
  selectedSession: any = null;
  sellers: any[] = [];
  sessions: any[] = [];
  gameDescriptions: any[] = [];

  // Liste dynamique des jeux
  depositedGames: any[] = [
    {
      gameDescriptionId: '',
      salePrice: 0,
      forSale: false,
    },
  ];

  // Totaux pour affichage
  totalDepositFee = 0;
  totalDiscount = 0;
  totalAfterDiscount = 0;

  constructor(
    private depositedGameService: DepositedGameService,
    private sellerService: SellerService,
    private sessionService: SessionService,
    private gameDescriptionService: GameDescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadSellers();
    this.loadSessions();
    this.loadGameDescriptions();
  }

  loadSellers(): void {
    this.sellerService.getAllSellers().subscribe({
      next: (sellers) => {
        this.sellers = sellers;
      },
      error: (error) => console.error('Erreur lors du chargement des vendeurs', error),
    });
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      },
      error: (error) => console.error('Erreur lors du chargement des sessions', error),
    });
  }


  loadGameDescriptions(): void {
    this.gameDescriptionService.getAllGameDescriptions().subscribe({
      next: (gameDescriptions) => {
        this.gameDescriptions = gameDescriptions;
      },
      error: (error) => console.error('Erreur lors du chargement des descriptions de jeu', error),
    });
  }

  onSellerSelect(event: any): void {
    const sellerId = event.target.value;
    this.selectedSeller = this.sellers.find((seller) => seller._id === sellerId);
  }

  onSessionSelect(event: any): void {
    const sessionId = event.target.value;
    this.selectedSession = this.sessions.find((session) => session._id === sessionId);
    this.updateTotals();
  }

  addGame(): void {
    this.depositedGames.push({
      gameDescriptionId: '',
      salePrice: 0,
      forSale: false,
    });
    this.updateTotals();
  }

  removeGame(index: number): void {
    if (this.depositedGames.length > 1) {
      this.depositedGames.splice(index, 1);
      this.updateTotals();
    }
  }

  updateTotals(): void {
    if (!this.selectedSession) return;

    const { depositFee, depositFeeLimitBeforeDiscount, depositFeeDiscount } = this.selectedSession;

    this.totalDepositFee = this.depositedGames.length * depositFee;
    const eligibleForDiscount = this.depositedGames.length >= depositFeeLimitBeforeDiscount;
    this.totalDiscount = eligibleForDiscount
      ? (this.totalDepositFee * depositFeeDiscount) / 100
      : 0;
    this.totalAfterDiscount = this.totalDepositFee - this.totalDiscount;
  }

  createDepositedGames(): void {
    if (!this.selectedSeller || !this.selectedSession) {
      alert('Veuillez sélectionner un vendeur et une session.');
      return;
    }

    const requests = this.depositedGames.map((game) => ({
      ...game,
      sellerId: this.selectedSeller._id,
      sessionId: this.selectedSession._id,
    }));

    requests.forEach((gameData) => {
      this.depositedGameService.createDepositedGame(gameData).subscribe({
        next: () => {
          console.log('Jeu déposé créé avec succès');
        },
        error: (error) => console.error('Erreur lors de la création du jeu déposé', error),
      });
    });

    this.router.navigate(['/depositedGames']);
  }

  finalizeTotals(): void {
    if (!this.selectedSession) {
      alert('Veuillez sélectionner une session pour calculer les totaux.');
      return;
    }
  
    const { depositFee, depositFeeLimitBeforeDiscount, depositFeeDiscount } = this.selectedSession;
  
    // Calcul des totaux
    this.totalDepositFee = this.depositedGames.length * depositFee;
    const eligibleForDiscount = this.depositedGames.length >= depositFeeLimitBeforeDiscount;
    this.totalDiscount = eligibleForDiscount
      ? (this.totalDepositFee * depositFeeDiscount) / 100
      : 0;
    this.totalAfterDiscount = this.totalDepositFee - this.totalDiscount;

    console.log('Totaux mis à jour après finalisation');
  }


}
