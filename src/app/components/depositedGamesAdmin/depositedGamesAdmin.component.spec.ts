import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepositedGamesAdminComponent } from './depositedGamesAdmin.component';

describe('DepositedGamesAdminComponent', () => {
  let component: DepositedGamesAdminComponent;
  let fixture: ComponentFixture<DepositedGamesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositedGamesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositedGamesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
