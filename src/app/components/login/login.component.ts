// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import du Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router  // Injection du Router pour la redirection
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Connexion réussie, réponse :', response);
  
          // Redirection avec vérification de succès/échec
          this.router.navigate(['/managerDetail']).then(
            (success) => console.log('Navigation vers /managerDetail réussie :', success),
            (error) => console.error('Erreur de navigation :', error)
          );
        },
        error: (error) => {
          console.error('Erreur de connexion, détail :', error);
          this.errorMessage = 'Invalid email or password';
        }
      });
    } else {
      console.log('Formulaire invalide');
    }
  }
}
