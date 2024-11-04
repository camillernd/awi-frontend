import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepositedGameService } from '../../services/depositedGame.service';

@Component({
  selector: 'app-deposited-game-detail',
  templateUrl: './depositedGameDetail.component.html',
  styleUrls: ['./depositedGameDetail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DepositedGameDetailComponent implements OnInit {
  depositedGame: any;

  constructor(
    private route: ActivatedRoute,
    private depositedGameService: DepositedGameService
  ) {}

  ngOnInit(): void {
    const depositedGameId = this.route.snapshot.paramMap.get('id');
    if (depositedGameId) {
      this.depositedGameService.getDepositedGameById(depositedGameId).subscribe({
        next: (depositedGameData) => {
          console.log('DepositedGame récupéré :', depositedGameData);
          this.depositedGame = depositedGameData;
        },
        error: (error) => console.error('Erreur de récupération du depositedGame :', error),
      });
    }
  }
}
