import { TestBed } from '@angular/core/testing';

import { DataFlagService } from './data-flag.service';

describe('DataFlagService', () => {
  let service: DataFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFlagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
