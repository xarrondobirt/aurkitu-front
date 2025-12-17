import { LogoutRequest, LogoutResponse } from './../../interfaces/users';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, of } from 'rxjs';
import { LogoutService } from 'src/app/services/logout-service';
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
  mensajesPendientes = 0;

  constructor(private router: Router, private servicioLogout: LogoutService, private tokenService: TokenService) { }

  ngOnInit() {}

  // TODO - método para saber si hay mensajes pendientes
  getMensajesPendientes(){
    //llamar al servicio y obtener el número para guardarlo en la variable mensajes pendientes
  }
  goConversaciones() {
    this.router.navigate(['/conversations']);
  }
  // método para cerrar sesión y llevar a la página de login
  async logout() {
    // obtener el accesstoken del storage
    let accessTokenStorage: string | null = this.tokenService.getAccessToken();

    console.log(accessTokenStorage);

    // cerrar sesión
    let request: LogoutRequest = {
      accessToken: accessTokenStorage
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
    this.deleteTokens();

    // llevar a la página de login
    this.router.navigate(['/login']);
  }
  // método para eliminar los tokens al hacer logout
  deleteTokens() {
    this.tokenService.deleteAccessToken();
    this.tokenService.deleteRefreshToken();
    this.tokenService.deleteSessionUsername();
  }

  // método que lleva a la página del menú
  goMenu() {
    this.router.navigate(['/menu']);
  }
}
