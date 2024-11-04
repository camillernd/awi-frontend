import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepositedGameService } from '../../services/depositedGame.service';

@Component({
  selector: 'app-depositedGames',
  templateUrl: './depositedGames.component.html',
  styleUrls: ['./depositedGames.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DepositedGameComponent implements OnInit {
    depositedGames: any[] = [];

  constructor(private depositedGameService: DepositedGameService, private router: Router) {}

  ngOnInit(): void {
    this.depositedGameService.getDepositedGames().subscribe({
      next: (depositedGamesData) => {
        console.log('DepositedGames récupérées :', depositedGamesData); // Log pour confirmer les données
        this.depositedGames = depositedGamesData;
      },
      error: (error) => console.error('Erreur de récupération des depositedGames :', error),
    });
  }
  goToCreateDepositedGame(): void {
    this.router.navigate(['/createDepositedGame']);
  }

  goToDepositedGameDetail(depositedGameId: string): void {
    this.router.navigate(['/depositedGameDetail', depositedGameId]);
  }
}
