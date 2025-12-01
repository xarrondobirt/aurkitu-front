import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: false
})

// Componente personalizado y reutilizable que actúa como cabecera. Incluye el acceso a los mensajes del usuario
export class TopBarComponent  implements OnInit {
  // variable que guarda el número de mensajes pendientes, para mostrar una imagen u otra
  mensajesPendientes = 0;

  constructor() { }

  ngOnInit() {}

  // TODO - método para saber si hay mensajes pendientes
  getMensajesPendientes(){
    //llamar al servicio y obtener el número para guardarlo en la variable mensajes pendientes
  }
  goMensajes() {
    // TODO - llevar a la pagina de mensajes
    // this.router.navigate(['/login'])
  }
}
