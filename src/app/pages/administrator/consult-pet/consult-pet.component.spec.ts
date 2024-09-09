import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultPetComponent } from './consult-pet.component';

describe('ConsultPetComponent', () => {
  let component: ConsultPetComponent;
  let fixture: ComponentFixture<ConsultPetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultPetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
