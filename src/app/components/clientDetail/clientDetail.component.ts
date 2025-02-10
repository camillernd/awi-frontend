import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { TransactionService } from '../../services/transaction.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-detail',
  templateUrl: './clientDetail.component.html',
  styleUrls: ['./clientDetail.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
})
export class ClientDetailComponent implements OnInit {
  client: any = null;
  transactions: any[] = []; // Liste des transactions liées au client
  isEditing = false;
  successMessage: string | null = null; // Message de succès
  errorMessage: string | null = null; // Message d'erreur
  showDeleteConfirmation = false; // Pour afficher ou masquer le modale

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);
      this.loadTransactions(clientId);
    }
  }

  loadClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => (this.client = client),
      error: (err) => {
        console.error('Erreur lors du chargement du client', err);
        this.errorMessage = 'Impossible de charger les informations du client.';
      },
    });
  }

  loadTransactions(clientId: string): void {
    this.transactionService.getTransactionsByClientId(clientId).subscribe({
      next: (transactions) => {
        console.log("Données transactions reçues :", transactions); // 🛠 Vérification
        this.transactions = transactions.sort(
          (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions', err);
        this.errorMessage = '    ';
      },
    });
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
  

  editClient(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = null;
  }

  saveChanges(): void {
    if (!this.client) return;
  
    // Vérifications côté frontend
    if (!this.client.name.trim() || !this.client.email.trim() || !this.client.phone.trim() || !this.client.address.trim()) {
      this.errorMessage = "Tous les champs sont obligatoires.";
      return;
    }
  
    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.client.email)) {
      this.errorMessage = "Veuillez entrer une adresse email valide.";
      return;
    }

  
    this.clientService.updateClient(this.client._id, this.client).subscribe({
      next: (updatedClient) => {
        this.client = updatedClient;
        this.isEditing = false;
        this.errorMessage = null;
        this.successMessage = "Les informations du client ont été mises à jour avec succès.";
        
        // Disparition du message après quelques secondes
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du client', err);
  
        if (err.error?.message?.includes("email")) {
          this.errorMessage = "Cet email est déjà utilisé par un autre client.";
        } else {
          this.errorMessage = "Erreur lors de la mise à jour du client.";
        }
      },
    });
  }
  

  deleteClient(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(this.client._id).subscribe({
        next: () => {
          alert('Client supprimé avec succès.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du client', err);
          this.errorMessage = 'Erreur lors de la suppression.';
        },
      });
    }
  }

    // Fonction pour afficher le modale de confirmation
    confirmDelete(): void {
      this.showDeleteConfirmation = true;
    }
  
    // Suppression définitive après confirmation
    confirmDeleteClient(): void {
      if (this.client) {
        this.clientService.deleteClient(this.client._id).subscribe({
          next: () => {
            this.showDeleteConfirmation = false;
            this.router.navigate(['/clients']); // Redirection après suppression
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du client', err);
            this.errorMessage = 'Erreur lors de la suppression.';
          },
        });
      }
    }

  goBack(): void {
    this.router.navigate(['/clients']);
  }
  
}
