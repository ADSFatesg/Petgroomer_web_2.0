import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComissionComponent } from './report-comission.component';

describe('ReportComponent', () => {
  let component: ReportComissionComponent;
  let fixture: ComponentFixture<ReportComissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportComissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportComissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
