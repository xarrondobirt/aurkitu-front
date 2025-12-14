import { ConversacionResponse, SesionDTO } from '../../interfaces/messages';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensajesRequest } from 'src/app/interfaces/messages';
import { MensajesService } from 'src/app/services/mensajes-service';

@Component({
  selector: 'app-conversations',
  templateUrl: 'conversations.page.html',
  styleUrls: ['conversations.page.scss'],
  standalone: false,
})
// página para mostrar las conversaciones del usuario
export class ConversationsPage implements OnInit {

  // TODO - sustituir por accessToken almacenado  y probar servicio
  accessTokenTest = '';
  listaConversaciones: ConversacionResponse[] = [];

  constructor(private mensajesService: MensajesService, private router: Router) {}

  // método que al inicializar obtiene las conversaciones del usuario
  ngOnInit(){

    const request: MensajesRequest = {
        accessToken: this.accessTokenTest
    };
    // llamada al servicio -- TODO VALIDAR FUNCIONAMIENTO
    this.mensajesService.getConversaciones(request).subscribe({
      next: (conver) => {
        this.listaConversaciones = conver;
        console.log('Conversaciones recibidas:', conver);
      },
      error: (err) => {
        console.error('Error al obtener conversaciones', err);
      }
    });
  }

  // método que muestra los mensajes de la conversacion seleccionada en una nueva página
  verConversacion(conversacion: ConversacionResponse) {
    console.log("conversación ", conversacion);

    this.router.navigate(['/messages'], {
      state: { conversacion }
    });
  }
}
