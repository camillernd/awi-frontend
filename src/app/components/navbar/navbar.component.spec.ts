// src/components/navbar/navbar.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(async () => {
    authServiceStub = {
      getToken: () => 'fake-token',
      isManagerConnected: () => true
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ajout pour ignorer les erreurs liées à 'app-navbar'
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Ajoutez d'autres tests si nécessaire
});
