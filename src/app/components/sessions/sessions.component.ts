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
  admin: boolean = false; // À remplacer par la vraie vérification d'admin
  sessionToDelete: { id: string, status: string } | null = null; // Stocke la session à supprimer
  showModal: boolean = false; // Affichage du modal
  successMessage: string | null = null; // Message de succès temporaire

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.loadSessions();
    this.checkAdminStatus();
  }

  loadSessions(): void {
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
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

  checkAdminStatus(): void {
    // Exemple : récupère l'état admin depuis un service d'authentification
    this.admin = localStorage.getItem('isAdmin') === 'true'; // Assurez-vous que ça renvoie bien 'true' ou 'false'
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
      return 'ouverte';
    } else if (now < startDate) {
      return 'aVenir';
    } else {
      return 'cloturee';
    }
  }

  goToSessionDetail(sessionId: string): void {
    this.router.navigate(['/sessionDetail', sessionId]);
  }

  goToDepositedGames(sessionId: string): void {
    this.router.navigate([`/depositedGames/${sessionId}`]);
  }

  openDeleteModal(sessionId: string, status: string): void {
    if (status !== 'aVenir') {
      alert("❌ Impossible de supprimer une session déjà commencée ou clôturée.");
      return;
    }
    
    this.sessionToDelete = { id: sessionId, status };
    this.showModal = true; // Affiche le modal
  }

  closeModal(): void {
    this.showModal = false;
    this.sessionToDelete = null;
  }

  confirmDeleteSession(): void {
    if (!this.sessionToDelete) return;
  
    this.sessionService.hasDepositedGames(this.sessionToDelete.id).subscribe({
      next: (hasGames) => {
        if (hasGames) {
          alert("❌ Impossible de supprimer cette session car des jeux y sont déposés.");
        } else {
          this.sessionService.deleteSession(this.sessionToDelete!.id).subscribe({
            next: () => {
              this.successMessage = "Session supprimée avec succès.";
              this.loadSessions();
              this.closeModal();
  
              // Efface le message après 3 secondes
              setTimeout(() => {
                this.successMessage = null;
              }, 3000);
            },
            error: (err) => console.error("Erreur lors de la suppression", err),
          });
        }
      },
      error: (err) => console.error("Erreur lors de la vérification des jeux déposés", err),
    });
  }
  
}
