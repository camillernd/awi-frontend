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

  createSeller(): void {
    this.sellerService.createSeller(this.newSeller).subscribe({
      next: (createdSeller) => {
        this.sellers.push(createdSeller);
        this.newSeller = { name: '', email: '', phone: '', amountOwed: 0 };
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Erreur lors de la création du vendeur', error);
        this.errorMessage = error?.error?.message || 'Erreur inconnue.';
      },
    });
  }

  viewSellerDetail(sellerId: string): void {
    this.router.navigate(['/sellerDetail', sellerId]);
  }
}
