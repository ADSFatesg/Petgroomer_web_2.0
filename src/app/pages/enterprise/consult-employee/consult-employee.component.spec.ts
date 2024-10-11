import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultEmployeeComponent } from './consult-employee.component';

describe('ConsultEmployeeComponent', () => {
  let component: ConsultEmployeeComponent;
  let fixture: ComponentFixture<ConsultEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
