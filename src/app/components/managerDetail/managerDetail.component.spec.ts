// src/app/components/managerDetail/managerDetail.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerDetailComponent } from './managerDetail.component';

describe('ManagerDetailComponent', () => {
  let component: ManagerDetailComponent;
  let fixture: ComponentFixture<ManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerDetailComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
