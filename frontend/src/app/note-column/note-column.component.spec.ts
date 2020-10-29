import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteColumnComponent } from './note-column.component';

describe('NoteColumnComponent', () => {
  let component: NoteColumnComponent;
  let fixture: ComponentFixture<NoteColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
