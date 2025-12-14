import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConversacionResponse, MensajeDTO, MensajesRequest, MensajesResponse, SesionDTO, SetMensajeRequest } from 'src/app/interfaces/messages';
import { MensajesService } from 'src/app/services/mensajes-service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false
})

// pagina que incluye los mensajes de una conversación determinada y un chat
export class MessagesPage implements OnInit {
  // para mostrar el nombre del usuario con el que se chatea
  alias: string ='';
  // TODO - QUITAR CUANDO SE IMPLEMENTE ACCESSTOKEN
  accessTokenTest: string = '';
  // listado de mensajes
  listaMensajes: MensajeDTO[] = [];
  // contenido del mensaje a grabar
  mensajeNuevo: string ='';
  // objeto conversacion que se pasa desde la pagina anterior
  conversacion: any;


  constructor(private ruta: Router, private mensajesService: MensajesService, private alertController: AlertController) { }

  ngOnInit() {
    // obtener la conversación al pasar en desde la página anterior
    const navigation = this.ruta.getCurrentNavigation();
    this.conversacion= navigation?.extras.state?.['conversacion'];
    
    console.log('Conversacion ', this.conversacion);

    if(this.conversacion != undefined){
      // obtenemos el alias
      this.alias = this.conversacion.participante.username;
      // obtenemos los mensajes de la conversacion
      this.getMensajesConversacion(this.conversacion.id);
    }

    // TODO - obtener idUsuario mediante access token?
  }

  // método para obtener los mensajes de la conversacion
  getMensajesConversacion(id: number) {

    const request: MensajesRequest = {
      accessToken: this.accessTokenTest
    };

    // llamada al servicio -- TODO VALIDAR SERVICIO
    this.mensajesService.getMensajesConversacionById(id,request).subscribe({
      next: (mensajes) => {
        this.listaMensajes = mensajes;
        console.log('Mensajes recibidos:', mensajes);
      },
      error: (err) => {
        console.error('Error al obtener mensajes', err);
      }
    });
  }
  // método para enviar un nuevo mensaje
  enviarMensaje(mensajeEnviar: string) {
    // verificar que haya contenido y que tengamos los datos de la conversacion
    if(mensajeEnviar.length > 0 && this.conversacion != undefined){
      let request: SetMensajeRequest = {
        idDestinatario: this.conversacion.participante.id,
        idObjeto: this.conversacion.idObjeto,
        contenido: mensajeEnviar
      };
      
      // TODO - MODIFICAR ACCESSTOKENTEST
      let requestToken: MensajesRequest = {
        accessToken: this.accessTokenTest
      };
      // llamada al servicio -- TODO VALIDAR SERVICIO
      const promesa = new Promise<MensajesResponse>((resolve, reject) => {
        this.mensajesService.sendMessage(requestToken, request).subscribe({
          next: (response: MensajesResponse) => {
            console.log('Respuesta sendMensaje:', response);
            resolve(response);
          },
          error: (error) => {
            console.error('Error sendMensaje:', error);
            reject(error);
          },
        });
      });
    }else{ // si no se cumplen los parámetros, se muestra una alerta
      this.alertaError();
    }
  }

  // método que muestra una alerta sobre el nuevo mensaje
  async alertaError() {
    const alert = await this.alertController.create({
      header: 'El mensaje no cumple con los parámetros',
      buttons: [
        {
          text: 'Aceptar',
        },
      ],
    });

    await alert.present();
  }
}