import { TestBed } from '@angular/core/testing';

import { LoginUsuario } from './login-usuario';

describe('LoginUsuario', () => {
  let service: LoginUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
