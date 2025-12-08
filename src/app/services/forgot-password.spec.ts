import { TestBed } from '@angular/core/testing';

import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  let service: ForgotPassword;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgotPassword);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
