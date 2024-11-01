// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component'; // Composant de connexion (à créer plus tard)

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route vers le composant de connexion
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirection par défaut
];
