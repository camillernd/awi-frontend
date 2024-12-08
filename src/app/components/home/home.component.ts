// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component'; // Import de la Navbar
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent] // Assure-toi d'importer CommonModule
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSession: any = null; // La session actuellement en cours
  nextSession: any = null; // La prochaine session
  formattedCountdown: string = ''; // Texte du compte à rebours
  countdownInterval: any; // Intervalle pour le compte à rebours

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.loadSessions();
  }

  ngOnDestroy(): void {
    // Nettoyer l'intervalle en quittant la page
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        const now = new Date();

        // Vérifier si une session est en cours
        this.currentSession = sessions.find((session) => {
          const startDate = new Date(session.startDate);
          const endDate = new Date(session.endDate);
          return now >= startDate && now <= endDate;
        });

        // Vérifier la prochaine session (après la date actuelle)
        const upcomingSessions = sessions
          .filter((session) => new Date(session.startDate) > now)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        this.nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

        // Si une prochaine session est trouvée, démarrer le compte à rebours
        if (this.nextSession) {
          this.startCountdown(new Date(this.nextSession.startDate));
        }
      },
      error: (err) => console.error('Erreur lors du chargement des sessions', err),
    });
  }

  startCountdown(targetDate: Date): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = targetDate.getTime() - now;
  
      if (timeLeft <= 0) {
        clearInterval(this.countdownInterval);
        this.formattedCountdown = '00:00:00:00';
        return;
      }
  
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
      this.formattedCountdown = `${days.toString().padStart(2, '0')}j ${hours
        .toString()
        .padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds
        .toString()
        .padStart(2, '0')}s`;
    }, 1000);
  }
  
}
