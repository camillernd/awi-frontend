import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { DepositedGameService } from '../../services/depositedGame.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [NavbarComponent]
})
export class CheckoutComponent implements OnInit {
  clients: any[] = [];
  selectedClient: any = null;
  scannedGames: any[] = [];
  totalCost: number = 0;

  constructor(
    private clientService: ClientService,
    private depositedGameService: DepositedGameService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Charger les clients depuis le service
  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => (this.clients = clients),
      error: (err) => console.error('Erreur lors du chargement des clients', err),
    });
  }

  // Sélectionner un client
  onClientSelect(event: any): void {
    const clientId = event.target.value;
    this.selectedClient = this.clients.find((client) => client._id === clientId);
  }

  // Ajouter un jeu scanné au panier
  addGame(gameId: string): void {
    if (!gameId) return;
    this.depositedGameService.getDepositedGameById(gameId).subscribe({
      next: (game) => {
        this.scannedGames.push(game);
        this.updateTotalCost();
      },
      error: (err) => console.error('Erreur lors de l’ajout du jeu', err),
    });
  }

  // Mettre à jour le coût total
  updateTotalCost(): void {
    this.totalCost = this.scannedGames.reduce((total, game) => total + game.salePrice, 0);
  }

  // Finaliser la transaction
  finalizeCheckout(): void {
    alert(`Transaction finalisée. Total à payer : ${this.totalCost} $`);
    this.scannedGames = [];
    this.totalCost = 0;
  }
}
