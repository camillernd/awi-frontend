// src/app/components/accueil/accueil.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  standalone: true,
  imports: [CommonModule] // Assure-toi d'importer CommonModule
})
export class AccueilComponent {
    constructor(private router: Router) {
      console.log('AccueilComponent est chargé');
    }
  
    navigateToLogin() {
      this.router.navigate(['/login']);
    }
  }
