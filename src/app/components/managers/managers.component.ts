import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Ajout de CommonModule
import { NavbarComponent } from '../navbar/navbar.component'; // Ajout de NavbarComponent
import { ManagerService } from '../../services/manager.service';
import { Router } from '@angular/router'; // Import de Router

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent], // Ajout de CommonModule et NavbarComponent
})
export class ManagersComponent implements OnInit {
  managers: any[] = [];
  newManager = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    admin: false, // Valeur par défaut
  };
  errorMessage: string | null = null;

  constructor(private managerService: ManagerService, private router: Router) {}

  ngOnInit(): void {
    this.loadManagers();
    document.body.style.overflow = 'visible';
  }

  loadManagers(): void {
    this.managerService.getAllManagers().subscribe({
      next: (managers) => {
        console.log('Managers:', managers); // Vérifiez que chaque manager a un champ `_id`
        this.managers = managers;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des managers', error);
        this.errorMessage = 'Impossible de charger les managers.';
      },
    });
  }
  

  createManager(): void {
    this.managerService.createManager(this.newManager).subscribe({
      next: (createdManager) => {
        this.managers.push(createdManager);
        this.newManager = { firstName: '', lastName: '', email: '', phone: '', address: '', password: '', admin: false };
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erreur lors de la création du manager', error);
        this.errorMessage = error?.error?.message || 'Erreur inconnue.';
      },
    });
  }

  viewManagerDetail(managerId: string): void {
    if (!managerId) {
      console.error('ID du manager manquant');
      return;
    }
    this.router.navigate(['/managerDetail', managerId]); // Assurez-vous que l'ID est correct
  }
  
}
