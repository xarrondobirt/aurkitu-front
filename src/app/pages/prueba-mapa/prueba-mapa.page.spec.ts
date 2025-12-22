import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PruebaMapaPage } from './prueba-mapa.page';

describe('PruebaMapaPage', () => {
  let component: PruebaMapaPage;
  let fixture: ComponentFixture<PruebaMapaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebaMapaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
