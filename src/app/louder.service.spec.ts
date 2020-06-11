import { TestBed } from '@angular/core/testing';

import { LouderService } from './louder.service';

describe('LouderService', () => {
  let service: LouderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LouderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
