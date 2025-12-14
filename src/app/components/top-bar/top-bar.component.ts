import { LogoutRequest, LogoutResponse } from './../../interfaces/users';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LogoutService } from 'src/app/services/logout-service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: false
})

// Componente personalizado y reutilizable que actúa como cabecera. Incluye el acceso a los mensajes del usuario, logout y menú 
export class TopBarComponent  implements OnInit {
  // variable que guarda el número de mensajes pendientes, para mostrar una imagen u otra
  mensajesPendientes = 0;

  constructor(private router: Router, private servicioLogout: LogoutService) { }

  ngOnInit() {}

  // TODO - método para saber si hay mensajes pendientes
  getMensajesPendientes(){
    //llamar al servicio y obtener el número para guardarlo en la variable mensajes pendientes
  }
  goMensajes() {
    // TODO - llevar a la pagina de conversaciones si hay mensajes pendientes
    this.router.navigate(['/conversations']);
  }
  // método para cerrar sesión y llevar a la página de login
  async logout() {
    // TODO - cerrar sesión + storage
      // obtener el accesstoken del storage --> generar metodo
      let accessTokenStorage: string = '';

      // cerrar sesión
      let request: LogoutRequest = {
        accessToken: accessTokenStorage
      } 

      console.log(request);

      // TODO - PROBAR JUNTO CON EL LOGIN
      const response = await firstValueFrom(
        this.servicioLogout.logout(request)
      );

      // delete refresh token --> ¿generar metodo?

    // llevar a la página de login
    this.router.navigate(['/login']);
  }

  // método que lleva a la página del menú
  goMenu() {
    this.router.navigate(['/menu']);
  }
}
