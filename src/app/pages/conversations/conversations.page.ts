import { ConversacionResponse, SesionDTO } from '../../interfaces/messages';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MensajesRequest } from 'src/app/interfaces/messages';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { MensajesService } from 'src/app/services/mensajes-service';

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
  tokensLocal: any;
  refrescado: boolean = false;

  constructor(private mensajesService: MensajesService, private router: Router,  private authenticationService: AuthenticationService) {}

  // método que al inicializar obtiene las conversaciones del usuario
  ngOnInit(){
    this.tokensLocal = this.authenticationService.getTokensLocal();
    this.obtenerConversaciones();
  }

  //método para obtener las conversaciones del usuario
  obtenerConversaciones() {
    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };
    // llamada al servicio 
    this.mensajesService.getConversaciones(request).subscribe({
      next: (conver) => {
        this.listaConversaciones = conver;
        console.log('Conversaciones recibidas:', conver);
      },
      error: async (err) => {
        console.error('Error al obtener conversaciones', err);

        if(err.error.message =='Sesión caducada' && this.refrescado == false){
          this.refrescado = true;
          // refrescar el token
          await this.authenticationService.refrescarToken(this.tokensLocal);
          // volvemos a obtener las conversaciones con el token refrescado
          this.obtenerConversaciones();
        }
      }
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
}
