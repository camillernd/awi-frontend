// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManagerDetailComponent } from './components/managerDetail/managerDetail.component';
import { HomeConnectedComponent } from './components/homeConnected/homeConnected.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SessionDetailComponent } from './components/sessionDetail/sessionDetail.component';
import { CreateSessionComponent } from './components/createSession/createSession.component';
import { DepositedGameComponent } from './components/depositedGames/depositedGames.component';
import { CreateDepositedGameComponent } from './components/createDepositedGame/createDepositedGame.component';
import { DepositedGameDetailComponent } from './components/depositedGameDetail/depositedGameDetail.component';
import { DepositedGamesAdminComponent } from './components/depositedGamesAdmin/depositedGamesAdmin.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'managerDetail', component: ManagerDetailComponent },
  { path: 'homeConnected', component: HomeConnectedComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'sessionDetail/:id', component: SessionDetailComponent },
  { path: 'createSession', component: CreateSessionComponent },
  { path: 'depositedGames', component: DepositedGameComponent },
  { path: 'createDepositedGame', component: CreateDepositedGameComponent },
  { path: 'depositedGameDetail/:id', component: DepositedGameDetailComponent },
  { path: 'depositedGamesAdmin', component: DepositedGamesAdminComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
