import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepositedGameService } from '../../services/depositedGame.service';
import { SessionService } from '../../services/session.service'; // Ajout du service des sessions
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-depositedGames',
  templateUrl: './depositedGames.component.html',
  styleUrls: ['./depositedGames.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
})
export class DepositedGameComponent implements OnInit {
  depositedGames: any[] = [];
  filteredGames: any[] = [];
  sessions: any[] = [];
  sessionId: string = '';
  searchQuery: string = '';
  selectedSession: string = 'all';
  selectedSort: string = 'recent';
  isFromSessionPage: boolean = false;

  constructor(
    private depositedGameService: DepositedGameService,
    private sessionService: SessionService, // Ajout du SessionService
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';

    this.route.paramMap.subscribe((params) => {
      this.sessionId = params.get('sessionId') || '';
      this.isFromSessionPage = !!this.sessionId;

      if (this.sessionId) {
        this.loadDepositedGamesForSession();
      } else {
        this.loadAllDepositedGames();
        this.loadSessions(); // Nouvelle méthode pour récupérer les sessions
      }
    });
  }

  loadAllDepositedGames(): void {
    this.depositedGameService.getDepositedGames().subscribe({
      next: (depositedGamesData) => {
        console.log('Tous les jeux déposés récupérés :', depositedGamesData);
        this.depositedGames = depositedGamesData;
        this.applyFilters();
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des jeux déposés :', error),
    });
  }

  loadDepositedGamesForSession(): void {
    this.depositedGameService.getDepositedGamesBySessionId(this.sessionId).subscribe({
      next: (depositedGamesData) => {
        console.log('Jeux déposés récupérés pour la session :', depositedGamesData);
        this.depositedGames = depositedGamesData;
        this.applyFilters();
      },
      error: (error) =>
        console.error('Erreur lors de la récupération des jeux déposés :', error),
    });
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions.map((session) => ({
          ...session,
          status: this.getSessionStatus(session),
        }));
        console.log('Sessions récupérées :', this.sessions);
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });
  }

  getSessionStatus(session: any): string {
    if (!session || !session.startDate || !session.endDate) {
      return 'Clôturée'; // Valeur de secours en cas de données incomplètes
    }

    const now = new Date();
    const startDate = new Date(session.startDate);
    const endDate = new Date(session.endDate);

    if (now >= startDate && now <= endDate) {
      return 'En cours';
    }
    if (now < startDate) {
      return 'À venir';
    }
    return 'Clôturée';
  }

  applyFilters(): void {
    let filtered = [...this.depositedGames];

    // Filtrage par recherche
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter((game) =>
        game.gameDescriptionId.name.toLowerCase().includes(query)
      );
    }

    // Filtrage par session (si on est sur la page générale)
    if (!this.isFromSessionPage && this.selectedSession !== 'all') {
      filtered = filtered.filter((game) => game.sessionId._id === this.selectedSession);
    }

    // Tri par prix ou date
    if (this.selectedSort === 'priceAsc') {
      filtered.sort((a, b) => a.salePrice - b.salePrice);
    } else if (this.selectedSort === 'priceDesc') {
      filtered.sort((a, b) => b.salePrice - a.salePrice);
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.sessionId.startDate).getTime() - new Date(a.sessionId.startDate).getTime()
      );
    }

    this.filteredGames = filtered;
  }

  goToDepositedGameDetail(depositedGameId: string): void {
    this.router.navigate(['/depositedGameDetail', depositedGameId]);
  }
}
