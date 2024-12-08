import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-detail',
  templateUrl: './clientDetail.component.html',
  styleUrls: ['./clientDetail.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule], // Ajoutez CommonModule et FormsModule ici
})
export class ClientDetailComponent implements OnInit {
  client: any = null;
  isEditing = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.clientService.getClientById(clientId).subscribe({
        next: (client) => (this.client = client),
        error: (err) => {
          console.error('Erreur lors du chargement du client', err);
          this.errorMessage = 'Impossible de charger les informations du client.';
        },
      });
    }
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

    this.clientService.updateClient(this.client._id, this.client).subscribe({
      next: (updatedClient) => {
        this.client = updatedClient;
        this.isEditing = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du client', err);
        this.errorMessage = 'Erreur lors de la mise à jour.';
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

  goToTransactions(): void {
    if (this.client && this.client._id) {
      // Redirige vers la page des transactions avec l'ID du client dans les queryParams
      this.router.navigate(['/transactions'], { queryParams: { clientId: this.client._id } });
    }
  }
  
  
}
