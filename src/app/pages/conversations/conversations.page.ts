import { ConversacionResponse, SesionDTO } from '../../interfaces/messages';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MensajesRequest } from 'src/app/interfaces/messages';
import { RefreshTokenRequest, SetLoginResponse } from 'src/app/interfaces/users';
import { LoginUsuario } from 'src/app/services/login-usuario';
import { MensajesService } from 'src/app/services/mensajes-service';
import { TokenService } from 'src/app/services/token-service';

@Component({
  selector: 'app-conversations',
  templateUrl: 'conversations.page.html',
  styleUrls: ['conversations.page.scss'],
  standalone: false,
})
// página para mostrar las conversaciones del usuario
export class ConversationsPage implements OnInit {
  // listado de conversaciones para mostrarlas
  listaConversaciones: ConversacionResponse[] = [];
  // tokens en storage
  accessTokenLocal: string | null ='';
  refreshTokenLocal: string | null = '';

  constructor(private mensajesService: MensajesService, private router: Router, private tokenService: TokenService, private loginService: LoginUsuario) {}

  // método que al inicializar obtiene las conversaciones del usuario
  ngOnInit(){
    this.obtenerTokensLocal();
    this.obtenerConversaciones();

  }
  // método para obtener los tokens de Storage
  obtenerTokensLocal() {
    this.accessTokenLocal = this.tokenService.getAccessToken();
    this.refreshTokenLocal = this.tokenService.getRefreshToken();
  }

  //método para obtener las conversaciones del usuario
  obtenerConversaciones() {
    const request: MensajesRequest = {
      accessToken: this.accessTokenLocal
    };
    // llamada al servicio 
    this.mensajesService.getConversaciones(request).subscribe({
      next: (conver) => {
        this.listaConversaciones = conver;
        console.log('Conversaciones recibidas:', conver);
      },
      error: (err) => {
        console.error('Error al obtener conversaciones', err);

        if(err.error.message =='Sesión caducada'){
          // refrescar el token
          this.refrescarToken();
          // volvemos a obtener las conversaciones con el token refrescado
          this.obtenerConversaciones();
        }
      }
    });
  }
  // método para obtener el refresh token cuando se ha caducado la sesión
  refrescarToken() {
    let request: RefreshTokenRequest = {
      token: this.refreshTokenLocal
    }
    let responseObservable: Observable<SetLoginResponse> = this.loginService.refreshToken(request);
    let response: SetLoginResponse;
      // Obtención de datos mediante el observable
    responseObservable.subscribe(datos =>{
      response = datos;
      console.log(response);
      this.actualizarTokens(response);
    },
    // En caso de error, se muestra una alerta con la información del error como feedback
    (error) => {
      console.error('Error', error);
    });
  }
  // método que muestra los mensajes de la conversacion seleccionada en una nueva página. Parámetro de entrada: conversacion
  verConversacion(conversacion: ConversacionResponse) {
    console.log("conversación ", conversacion);
    //pasamos la conversacion a la página de mensajes para poder obtener los mensajes
    this.router.navigate(['/messages'], {
      state: { conversacion }
    });
  }

  // método para actualizar los tokens
  actualizarTokens(response: SetLoginResponse) {
    this.tokenService.setAccessToken(response.accessToken);
    this.tokenService.setRefreshToken(response.refreshToken);
  }
}
