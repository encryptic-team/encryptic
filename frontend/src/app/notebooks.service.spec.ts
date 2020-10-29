import { TestBed } from '@angular/core/testing';

import { NotebooksService } from './notebooks.service';

describe('NotebooksService', () => {
  let service: NotebooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotebooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
