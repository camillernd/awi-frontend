import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGameDescriptionComponent } from './createGameDescription.component';

describe('CreateGameDescriptionComponent', () => {
  let component: CreateGameDescriptionComponent;
  let fixture: ComponentFixture<CreateGameDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGameDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGameDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
