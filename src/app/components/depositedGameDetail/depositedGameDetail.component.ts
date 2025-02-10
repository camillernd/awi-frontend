import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepositedGameService } from '../../services/depositedGame.service';
import { SessionService } from '../../services/session.service'; // Import du service des sessions
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-deposited-game-detail',
  templateUrl: './depositedGameDetail.component.html',
  styleUrls: ['./depositedGameDetail.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class DepositedGameDetailComponent implements OnInit {
  depositedGame: any;
  sessionStatus: string = '';

  constructor(
    private route: ActivatedRoute,
    private depositedGameService: DepositedGameService,
    private sessionService: SessionService // Ajout du SessionService
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    const depositedGameId = this.route.snapshot.paramMap.get('id');
    
    if (depositedGameId) {
      this.depositedGameService.getDepositedGameById(depositedGameId).subscribe({
        next: (depositedGameData) => {
          console.log('DepositedGame récupéré :', depositedGameData);
          this.depositedGame = depositedGameData;

          if (depositedGameData.sessionId && depositedGameData.sessionId._id) {
            this.loadSessionDetails(depositedGameData.sessionId._id);
          }
        },
        error: (error) =>
          console.error('Erreur de récupération du depositedGame :', error),
      });
    }
  }

  loadSessionDetails(sessionId: string): void {
    this.sessionService.getSessionById(sessionId).subscribe({
      next: (sessionData) => {
        console.log('Session complète récupérée :', sessionData);
        this.sessionStatus = this.getSessionStatus(sessionData);
      },
      error: (error) =>
        console.error('Erreur de récupération de la session :', error),
    });
  }

  getSessionStatus(session: any): string {
    console.log('Calcul du statut de la session :', session);

    if (!session || !session.startDate || !session.endDate) {
      return 'Clôturée'; // Valeur par défaut en cas de données incomplètes
    }

    const now = new Date();
    const startDate = new Date(session.startDate);
    const endDate = new Date(session.endDate);

    console.log(`Comparaison des dates :
      Now : ${now.toISOString()}
      StartDate : ${startDate.toISOString()}
      EndDate : ${endDate.toISOString()}
    `);

    if (now >= startDate && now <= endDate) {
      return 'En cours';
    }
    if (now < startDate) {
      return 'À venir';
    }
    return 'Clôturée';
  }
}
