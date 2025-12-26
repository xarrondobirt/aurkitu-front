import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PruebaFileSelectorPage } from './prueba-file-selector.page';

describe('PruebaFileSelectorPage', () => {
  let component: PruebaFileSelectorPage;
  let fixture: ComponentFixture<PruebaFileSelectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaFileSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
