import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDirViewComponent } from './menu-dir-view.component';

describe('MenuDirViewComponent', () => {
  let component: MenuDirViewComponent;
  let fixture: ComponentFixture<MenuDirViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuDirViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDirViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
