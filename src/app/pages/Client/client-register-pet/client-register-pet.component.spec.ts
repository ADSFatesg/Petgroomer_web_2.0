import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRegisterPetComponent } from './client-register-pet.component';

describe('ClientRegisterPetComponent', () => {
  let component: ClientRegisterPetComponent;
  let fixture: ComponentFixture<ClientRegisterPetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientRegisterPetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientRegisterPetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
