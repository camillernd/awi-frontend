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
  imports: [FormsModule, CommonModule, NavbarComponent],
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
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    document.body.style.overflow = 'visible';
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.sessionData.managerId = localStorage.getItem('managerId') || '';
  }

  validateSessionData(): boolean {
    // Vérification des champs obligatoires (sauf description)
    if (!this.sessionData.name || !this.sessionData.location || 
        !this.sessionData.startDate || !this.sessionData.endDate || 
        this.sessionData.depositFee === null || this.sessionData.saleComission === null) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return false;
    }

    // Vérification des valeurs numériques positives
    if (this.sessionData.depositFee < 0 || 
        this.sessionData.depositFeeLimitBeforeDiscount < 0 ||
        this.sessionData.depositFeeDiscount < 0 || 
        this.sessionData.saleComission < 0) {
      this.errorMessage = 'Toutes les valeurs numériques doivent être positives.';
      return false;
    }

    // Vérification que la date de début est bien avant la date de fin
    const startDateTime = new Date(`${this.sessionData.startDate}T${this.sessionData.startTime || '00:00'}:00.000Z`);
    const endDateTime = new Date(`${this.sessionData.endDate}T${this.sessionData.endTime || '23:59'}:00.000Z`);
    
    if (startDateTime >= endDateTime) {
      this.errorMessage = 'La date de début doit être antérieure à la date de fin.';
      return false;
    }

    return true;
  }

  createSession() {
    if (!this.validateSessionData()) {
      return; // Arrête la création si la validation échoue
    }

    // Formater les dates avant envoi
    const formattedSessionData = {
      ...this.sessionData,
      startDate: `${this.sessionData.startDate}T${this.sessionData.startTime || '00:00'}:00.000Z`,
      endDate: `${this.sessionData.endDate}T${this.sessionData.endTime || '23:59'}:00.000Z`
    };

    console.log('Données envoyées au backend:', formattedSessionData);

    this.sessionService.createSession(formattedSessionData).subscribe({
      next: () => {
        this.successMessage = 'La session a été créée avec succès ! Redirection en cours...';
        this.errorMessage = null;
        setTimeout(() => {
          this.router.navigate(['/sessions']);
        }, 3000); // Redirection après 3 secondes
      },
      error: (error) => {
        console.error('Erreur lors de la création de la session', error);
        this.successMessage = null;
        this.errorMessage = 'Erreur lors de la création de la session. Veuillez vérifier vos données.';
      },
    });
  }
}
