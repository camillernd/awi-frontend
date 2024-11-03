import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-create-session',
  templateUrl: './createSession.component.html',
  styleUrls: ['./createSession.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CreateSessionComponent implements OnInit {
  sessionData = {
    name: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    depositFee: 0,
    depositFeeLimitBeforeDiscount: 30,
    depositFeeDiscount: 0,
    saleComission: 0,
    managerId: ''
  };

  firstName: string | null = null;
  lastName: string | null = null;

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
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
    console.log('Données de la session à créer avec manager:', this.sessionData);

    // Envoi de la requête de création de session
    this.sessionService.createSession(this.sessionData).subscribe({
      next: () => {
        console.log('Session créée avec succès');
        this.router.navigate(['/sessions']);
      },
      error: (error) => console.error('Erreur lors de la création de la session', error),
    });
  }
}
