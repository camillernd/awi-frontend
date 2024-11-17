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
  imports: [CommonModule, NavbarComponent]
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.sessionService.getSessions().subscribe({
      next: (sessionsData) => {
        console.log('Sessions récupérées :', sessionsData);
        this.sessions = sessionsData;
      },
      error: (error) => console.error('Erreur de récupération des sessions :', error),
    });
  }

  ngOnDestroy(): void {
    // Réinitialiser overflow à 'hidden' quand le composant est détruit
    document.body.style.overflow = 'hidden';
  }

  goToSessionDetail(sessionId: string): void {
    this.router.navigate(['/sessionDetail', sessionId]);
  }
}
