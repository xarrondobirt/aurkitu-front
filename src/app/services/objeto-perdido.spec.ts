import { TestBed } from '@angular/core/testing';

import { ObjetoPerdido } from './objeto-perdido';

describe('ObjetoPerdido', () => {
  let service: ObjetoPerdido;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetoPerdido);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
