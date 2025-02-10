// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManagerDetailComponent } from './components/managerDetail/managerDetail.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { SessionDetailComponent } from './components/sessionDetail/sessionDetail.component';
import { CreateSessionComponent } from './components/createSession/createSession.component';
import { DepositedGameComponent } from './components/depositedGames/depositedGames.component';
import { CreateDepositedGameComponent } from './components/createDepositedGame/createDepositedGame.component';
import { DepositedGameDetailComponent } from './components/depositedGameDetail/depositedGameDetail.component';
import { DepositedGamesAdminComponent } from './components/depositedGamesAdmin/depositedGamesAdmin.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SellersComponent } from './components/sellers/sellers.component';
import { SellerDetailComponent } from './components/sellerDetail/sellerDetail.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientDetailComponent } from './components/clientDetail/clientDetail.component';
import { ManagersComponent } from './components/managers/managers.component';
import { AdminsComponent } from './components/admins/admins.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TreasuryComponent } from './components/treasury/treasury.component';
import { CreateGameDescriptionComponent } from './components/createGameDescription/createGameDescription.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'managerDetail/:id', component: ManagerDetailComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'sessionDetail/:id', component: SessionDetailComponent },
  { path: 'createSession', component: CreateSessionComponent },
  { path: 'depositedGames', component: DepositedGameComponent },
  { path: 'depositedGames/:sessionId', component: DepositedGameComponent },
  { path: 'createDepositedGame', component: CreateDepositedGameComponent },
  { path: 'depositedGameDetail/:id', component: DepositedGameDetailComponent },
  { path: 'depositedGamesAdmin', component: DepositedGamesAdminComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'sellers', component: SellersComponent},
  { path: 'sellerDetail/:id', component: SellerDetailComponent },
  { path: 'clients', component: ClientsComponent},
  { path: 'clientDetail/:id', component: ClientDetailComponent},
  { path: 'managers', component: ManagersComponent},
  { path: 'admins', component: AdminsComponent},
  { path: 'transactions', component: TransactionsComponent},
  { path: 'treasury', component: TreasuryComponent},
  { path: 'createGameDescription', component: CreateGameDescriptionComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
