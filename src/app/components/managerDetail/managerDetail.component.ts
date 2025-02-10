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
  successMessage: string | null = null; // Message de succès
  errorMessage: string | null = null; // Message d'erreur
  showDeleteConfirmation = false; // Pour afficher ou masquer le modale


  constructor(
    private route: ActivatedRoute,
    private managerService: ManagerService,
    private authService: AuthService, // Injecter le service d'authentification
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminConnected();
    const managerId = this.route.snapshot.paramMap.get('id');
  
    console.log("📌 ID du manager extrait de l'URL :", managerId);
  
    if (managerId) {
      this.managerService.getManagerById(managerId).subscribe({
        next: (manager) => {
          if (!manager) {
            console.error("❌ Erreur : Aucun manager trouvé !");
            this.errorMessage = "Le manager n'existe pas.";
            return;
          }
        
          // S'assurer que l'ID est bien défini
          manager.id = manager.id ?? manager._id;
        
          console.log("✅ Manager récupéré :", manager);
          this.manager = manager;
        },
        error: (err) => {
          console.error("❌ Erreur lors du chargement du manager :", err);
          this.errorMessage = "Impossible de charger les informations du manager.";
        },
      });
    } else {
      console.error("❌ Aucun ID trouvé dans l'URL.");
      this.errorMessage = "L'ID du manager n'est pas présent dans l'URL.";
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
    if (!this.manager) return;
  
    // Vérifications côté frontend
    if (!this.manager.firstName.trim() || !this.manager.lastName.trim() || !this.manager.email.trim() || !this.manager.phone.trim()) {
      this.errorMessage = "Tous les champs sont obligatoires.";
      return;
    }
  
    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.manager.email)) {
      this.errorMessage = "Veuillez entrer une adresse email valide.";
      return;
    }
  
    // Vérifier le format du numéro de téléphone (ex: français)
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    if (!phoneRegex.test(this.manager.phone)) {
      this.errorMessage = "Numéro de téléphone non valide. Format attendu : 0601020304 ou +33601020304.";
      return;
    }
  
    this.managerService.updateManager(this.manager.id, this.manager).subscribe({
      next: (updatedManager) => {
        this.manager = updatedManager;
        this.isEditing = false;
        this.errorMessage = null;
        
        setTimeout(() => {
          this.successMessage = "Les informations du manager ont été mises à jour avec succès.";
        }, 500); // Ajoute un petit délai pour éviter des conflits d'affichage
    
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du manager', err);
  
        if (err.error?.message?.includes("email")) {
          this.errorMessage = "Cet email est déjà utilisé par un autre manager.";
        } else {
          this.errorMessage = "Erreur lors de la mise à jour du manager.";
        }
      },
    });
  }
  
  

  deleteManager(): void {
    console.log("Manager actuel avant suppression :", this.manager);
    console.log("ID utilisé pour la suppression :", this.manager.id || this.manager._id);
  
    const managerId = this.manager.id || this.manager._id; // Vérifie quelle clé est présente
    if (!managerId) {
      console.error("⚠️ Erreur : L'ID du manager est introuvable.");
      this.errorMessage = "Impossible de supprimer ce manager : ID manquant.";
      return;
    }
  
    if (confirm('Êtes-vous sûr de vouloir supprimer ce manager ?')) {
      this.managerService.deleteManager(managerId).subscribe({
        next: () => {
          alert('Manager supprimé avec succès.');
          this.router.navigate(['/managers']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du manager', err);
          this.errorMessage = 'Erreur lors de la suppression.';
        },
      });
    }
  }
  

  // Afficher la modale de confirmation
  confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  // Fermer la modale sans supprimer
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  // Suppression définitive après confirmation
  confirmDeleteManager(): void {
    if (!this.manager || !(this.manager.id || this.manager._id)) {
      console.error("❌ Erreur : ID du manager introuvable avant suppression.");
      this.errorMessage = "Impossible de supprimer ce manager : ID introuvable.";
      return;
    }
  
    const managerId = this.manager.id ?? this.manager._id;
    console.log("🛠 Suppression du manager avec ID :", managerId);
  
    this.managerService.deleteManager(managerId).subscribe({
      next: () => {
        console.log("✅ Manager supprimé avec succès.");
        this.showDeleteConfirmation = false;
  
        this.successMessage = "Le manager a été supprimé avec succès.";
  
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/managers']);
        }, 2000);
      },
      error: (err) => {
        console.error("❌ Erreur lors de la suppression du manager :", err);
        this.errorMessage = "Erreur lors de la suppression.";
      },
    });
  }
  
  

  goBack(): void {
    this.router.navigate(['/managers']);
  }
  
}
