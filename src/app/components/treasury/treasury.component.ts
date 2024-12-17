import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepositFeePaymentService } from '../../services/depositFeePayment.service';
import { RefundService } from '../../services/refund.service';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-treasury',
  templateUrl: './treasury.component.html',
  styleUrls: ['./treasury.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
})
export class TreasuryComponent implements OnInit {
  depositFeePayments: any[] = [];
  transactions: any[] = [];
  refunds: any[] = [];
  sessions: any[] = [];
  allOperations: any[] = []; // Toutes les opérations filtrées
  selectedSession: string = '';
  totalRevenue: number = 0;
  errorMessage: string | null = null;

  // Tableaux pour stocker les données originales
  originalDepositFeePayments: any[] = [];
  originalTransactions: any[] = [];
  originalRefunds: any[] = [];

  constructor(
    private depositFeePaymentService: DepositFeePaymentService,
    private refundService: RefundService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.loadAllData();
    document.body.style.overflow = 'visible';
  }

  applySessionFilter(): void {
    // Réinitialisez les tableaux en fonction des données originales
    this.depositFeePayments = [...this.originalDepositFeePayments];
    this.transactions = [...this.originalTransactions];
    this.refunds = [...this.originalRefunds];

    // Si aucune session n'est sélectionnée, fusionnez toutes les données
    if (!this.selectedSession) {
      this.mergeAllOperations();
      this.calculateRevenue();
      return;
    }

    // Filtrer par session
    this.depositFeePayments = this.depositFeePayments.filter(
      (payment) => payment.sessionId?._id === this.selectedSession
    );

    this.transactions = this.transactions.filter(
      (transaction) => transaction.sessionId?._id === this.selectedSession
    );

    this.refunds = this.refunds.filter(
      (refund) => refund.sessionId?._id === this.selectedSession
    );

    // Fusionner et recalculer
    this.mergeAllOperations();
    this.calculateRevenue();
  }
  

  loadSessions(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour accéder aux sessions.';
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:8000/session', { headers }).subscribe({
      next: (sessions) => {
        this.sessions = sessions.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sessions', err);
        this.errorMessage = 'Erreur lors du chargement des sessions.';
      },
    });
  }

  loadAllData(): void {
    this.loadDepositFeePayments(() => {
      this.loadTransactions(() => {
        this.loadRefunds(() => {
          // Sauvegardez les données originales
          this.originalDepositFeePayments = [...this.depositFeePayments];
          this.originalTransactions = [...this.transactions];
          this.originalRefunds = [...this.refunds];

          this.mergeAllOperations();
          this.calculateRevenue();
        });
      });
    });
  }

  loadDepositFeePayments(callback?: () => void): void {
    this.depositFeePaymentService.getAllDepositFeePayments().subscribe({
      next: (payments) => {
        this.depositFeePayments = payments.map((payment) => ({
          ...payment,
          type: 'depositFeePayment',
          amount: payment.depositFeePayed,
          date: new Date(payment.depositDate),
        }));
        if (callback) callback();
      },
      error: (error) => console.error('Erreur lors de la récupération des paiements', error),
    });
  }

  loadTransactions(callback?: () => void): void {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:8000/transaction', { headers }).subscribe({
      next: (transactions) => {
        this.transactions = transactions.map((transaction) => ({
          ...transaction,
          type: 'transaction',
          amount: transaction.labelId?.salePrice || 0,
          date: new Date(transaction.transactionDate),
        }));
        if (callback) callback();
      },
      error: (err) => console.error('Erreur lors de la récupération des transactions', err),
    });
  }

  loadRefunds(callback?: () => void): void {
    this.refundService.getAllRefunds().subscribe({
      next: (refunds) => {
        this.refunds = refunds.map((refund) => ({
          ...refund,
          type: 'refund',
          amount: refund.refundAmount,
          date: new Date(refund.refundDate),
        }));
        if (callback) callback();
      },
      error: (err) => console.error('Erreur lors de la récupération des remboursements', err),
    });
  }

  mergeAllOperations(): void {
    this.allOperations = [
      ...this.depositFeePayments,
      ...this.transactions,
      ...this.refunds,
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  calculateRevenue(): void {
    const totalDepositFee = this.depositFeePayments.reduce(
      (sum, payment) => sum + payment.depositFeePayed,
      0
    );
    const totalTransactionRevenue = this.transactions.reduce(
      (sum, transaction) => sum + (transaction.labelId?.salePrice || 0),
      0
    );
    const totalRefunds = this.refunds.reduce(
      (sum, refund) => sum + refund.refundAmount,
      0
    );

    this.totalRevenue = totalDepositFee + totalTransactionRevenue - totalRefunds;
  }
}