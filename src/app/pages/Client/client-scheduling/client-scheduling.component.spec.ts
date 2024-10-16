import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSchedulingComponent } from './client-scheduling.component';

describe('ClientSchedulingComponent', () => {
  let component: ClientSchedulingComponent;
  let fixture: ComponentFixture<ClientSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientSchedulingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
