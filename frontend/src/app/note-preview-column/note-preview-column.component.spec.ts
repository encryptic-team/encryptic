import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePreviewColumnComponent } from './note-preview-column.component';

describe('NotePreviewColumnComponent', () => {
  let component: NotePreviewColumnComponent;
  let fixture: ComponentFixture<NotePreviewColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotePreviewColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotePreviewColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
