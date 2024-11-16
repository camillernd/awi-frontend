import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DepositedGameService } from '../../services/depositedGame.service';

@Component({
  selector: 'app-create-deposited-game',
  templateUrl: './createDepositedGame.component.html',
  styleUrls: ['./createDepositedGame.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CreateDepositedGameComponent {
  depositedGameData = {
    sellerId: '',
    sessionId: '',
    gameDescriptionId: '',
    salePrice: 0,
    forSale: false,
    pickedUp: false,
    sold: false
  };

  constructor(private depositedGameService: DepositedGameService, private router: Router) {}

  createDepositedGame() {
    console.log('Données du jeu à déposer à créer avec vendeur:', this.depositedGameData);

    // Envoi de la requête de création de dépôt de jeu
    this.depositedGameService.createDepositedGame(this.depositedGameData).subscribe({
      next: () => {
        console.log('Jeu déposé créé avec succès');
        this.router.navigate(['/depositedGames']);
      },
      error: (error) => console.error('Erreur lors de la création du jeu déposé', error),
    });
  }
}
