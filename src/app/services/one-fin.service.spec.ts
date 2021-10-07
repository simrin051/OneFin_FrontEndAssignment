import { TestBed } from '@angular/core/testing';

import { OneFinService } from './one-fin.service';

describe('OneFinService', () => {
  let service: OneFinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OneFinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
