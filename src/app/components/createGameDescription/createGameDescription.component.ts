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
  successMessage: string | null = null; // 🔹 Message de succès

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
    if (this.gameDescriptionData.minPlayers > this.gameDescriptionData.maxPlayers) {
      alert('Le nombre minimum de joueurs ne peut pas dépasser le nombre maximum.');
      return;
    }

    console.log('Données envoyées au backend:', this.gameDescriptionData);

    this.gameDescriptionService
      .createGameDescription(this.gameDescriptionData)
      .subscribe({
        next: () => {
          console.log('Description du jeu créée avec succès.');
          
          // 🔹 Afficher un message de succès
          this.successMessage = "La description du jeu a été créée avec succès !";
          
          // 🔹 Redirection après 3 secondes
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la description du jeu', error);
          alert('Erreur lors de la création.');
        },
      });
  }
}
