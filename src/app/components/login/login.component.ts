import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    private router: Router
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

          // Enregistrez le token et le managerId dans localStorage
          localStorage.setItem('authToken', response.token); // Sauvegarder le token JWT
          localStorage.setItem('managerId', response.managerId); // Sauvegarder l'ID du manager

          this.router.navigate(['/homeConnected']).then(
            (success) => console.log('Navigation vers /homeConnected réussie :', success),
            (error) => console.error('Erreur de navigation :', error)
          );
        },
        error: () => {
          this.errorMessage = 'Invalid email or password';
        }
      });
    }
  }
}
