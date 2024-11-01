// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { LoginComponent } from './components/login/login.component';
import { ManagerDetailComponent } from './components/managerDetail/managerDetail.component';

export const routes: Routes = [
  { path: 'accueil', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'managerDetail', component: ManagerDetailComponent },
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
];
