//src/app/components/sessions/sessions.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadSessions();
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        // Ajouter le tri des sessions par date décroissante
        this.sessions = sessions
          .map((session) => ({
            ...session,
            formattedStartDate: this.formatDate(session.startDate),
            formattedStartTime: this.formatTime(session.startDate),
            formattedEndDate: this.formatDate(session.endDate),
            formattedEndTime: this.formatTime(session.endDate),
            status: this.getSessionStatus(session),
          }))
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });
  }
  

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getSessionStatus(session: any): string {
    const now = new Date();
    const startDate = new Date(session.startDate);
    const endDate = new Date(session.endDate);

    if (now >= startDate && now <= endDate) {
      return 'ouverte'; // Session en cours
    } else if (now < startDate) {
      return 'aVenir'; // Session à venir
    } else {
      return 'cloturee'; // Session clôturée
    }
  }

  goToSessionDetail(sessionId: string): void {
    this.router.navigate(['/sessionDetail', sessionId]);
  }

  goToDepositedGames(sessionId: string): void {
    this.router.navigate([`/depositedGames/${sessionId}`]); // Navigue avec l'identifiant
  }

  goToSessionReport(sessionId: string): void {
    this.router.navigate([`/session/${sessionId}/report`]);
  }
}
