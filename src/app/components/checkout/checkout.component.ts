//src/app/components/checkout/checkout.component.ts :
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { DepositedGameService } from '../../services/depositedGame.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { TransactionService } from '../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],  
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
})
export class CheckoutComponent implements OnInit {
  clients: any[] = [];
  selectedClient: any = null;
  clientInput: string = ''; // Valeur tapée par l'utilisateur
  filteredClients: any[] = []; // Liste des vendeurs filtrés
  //------------------------
  scannedGameId: string = '';
  cartItems: { gameData: any | null }[] = [];
  totalCost: number = 0;
  errorMessage: string = ''; 
  successMessage: string | null = null; // Message de succès

  constructor(
    private clientService: ClientService,
    private depositedGameService: DepositedGameService,
    private transactionService: TransactionService, // Ajout du service des transactions
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadClients();
  }

  // Charger les clients depuis le service
  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients; // On initialise avec tous les vendeurs
      },
      error: (error) => console.error('Erreur lors du chargement des clients', error),
    });
  }

  
  filterClientSuggestions(): void {
    this.filteredClients = this.clients.filter(client =>
      client.email.toLowerCase().includes(this.clientInput.toLowerCase())
    );
  }

  onClientSelectByEmail(): void {
    const foundClient = this.clients.find(client => client.email === this.clientInput);
    if (foundClient) {
      this.selectedClient = foundClient;
    }
  }

  // Sélectionner un client
  onClientSelect(event: any): void {
    const clientId = event.target.value;
    this.selectedClient = this.clients.find((client) => client._id === clientId);
  }

  goToClients(): void {
    this.router.navigate(['/clients']);
  }

  // Ajouter un article scanné
  addScannedGame(): void {
    const gameId = this.scannedGameId.trim();
    if (!gameId) {
      this.errorMessage = 'Veuillez entrer un ID valide.';
      return;
    }

    if (this.cartItems.some((item) => item.gameData?._id === gameId)) {
      this.errorMessage = `L'article avec l'ID ${gameId} est déjà dans le panier.`;
      return;
    }

    this.depositedGameService.getDepositedGameById(gameId).subscribe({
      next: (game) => {
        if (!game) {
          this.errorMessage = "Jeu non reconnu.";
          return;
        }
        if (game.sold) {
          this.errorMessage = "Ce jeu a déjà été vendu.";
          return;
        }
        if (!game.forSale) {
          this.errorMessage = "Ce jeu n'est pas à vendre.";
          return;
        }

        this.cartItems.push({ gameData: game });
        this.updateTotalCost();
        this.scannedGameId = '';
        this.errorMessage = ''; 
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du scan du jeu avec ID: ${gameId}`;
        console.error(err);
      },
    });
  }

  // Supprimer un article du panier
  removeCartItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateTotalCost();
  }

  // Mettre à jour le coût total
  updateTotalCost(): void {
    this.totalCost = this.cartItems.reduce((total, item) => {
      return item.gameData ? total + item.gameData.salePrice : total;
    }, 0);
  }

  // Méthode pour finaliser le paiement et créer des transactions
  finalizeCheckout(): void {

    // Vérifier si le panier est vide
    if (this.cartItems.length === 0) {
      this.errorMessage = "Votre panier est vide. Ajoutez au moins un article avant de finaliser.";
      return;
    }
    
    if (!this.selectedClient) {
      this.errorMessage = "Veuillez sélectionner un client avant de finaliser.";
      return;
    }

    const transactions = this.cartItems.map((item) => ({
      labelId: item.gameData._id,
      sessionId: item.gameData.sessionId,
      sellerId: item.gameData.sellerId,
      clientId: this.selectedClient._id,
    }));

    this.transactionService.createMultipleTransactions(transactions).subscribe({
      next: (response: any) => {
        this.successMessage = `Transaction réussie pour ${response.length} articles. Total : ${this.totalCost} $. Redirection vers l'accueil...`;
        this.cartItems = [];
        this.totalCost = 0;

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('Erreur lors de la finalisation des transactions', error);
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      },
    });
  }
}
