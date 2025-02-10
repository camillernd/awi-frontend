import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameDescriptionService } from '../../services/gameDescription.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-create-game-description',
  templateUrl: './createGameDescription.component.html',
  styleUrls: ['./createGameDescription.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
})
export class CreateGameDescriptionComponent implements OnInit {
  gameDescriptionData = {
    name: '',
    publisher: '',
    description: '',
    photoURL: '',
    minPlayers: 1,
    maxPlayers: 1,
    ageRange: '5-10', //val par def
  };

  firstName: string | null = null;
  lastName: string | null = null;
  successMessage: string | null = null; // Message de succès
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private gameDescriptionService: GameDescriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
  }

  createGameDescription(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // 🛑 Vérifications avant soumission
    if (!this.gameDescriptionData.name.trim()) {
      this.errorMessage = "Le nom du jeu est obligatoire.";
      return;
    }

    if (!this.gameDescriptionData.publisher.trim()) {
      this.errorMessage = "L'éditeur du jeu est obligatoire.";
      return;
    }

    if (!this.gameDescriptionData.photoURL.trim()) {
      this.errorMessage = "L'URL de la photo est obligatoire.";
      return;
    }

    if (!this.gameDescriptionData.description.trim()) {
      this.errorMessage = "La description du jeu est obligatoire.";
      return;
    }

    if (this.gameDescriptionData.description.length > 250) {
      this.errorMessage = "La description ne peut pas dépasser 250 caractères.";
      return;
    }    

    if (this.gameDescriptionData.minPlayers < 1 || isNaN(this.gameDescriptionData.minPlayers)) {
      this.errorMessage = "Le nombre minimum de joueurs doit être un nombre positif.";
      return;
    }

    if (this.gameDescriptionData.maxPlayers < 1 || isNaN(this.gameDescriptionData.maxPlayers)) {
      this.errorMessage = "Le nombre maximum de joueurs doit être un nombre positif.";
      return;
    }

    if (this.gameDescriptionData.minPlayers > this.gameDescriptionData.maxPlayers) {
      this.errorMessage = "Le nombre minimum de joueurs ne peut pas être supérieur au nombre maximum.";
      return;
    }

    console.log("Données envoyées au backend:", this.gameDescriptionData);

    this.gameDescriptionService.createGameDescription(this.gameDescriptionData).subscribe({
      next: () => {
        this.successMessage = "La description du jeu a été créée avec succès. Redirection...";
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (error) => {
        console.error("Erreur lors de la création de la description du jeu", error);
        this.errorMessage = "Une erreur est survenue lors de la création.";
      },
    });
  }
}
