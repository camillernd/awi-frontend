import { Component, OnInit } from '@angular/core';
import { DepositedGameService } from '../../services/depositedGame.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common'; // Import de CommonModule

@Component({
  selector: 'app-deposited-games-admin',
  templateUrl: './depositedGamesAdmin.component.html',
  styleUrls: ['./depositedGamesAdmin.component.css'],
  standalone: true, // Définir le composant comme standalone
  imports: [CommonModule, NavbarComponent], // Inclure CommonModule et NavbarComponent
})
export class DepositedGamesAdminComponent implements OnInit {
  depositedGames: any[] = [];

  constructor(private depositedGameService: DepositedGameService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadDepositedGames();
  }

  // Charger les jeux déposés depuis le service
  loadDepositedGames(): void {
    this.depositedGameService.getAllDepositedGames().subscribe({
      next: (games) => {
        this.depositedGames = games;
      },
      error: (err) => console.error('Erreur lors du chargement des jeux déposés', err),
    });
  }

  // Basculer la disponibilité d'un jeu
  toggleAvailability(game: any): void {
    game.forSale = !game.forSale;
    this.depositedGameService.updateDepositedGame(game._id, { forSale: game.forSale }).subscribe({
      next: () => console.log('Disponibilité mise à jour avec succès'),
      error: (err) => console.error('Erreur lors de la mise à jour', err),
    });
  }
}
