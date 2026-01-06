import { ConversacionResponse } from '../../interfaces/messages';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensajesRequest } from 'src/app/interfaces/messages';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { MensajesService } from 'src/app/services/mensajes-service';
import { ToastController, AlertController } from '@ionic/angular';

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

  constructor(private mensajesService: MensajesService, private router: Router,  private authenticationService: AuthenticationService, private alertController: AlertController, private toastController: ToastController) {}

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

  // método para cerrar el caso, el usuario debe confirmar si quiere cerrarlo. En caso afirmativo se llama al API
  async cerrarCasoObjeto(idConversacion: number){

    const cerrar = await this.alertaCaso();

    if(cerrar == true){
      this.cerrarCasoAPI(idConversacion);
    }
  }
  
// método que muestra una alerta para confirmar si se debe cerrar el caso
  async alertaCaso(): Promise<boolean>{
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Se va a proceder a cerrar el caso',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              resolve(true);
            },
          },
          {
            text:'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            },
          }
        ],
      });
      await alert.present();
    });
  }
  // método que llama al servicio para cerrar el caso
  cerrarCasoAPI(idObjeto: number) {
    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };

    // llamada al servicio
    this.mensajesService.cerrarCaso(idObjeto,request).subscribe({
      next: (resultado) => {
        console.log('Cierre caso: ',  resultado);
        // se muestra el mensaje obtenido
        this.toastCaso(resultado.mensaje);
      },
      // controlar los errores
      error: (err) => {
        console.error('Error al obtener mensajes', err);

      }
    });
  }

  // método para mostrar el mensaje de respuesta del servicio en un toast
  async toastCaso(respuesta: string) {
    const toast = await this.toastController.create({
      message: respuesta,
      duration: 0, 
      position: 'middle',
      cssClass: 'notificacionToast',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            // recargamos
            this.obtenerConversaciones();
          },
        }
      ]
    });

    await toast.present();
  }
}
