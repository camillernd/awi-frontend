import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  sellers: any[] = [];
  selectedSession: string = '';
  selectedClient: string = '';
  selectedSeller: string = '';
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';

    // Vérifie les paramètres de la requête
    this.route.queryParams.subscribe((params) => {
      if (params['sellerId']) {
        this.selectedSeller = params['sellerId'];
        this.applyFilters(); // Applique les filtres dès qu'un sellerId est détecté
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

    this.http
      .get<any[]>('http://localhost:8000/transaction', { headers })
      .subscribe({
        next: (data) => {
          this.transactions = data;
          this.filteredTransactions = data; // Initialement, toutes les transactions
          this.applyFilters(); // Applique les filtres après le chargement des transactions
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

    // Charger les sessions
    this.http.get<any[]>('http://localhost:8000/session', { headers }).subscribe({
      next: (data) => (this.sessions = data),
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });

    // Charger les clients
    this.http.get<any[]>('http://localhost:8000/client', { headers }).subscribe({
      next: (data) => (this.clients = data),
      error: (err) => console.error('Erreur lors du chargement des clients', err),
    });

    // Charger les vendeurs
    this.http.get<any[]>('http://localhost:8000/seller', { headers }).subscribe({
      next: (data) => (this.sellers = data),
      error: (err) => console.error('Erreur lors du chargement des vendeurs', err),
    });
  }

  // Appliquer les filtres
  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter((transaction) => {
      const matchesSession = this.selectedSession
        ? transaction.sessionId?._id === this.selectedSession
        : true;
      const matchesClient = this.selectedClient
        ? transaction.clientId?._id === this.selectedClient
        : true;
      const matchesSeller = this.selectedSeller
        ? transaction.sellerId?._id === this.selectedSeller
        : true;

      return matchesSession && matchesClient && matchesSeller;
    });
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.selectedSession = '';
    this.selectedClient = '';
    this.selectedSeller = '';
    this.filteredTransactions = [...this.transactions];

    // Réinitialise l'URL en supprimant les queryParams
    window.history.replaceState({}, '', '/transactions');
  }
}
