import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Ajout de CommonModule
import { NavbarComponent } from '../navbar/navbar.component'; // Ajout de NavbarComponent
import { ClientService } from '../../services/client.service'; // Service pour gérer les clients
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent], // Ajout de CommonModule et NavbarComponent
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  newClient = {
    name: '',
    email: '',
    phone: '',
    address: '', // Ajout du champ adresse
  };
  errorMessage: string | null = null;

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

  createClient(): void {
    this.clientService.createClient(this.newClient).subscribe({
      next: (createdClient) => {
        this.clients.push(createdClient);
        this.newClient = { name: '', email: '', phone: '', address: '' };
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erreur lors de la création du client', error);
        this.errorMessage = error?.error?.message || 'Erreur inconnue.';
      },
    });
  }

  viewClientDetail(clientId: string): void {
    this.router.navigate(['/clientDetail', clientId]);
  }

}
