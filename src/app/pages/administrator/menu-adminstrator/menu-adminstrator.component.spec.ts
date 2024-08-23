import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAdminstratorComponent } from './menu-adminstrator.component';

describe('MenuAdminstratorComponent', () => {
  let component: MenuAdminstratorComponent;
  let fixture: ComponentFixture<MenuAdminstratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuAdminstratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuAdminstratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
