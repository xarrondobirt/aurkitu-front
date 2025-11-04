import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegisterPage } from './userRegister.page';

describe('Tab1Page', () => {
  let component: UserRegisterPage;
  let fixture: ComponentFixture<UserRegisterPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(UserRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
