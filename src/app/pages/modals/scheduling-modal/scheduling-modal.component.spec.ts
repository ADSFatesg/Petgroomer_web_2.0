import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulingModalComponent } from './scheduling-modal.component';

describe('SchedulingModalComponent', () => {
  let component: SchedulingModalComponent;
  let fixture: ComponentFixture<SchedulingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
