import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteDataColumnComponent } from './note-data-column.component';

describe('NoteDataColumnComponent', () => {
  let component: NoteDataColumnComponent;
  let fixture: ComponentFixture<NoteDataColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteDataColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteDataColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
