import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-create-session',
  templateUrl: './createSession.component.html',
  styleUrls: ['./createSession.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent]
})
export class CreateSessionComponent implements OnInit {
  sessionData = {
    name: '',
    location: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    depositFee: 0,
    depositFeeLimitBeforeDiscount: 3,
    depositFeeDiscount: 0,
    saleComission: 0,
    managerId: ''
  };

  firstName: string | null = null;
  lastName: string | null = null;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.sessionData.managerId = localStorage.getItem('managerId') || '';

    console.log('Manager connecté après récupération dans ngOnInit:', {
      firstName: this.firstName,
      lastName: this.lastName,
      managerId: this.sessionData.managerId
    });
  }

  createSession() {
    // Combine la date et l'heure pour créer des dates ISO complètes
    const startDate = `${this.sessionData.startDate}T${this.sessionData.startTime || '00:00'}:00.000Z`;
    const endDate = `${this.sessionData.endDate}T${this.sessionData.endTime || '23:59'}:00.000Z`;

    // Remplace les champs startDate et endDate par les dates ISO
    const formattedSessionData = {
      ...this.sessionData,
      startDate,
      endDate
    };

    console.log('Données envoyées au backend:', formattedSessionData);

    // Envoie des données au service
    this.sessionService.createSession(formattedSessionData).subscribe({
      next: () => {
        console.log('Session créée avec succès');
        this.router.navigate(['/sessions']);
      },
      error: (error) => console.error('Erreur lors de la création de la session', error),
    });
  }
}
