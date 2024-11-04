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
export class CreateDepositedGameComponent implements OnInit {
  depositedGameData = {
    sellerId: '',
    sessionId: '',
    gameDescriptionId: '',
    salePrice: 0,
    forSale: false,
    pickedUp: false,
    sold: false
  };

  firstName: string | null = null;
  lastName: string | null = null;

  constructor(private depositedGameService: DepositedGameService, private router: Router) {}

  ngOnInit(): void {
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.depositedGameData.sellerId = localStorage.getItem('sellerId') || ''; // Récupérer l'ID du vendeur connecté

    console.log('Vendeur connecté après récupération dans ngOnInit:', {
      firstName: this.firstName,
      lastName: this.lastName,
      sellerId: this.depositedGameData.sellerId
    });
  }

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
