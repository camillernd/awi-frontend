// src/app/components/managerDetail/managerDetail.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './managerDetail.component.html',
  styleUrls: ['./managerDetail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManagerDetailComponent {
  constructor() {
    console.log('ManagerDetailComponent est chargé.');
  }
}
