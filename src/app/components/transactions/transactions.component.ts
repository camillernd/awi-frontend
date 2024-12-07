import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  clients: any[] = [];
  sellers: any[] = [];
  managers: any[] = [];
  sessions: any[] = [];
  depositedGames: any[] = [];
  errorMessage: string | null = null;

  // Transaction à créer
  newTransaction = {
    clientId: '',
    sellerId: '',
    managerId: '',
    labelId: '',
    sessionId: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadTransactions();
    this.loadDropdownData();
  }

  // Charger toutes les transactions
  loadTransactions(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour accéder aux transactions.';
      return;
    }

    this.http
      .get<any[]>('http://localhost:8000/transaction', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des transactions', err);
          this.errorMessage = 'Impossible de charger les transactions.';
        },
      });
  }

  // Charger les données pour les listes déroulantes
  loadDropdownData(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour accéder aux données.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

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

    // Charger les managers
    this.http.get<any[]>('http://localhost:8000/manager', { headers }).subscribe({
      next: (data) => (this.managers = data),
      error: (err) => console.error('Erreur lors du chargement des managers', err),
    });

    // Charger les sessions
    this.http.get<any[]>('http://localhost:8000/session', { headers }).subscribe({
      next: (data) => (this.sessions = data),
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });

    // Charger les jeux déposés
    this.http.get<any[]>('http://localhost:8000/depositedGame', { headers }).subscribe({
      next: (data) => (this.depositedGames = data),
      error: (err) => console.error('Erreur lors du chargement des jeux déposés', err),
    });
  }

  // Méthode pour créer une transaction
  createTransaction(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour créer une transaction.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.post('http://localhost:8000/transaction', this.newTransaction, { headers }).subscribe({
      next: () => {
        alert('Transaction créée avec succès.');
        this.loadTransactions(); // Recharger les transactions
        this.resetNewTransaction(); // Réinitialiser le formulaire
      },
      error: (err) => {
        console.error('Erreur lors de la création de la transaction', err);
        alert('Erreur lors de la création de la transaction.');
      },
    });
  }

  // Réinitialiser le formulaire
  resetNewTransaction(): void {
    this.newTransaction = {
      clientId: '',
      sellerId: '',
      managerId: '',
      labelId: '',
      sessionId: '',
    };
  }
}
