import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioObjetosPage } from './inventario-objetos.page';

describe('InventarioObjetosPage', () => {
  let component: InventarioObjetosPage;
  let fixture: ComponentFixture<InventarioObjetosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioObjetosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
