import { TestBed } from '@angular/core/testing';

import { RegistroUsuarioService } from './registro-usuario-service';

describe('RegistroUsuarioService', () => {
  let service: RegistroUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
