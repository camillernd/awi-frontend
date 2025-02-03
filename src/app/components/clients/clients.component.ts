import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  newClient = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };
  
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.loadClients();
    document.body.style.overflow = 'visible';
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => (this.clients = clients),
      error: (error) => {
        console.error('Erreur lors du chargement des clients', error);
        this.errorMessage = 'Impossible de charger les clients.';
      },
    });
  }

  validatePhoneNumber(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone); // Vérifie que le numéro contient 10 chiffres
  }

  createClient(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Vérifier si tous les champs sont remplis
    if (!this.newClient.name || !this.newClient.email || !this.newClient.phone || !this.newClient.address) {
      this.errorMessage = "Tous les champs sont obligatoires.";
      return;
    }

    // Vérifier la validité du numéro de téléphone
    if (!this.validatePhoneNumber(this.newClient.phone)) {
      this.errorMessage = "Le numéro de téléphone doit contenir exactement 10 chiffres.";
      return;
    }

    // Vérifier si l'email est déjà utilisé
    const emailExists = this.clients.some(client => client.email === this.newClient.email);
    if (emailExists) {
      this.errorMessage = "Cet email est déjà utilisé.";
      return;
    }

    this.clientService.createClient(this.newClient).subscribe({
      next: (createdClient) => {
        this.clients.push(createdClient);
        this.newClient = { name: '', email: '', phone: '', address: '' };
        this.errorMessage = null;
        this.successMessage = "Client créé avec succès.";

        // Effacer le message après 3 secondes
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la création du client', error);
        this.errorMessage = error?.error?.message || 'Une erreur inconnue est survenue.';
      },
    });
  }

  viewClientDetail(clientId: string): void {
    this.router.navigate(['/clientDetail', clientId]);
  }
}
