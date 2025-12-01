import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
  standalone: false,
})

// Página para el menu. Se muestran las 2 opciones disponibles: registro de objeto perdido y listado de objetos perdidos
export class MenuPage {
  // alias del usuario, pendiente de definir modo de almacenamiento de los datos del usuario
  alias='Prueba';

  constructor() {}

  // TODO - método que llevará a la página del registro de un nuevo objeto perdido
  goLostRegister() {
    // TODO - Ir a registro de objetos perdidos
    // this.router.navigate(['/login']);
  }

  // TODO - método que llevará a la página del catálogo de objetos perdidos registrados
  goLostCatalog() {
    // TODO - Ir a objetos perdidos
    // this.router.navigate(['/login']);
  }
}
