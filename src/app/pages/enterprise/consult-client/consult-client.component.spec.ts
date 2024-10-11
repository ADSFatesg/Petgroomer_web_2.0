import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultClientComponent } from './consult-client.component';

describe('ConsultClientComponent', () => {
  let component: ConsultClientComponent;
  let fixture: ComponentFixture<ConsultClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
