import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.getSessions().subscribe({
      next: (sessionsData) => {
        console.log('Sessions récupérées :', sessionsData);
        this.sessions = sessionsData;
      },
      error: (error) => console.error('Erreur de récupération des sessions :', error),
    });
  }

  goToCreateSession(): void {
    this.router.navigate(['/createSession']);
  }

  goToSessionDetail(sessionId: string): void {
    this.router.navigate(['/sessionDetail', sessionId]);
  }
}
