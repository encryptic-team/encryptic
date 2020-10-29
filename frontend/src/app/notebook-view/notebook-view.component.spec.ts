import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookViewComponent } from './notebook-view.component';

describe('NotebookViewComponent', () => {
  let component: NotebookViewComponent;
  let fixture: ComponentFixture<NotebookViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotebookViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
