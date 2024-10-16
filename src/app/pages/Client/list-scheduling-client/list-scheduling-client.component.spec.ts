import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSchedulingClientComponent } from './list-scheduling-client.component';

describe('ListSchedulingClientComponent', () => {
  let component: ListSchedulingClientComponent;
  let fixture: ComponentFixture<ListSchedulingClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSchedulingClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSchedulingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
