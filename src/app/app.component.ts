// src/app/app.component.ts

import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [LoginComponent] // Ajoutez LoginComponent ici
})
export class AppComponent {}
