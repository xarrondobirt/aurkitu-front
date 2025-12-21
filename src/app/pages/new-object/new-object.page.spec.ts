import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewObjectPage } from './new-object.page';

describe('NewObjectPage', () => {
  let component: NewObjectPage;
  let fixture: ComponentFixture<NewObjectPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
