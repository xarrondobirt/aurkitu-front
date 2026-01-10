import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token-service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss'],
  standalone: false,
})

// Página para el menu. Se muestran las 2 opciones disponibles: registro de objeto perdido y listado de objetos perdidos
export class MenuPage implements OnInit{
  // alias del usuario
  alias: string | null ='';

  constructor(private tokenService: TokenService, private ruta: Router) {}
  ngOnInit(){
    // obtener el username del storage
    this.alias = this.tokenService.getSessionUsername();
  }

  // método que llevará a la página del registro de un nuevo objeto perdido
  goLostRegister() {
    // Ir a registro de objetos perdidos
    this.ruta.navigate(['/new-object']);
  }

  // método que llevará a la página del catálogo de objetos perdidos registrados
  goLostCatalog() {
    // Ir a objetos perdidos
    this.ruta.navigate(['/inventario-objetos']);
  }
}
