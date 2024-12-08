import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManagerService } from '../../services/manager.service';
import { AuthService } from '../../services/auth.service'; // Import du service d'authentification
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './managerDetail.component.html',
  styleUrls: ['./managerDetail.component.css'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
})
export class ManagerDetailComponent implements OnInit {
  manager: any = null;
  isEditing = false;
  isAdmin = false; // Variable pour vérifier si l'utilisateur est admin
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private authService: AuthService, // Injecter le service d'authentification
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est admin
    this.isAdmin = this.authService.isAdminConnected();
  
    // Charger les détails du manager
    const managerId = this.route.snapshot.paramMap.get('id');
    if (managerId) {
      this.managerService.getManagerById(managerId).subscribe({
        next: (manager) => {
          console.log('Manager récupéré :', manager);
          this.manager = manager;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du manager', err);
          this.errorMessage = 'Impossible de charger les informations du manager.';
        },
      });
    }
  }

  editManager(): void {
    if (!this.isAdmin) return; // Vérification supplémentaire
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = null;
  }

  saveChanges(): void {
    if (!this.manager || !this.manager.id) {
      console.error('ID du manager introuvable');
      this.errorMessage = 'Impossible de mettre à jour le manager : ID manquant.';
      return;
    }
  
    this.managerService.updateManager(this.manager.id, this.manager).subscribe({
      next: (updatedManager) => {
        this.manager = updatedManager;
        this.isEditing = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du manager', err);
        this.errorMessage = 'Erreur lors de la mise à jour.';
      },
    });
  }
  

  deleteManager(): void {
    if (!this.manager || !this.manager.id) {
      console.error('ID du manager introuvable');
      this.errorMessage = 'Impossible de supprimer le manager : ID manquant.';
      return;
    }
  
    this.managerService.deleteManager(this.manager.id).subscribe({
      next: () => {
        alert('Manager supprimé avec succès.');
        this.router.navigate(['/managers']);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du manager', err);
        this.errorMessage = 'Erreur lors de la suppression du manager.';
      },
    });
  }
  
}
