// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ManagerDetailComponent } from './components/managerDetail/managerDetail.component'; // Assurez-vous que c'est bien importé

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'managerDetail', component: ManagerDetailComponent }, // Assurez-vous que cette route est correcte
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
