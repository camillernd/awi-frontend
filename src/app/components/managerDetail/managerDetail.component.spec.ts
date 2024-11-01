import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManagerDetailComponent } from './managerDetail.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs'; // Ajout de l'import de 'of' depuis rxjs

describe('ManagerDetailComponent', () => {
  let component: ManagerDetailComponent;
  let fixture: ComponentFixture<ManagerDetailComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerDetailComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDetailComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch manager profile on init', () => {
    const mockManager = {
      firstName: 'Sarah',
      lastName: 'El Manssouri',
      email: 'sarah@gmail.com',
      phone: '0123456789',
      address: '7 rue du Thé',
      admin: true,
    };

    spyOn(authService, 'getManagerProfile').and.returnValue(of(mockManager));
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(component.manager).toEqual(mockManager);
  });
});
