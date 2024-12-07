import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepositedGameService } from '../../services/depositedGame.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-depositedGames',
  templateUrl: './depositedGames.component.html',
  styleUrls: ['./depositedGames.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class DepositedGameComponent implements OnInit {
  depositedGames: any[] = [];
  sessionId: string = ''; // Utilisation de l'identifiant de la session

  constructor(
    private depositedGameService: DepositedGameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
  
    // Récupérer l'identifiant de la session depuis la route
    this.route.paramMap.subscribe((params) => {
      this.sessionId = params.get('sessionId') || '';
      if (this.sessionId) {
        this.loadDepositedGamesForSession();
      } else {
        this.loadAllDepositedGames(); // Charger tous les jeux si aucun sessionId
      }
    });
  }
  
  loadAllDepositedGames(): void {
    this.depositedGameService.getDepositedGames().subscribe({
      next: (depositedGamesData) => {
        console.log('Tous les jeux déposés récupérés :', depositedGamesData);
        this.depositedGames = depositedGamesData;
      },
      error: (error) =>
        console.error('Erreur lors de la récupération de tous les jeux déposés :', error),
    });
  }

  loadDepositedGamesForSession(): void {
    this.depositedGameService.getDepositedGamesBySessionId(this.sessionId).subscribe({
      next: (depositedGamesData) => {
        console.log('Jeux déposés récupérés pour la session :', depositedGamesData);
        this.depositedGames = depositedGamesData;
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des jeux déposés :', error),
    });
  }

  goToDepositedGameDetail(depositedGameId: string): void {
    this.router.navigate(['/depositedGameDetail', depositedGameId]);
  }
}
