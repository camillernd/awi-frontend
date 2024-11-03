// src/app/components/sessionDetail/sessionDetail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import de CommonModule
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-session-detail',
  templateUrl: './sessionDetail.component.html',
  styleUrls: ['./sessionDetail.component.css'],
  standalone: true,
  imports: [CommonModule] // Ajout de CommonModule
})
export class SessionDetailComponent implements OnInit {
  session: any;

  constructor(private route: ActivatedRoute, private sessionService: SessionService) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.sessionService.getSessionById(sessionId).subscribe({
        next: (sessionData) => {
          console.log('Session récupérée :', sessionData);
          this.session = sessionData;
        },
        error: (error) => console.error('Erreur de récupération de la session :', error),
      });
    }
  }
}
