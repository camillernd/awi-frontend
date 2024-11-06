import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log('Formulaire soumis', this.loginForm.value); // Ajout de cette ligne
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Connexion réussie, réponse :', response);
  
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('managerId', response.managerId);
  
          this.router.navigate(['/homeConnected']).then(
            (success) => console.log('Navigation vers /homeConnected réussie :', success),
            (error) => console.error('Erreur de navigation :', error)
          );
        },
        error: (err) => {
          console.error('Erreur de connexion :', err); // Ajout d'un log pour l'erreur
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      });
    }
  }
  
}
