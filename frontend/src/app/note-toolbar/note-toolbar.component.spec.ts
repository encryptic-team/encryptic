import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteToolbarComponent } from './note-toolbar.component';

describe('NoteToolbarComponent', () => {
  let component: NoteToolbarComponent;
  let fixture: ComponentFixture<NoteToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
