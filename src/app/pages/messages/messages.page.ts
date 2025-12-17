import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConversacionResponse, MensajeDTO, MensajesRequest, MensajesResponse, SesionDTO, SetMensajeRequest } from 'src/app/interfaces/messages';
import { MensajesService } from 'src/app/services/mensajes-service';
import { TokenService } from 'src/app/services/token-service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
  standalone: false
})

// pagina que incluye los mensajes de una conversación determinada y un chat
export class MessagesPage implements OnInit {
  // para mostrar el nombre del usuario con el que se chatea
  alias: string | null ='';
  // usuario en local
  userLocal: string | null ='';
  // accessToken en local
  accessTokenLocal: string | null = '';
  // listado de mensajes
  listaMensajes: MensajeDTO[] = [];
  // contenido del mensaje a grabar
  mensajeNuevo: string ='';
  // objeto conversacion que se pasa desde la pagina anterior
  conversacion: any;


  constructor(private ruta: Router, private mensajesService: MensajesService, private alertController: AlertController, private tokenService: TokenService) { }

  ngOnInit() {
    
    this.obtenerConversacion();
    
    this.obtenerTokens();
    
    if(this.conversacion != undefined){
      // obtenemos los mensajes de la conversacion
      this.getMensajesConversacion(this.conversacion.id);
    }

  }
  // obtener la conversación al pasar en desde la página anterior
  obtenerConversacion() {
    const navigation = this.ruta.getCurrentNavigation();

    this.conversacion= navigation?.extras.state?.['conversacion'];
    
    console.log('Conversacion ', this.conversacion);
    
  }
  obtenerTokens() {
    this.accessTokenLocal = this.tokenService.getAccessToken();
    this.userLocal = this.tokenService.getSessionUsername();
  }

  // método para obtener los mensajes de la conversacion
  getMensajesConversacion(id: number) {

    const request: MensajesRequest = {
      accessToken: this.accessTokenLocal
    };

    // llamada al servicio
    this.mensajesService.getMensajesConversacionById(id,request).subscribe({
      next: (mensajes) => {
        this.listaMensajes = mensajes;

        console.log('Mensajes recibidos:', mensajes);
        // obtener ambos usuarios de la conversacion
        const usuario = this.listaMensajes.map(u => u.remitente.username).filter(u => u != this.userLocal);
        console.log(usuario);
        // obtener el usuario para indicarlo en el título
        if(usuario != undefined && usuario[0] != null){
          this.alias = usuario[0];
        }
      },
      // controlar los erroes
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
      
      
      let requestToken: MensajesRequest = {
        accessToken: this.accessTokenLocal
      };
      // llamada al servicio para enviar el mensaje
      const promesa = new Promise<MensajesResponse>((resolve, reject) => {
        this.mensajesService.sendMessage(requestToken, request).subscribe({
          next: (response: MensajesResponse) => {
            console.log('Respuesta sendMensaje:', response);
            resolve(response);
            // obtenemos los mensajes de nuevo para refrescar
            this.getMensajesConversacion(this.conversacion.id);
            this.mensajeNuevo ='';
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