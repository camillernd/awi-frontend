import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
})
export class SellersComponent implements OnInit {
  sellers: any[] = [];
  newSeller = {
    name: '',
    email: '',
    phone: '',
    amountOwed: 0,
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.loadSellers();
    document.body.style.overflow = 'visible';
  }

  loadSellers(): void {
    this.sellerService.getAllSellers().subscribe({
      next: (sellers) => (this.sellers = sellers),
      error: (error) => {
        console.error('Erreur lors du chargement des vendeurs', error);
        this.errorMessage = 'Impossible de charger les vendeurs.';
      },
    });
  }

  validatePhoneNumber(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone);
  }

  createSeller(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.newSeller.name || !this.newSeller.email || !this.newSeller.phone) {
      this.errorMessage = "Tous les champs sont obligatoires.";
      return;
    }

    if (!this.validatePhoneNumber(this.newSeller.phone)) {
      this.errorMessage = "Le numéro de téléphone doit contenir exactement 10 chiffres.";
      return;
    }

    const emailExists = this.sellers.some(seller => seller.email === this.newSeller.email);
    if (emailExists) {
      this.errorMessage = "Cet email est déjà utilisé.";
      return;
    }

    this.sellerService.createSeller(this.newSeller).subscribe({
      next: (createdSeller) => {
        this.sellers.push(createdSeller);
        this.newSeller = { name: '', email: '', phone: '', amountOwed: 0 };
        this.successMessage = "Vendeur créé avec succès.";

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la création du vendeur', error);
        this.errorMessage = error?.error?.message || 'Une erreur inconnue est survenue.';
      },
    });
  }

  viewSellerDetail(sellerId: string): void {
    this.router.navigate(['/sellerDetail', sellerId]);
  }
}
