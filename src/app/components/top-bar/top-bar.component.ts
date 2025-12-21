import { ConversacionResponse, MensajesRequest } from './../../interfaces/messages';
import { LogoutRequest, LogoutResponse } from './../../interfaces/users';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { LogoutService } from 'src/app/services/logout-service';
import { MensajesService } from 'src/app/services/mensajes-service';
import { TokenService } from 'src/app/services/token-service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: false
})

// Componente personalizado y reutilizable que actúa como cabecera. Incluye el acceso a los mensajes del usuario, logout y menú 
export class TopBarComponent  implements OnInit {
  // variable que guarda el número de mensajes pendientes, para mostrar una imagen u otra
  mensajesPendientes: boolean = true;
   // tokens en storage
   tokensLocal: any;
  listaConversacionesPdtes: ConversacionResponse[] = [];

  constructor(private router: Router, private servicioLogout: LogoutService, private tokenService: TokenService, private mensajesService: MensajesService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // obtener el accesstoken del storage
    this.tokensLocal = this.authenticationService.getTokensLocal();

    console.log(this.tokensLocal.accessToken);
  }

  // TODO - método para saber si hay mensajes pendientes
  getMensajesPendientes(){
    // obtener si hay conversaciones con mensajes pdtes de leer por el remitente

    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };
    // llamada al servicio 
    this.mensajesService.getConversaciones(request).subscribe({
      next: (conver) => {
        this.listaConversacionesPdtes = conver;
        this.mensajesPendientes = this.listaConversacionesPdtes.some(u => u.mensajesSinLeer == true);
        console.log('Conversaciones recibidas:', conver);
      },
      error: (err) => {
        console.error('Error al obtener conversaciones', err);

        if(err.error.message =='Sesión caducada'){
          // refrescar el token
          this.authenticationService.refrescarToken(this.tokensLocal);
          // volvemos a obtener las conversaciones con el token refrescado
          this.getMensajesPendientes();
        }
      }
    });
  }

  
  goConversaciones() {
    this.router.navigate(['/conversations']);
  }
  // método para cerrar sesión y llevar a la página de login
  async logout() {

    // cerrar sesión
    let request: LogoutRequest = {
      accessToken: this.tokensLocal.accessToken
    };

    console.log(request);

    const response = await firstValueFrom(
      this.servicioLogout.logout(request).pipe(
        catchError(error => {
          console.error(error);
          return of(null); 
        })
      )
    );

    // delete access token y refresh token 
    this.authenticationService.deleteTokens();

    // llevar a la página de login
    this.router.navigate(['/login']);
  }

  // método que lleva a la página del menú
  goMenu() {
    this.router.navigate(['/menu']);
  }
}
