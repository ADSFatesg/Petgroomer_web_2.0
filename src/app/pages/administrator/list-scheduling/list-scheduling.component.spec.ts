import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchedulingComponent } from './list-scheduling.component';

describe('ListSchedulingComponent', () => {
  let component: ListSchedulingComponent;
  let fixture: ComponentFixture<ListSchedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSchedulingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSchedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
