import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  sessions: any[] = [];
  clients: any[] = [];
  filteredClients: any[] = [];
  sellers: any[] = [];
  filteredSellers: any[] = [];
  games: any[] = [];
  filteredGames: any[] = [];
  transactionIds: any[] = [];
  filteredTransactionIds: any[] = [];
  selectedSession: string = '';
  selectedClient: string = '';
  selectedSeller: string = '';
  selectedGame: string = '';
  selectedTransactionId: string = '';
  clientInput: string = '';
  sellerInput: string = '';
  gameInput: string = '';
  transactionIdInput: string = ''; // Ajout de l'input pour rechercher par ID
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';

    this.route.queryParams.subscribe((params) => {
      if (params['sellerId']) {
        this.selectedSeller = params['sellerId'];
        this.applyFilters();
      }
    });

    this.loadTransactions();
    this.loadFiltersData();
  }

  // Charger toutes les transactions
  loadTransactions(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour accéder aux transactions.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${environment.BACKEND_URL}/transaction`, { headers }).subscribe({
      next: (data) => {
        // Trier les transactions par date décroissante (de la plus récente à la plus ancienne)
        this.transactions = data.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

        this.filteredTransactions = [...this.transactions]; // Appliquer le tri aux transactions filtrées
        this.transactionIds = [{ _id: 'Toutes les transactions' }, ...this.transactions];
        this.filteredTransactionIds = [...this.transactionIds];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions', err);
        this.errorMessage = 'Impossible de charger les transactions.';
      },
    });
}


  // Charger les données pour les filtres
  loadFiltersData(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour accéder aux données.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${environment.BACKEND_URL}/session`, { headers }).subscribe({
      next: (data) => (this.sessions = data),
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });

    this.http.get<any[]>(`${environment.BACKEND_URL}/client`, { headers }).subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = [{ email: 'Tous les clients' }, ...data];
      },
      error: (err) => console.error('Erreur lors du chargement des clients', err),
    });

    this.http.get<any[]>(`${environment.BACKEND_URL}/seller`, { headers }).subscribe({
      next: (data) => {
        this.sellers = data;
        this.filteredSellers = [{ email: 'Tous les vendeurs' }, ...data];
      },
      error: (err) => console.error('Erreur lors du chargement des vendeurs', err),
    });

    this.http.get<any[]>(`${environment.BACKEND_URL}/gameDescription`, { headers }).subscribe({
      next: (data) => {
        this.games = data;
        this.filteredGames = [{ name: 'Tous les jeux' }, ...data];
      },
      error: (err) => console.error('Erreur lors du chargement des jeux', err),
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter((transaction) => {
      const matchesSession = this.selectedSession
        ? transaction.sessionId?._id === this.selectedSession
        : true;
      const matchesClient = this.selectedClient && this.selectedClient !== 'Tous les clients'
        ? transaction.clientId?.email === this.selectedClient
        : true;
      const matchesSeller = this.selectedSeller && this.selectedSeller !== 'Tous les vendeurs'
        ? transaction.sellerId?.email === this.selectedSeller
        : true;
      const matchesGame = this.selectedGame && this.selectedGame !== 'Tous les jeux'
        ? transaction.labelId?.gameDescriptionId?.name === this.selectedGame
        : true;
      const matchesTransactionId = this.selectedTransactionId && this.selectedTransactionId !== 'Toutes les transactions'
        ? transaction._id === this.selectedTransactionId
        : true;

      return matchesSession && matchesClient && matchesSeller && matchesGame && matchesTransactionId;
    });
  }

  // Filtrer dynamiquement la liste des clients
  filterClientSuggestions(): void {
    const query = this.clientInput.toLowerCase().trim();
    this.filteredClients = [{ email: 'Tous les clients' }, ...this.clients.filter(client =>
      client.email.toLowerCase().includes(query)
    )];
  }

  // Appliquer le filtre client après sélection
  applyClientFilter(): void {
    if (this.clientInput === 'Tous les clients') {
      this.selectedClient = '';
    } else {
      this.selectedClient = this.clientInput;
    }
    this.applyFilters();
  }

  // Filtrer dynamiquement la liste des vendeurs
  filterSellerSuggestions(): void {
    const query = this.sellerInput.toLowerCase().trim();
    this.filteredSellers = [{ email: 'Tous les vendeurs' }, ...this.sellers.filter(seller =>
      seller.email.toLowerCase().includes(query)
    )];
  }

  // Appliquer le filtre vendeur après sélection
  applySellerFilter(): void {
    if (this.sellerInput === 'Tous les vendeurs') {
      this.selectedSeller = '';
    } else {
      this.selectedSeller = this.sellerInput;
    }
    this.applyFilters();
  }

  // Filtrer dynamiquement la liste des jeux
  filterGameSuggestions(): void {
    const query = this.gameInput.toLowerCase().trim();
    this.filteredGames = [{ name: 'Tous les jeux' }, ...this.games.filter(game =>
      game.name.toLowerCase().includes(query)
    )];
  }

  // Appliquer le filtre jeu après sélection
  applyGameFilter(): void {
    if (this.gameInput === 'Tous les jeux') {
      this.selectedGame = '';
    } else {
      this.selectedGame = this.gameInput;
    }
    this.applyFilters();
  }

  // Filtrer dynamiquement la liste des ID de transaction
  filterTransactionIdSuggestions(): void {
    const query = this.transactionIdInput.toLowerCase().trim();
    this.filteredTransactionIds = [{ _id: 'Toutes les transactions' }, ...this.transactionIds.filter(transaction =>
      transaction._id.toLowerCase().includes(query)
    )];
  }

  // Appliquer le filtre ID de transaction après sélection
  applyTransactionIdFilter(): void {
    if (this.transactionIdInput === 'Toutes les transactions') {
      this.selectedTransactionId = '';
    } else {
      this.selectedTransactionId = this.transactionIdInput;
    }
    this.applyFilters();
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.selectedSession = '';
    this.selectedClient = '';
    this.selectedSeller = '';
    this.selectedGame = '';
    this.selectedTransactionId = '';
    this.clientInput = '';
    this.sellerInput = '';
    this.gameInput = '';
    this.transactionIdInput = '';
    this.filteredTransactions = [...this.transactions];
    window.history.replaceState({}, '', '/transactions');
  }

  // Méthode pour formater les dates au format jj/mm/aaaa hh:mm
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

}
