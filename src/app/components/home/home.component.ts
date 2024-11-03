// src/app/components/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule] // Assure-toi d'importer CommonModule
})
export class HomeComponent {
    constructor(private router: Router) {
      console.log('HomeComponent est chargé');
    }
  
    navigateToLogin() {
      this.router.navigate(['/login']);
    }
  }
