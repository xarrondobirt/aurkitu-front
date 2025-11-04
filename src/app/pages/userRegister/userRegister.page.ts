import { SetUserRequest, SetUserResponse, VerifyEmailRequest, VerifyEmailResponse } from 'src/app/interfaces/users';
import { RegistroUsuarioService } from '../../services/registro-usuario-service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-userRegister',
  templateUrl: 'userRegister.page.html',
  styleUrls: ['userRegister.page.scss'],
  standalone:false,
})

// Página para el registro de un nuevo usuario. Obtención de inputs del usuario y verificación del correo vía servicio/backend
export class UserRegisterPage {
  // inputs del formulario
  alias: string = '';
  email: string = '';
  password: string ='';

  // formulario
  formularioRegistro!: FormGroup;

  // mensaje de error
  errorLongitud = {
    error:{
      message: 'Longitud del código innadecuada'
    }
  };

  // inyección de servicios y controladores
  constructor(private registroService: RegistroUsuarioService, private formBuilder: FormBuilder, private alertController: AlertController) {}

  // método al iniciar que incluye las validaciones de los inputs del usuario en el formulario.
  ngOnInit() {
    this.formularioRegistro = this.formBuilder.group({
      alias: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_-]{3,15}$') 
        ]
      ],
      email: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$')
        ]
      ]
    });
  }
  
  // método asíncrono que recoge los datos necesarios para la request y realiza la llamada al servicio registroService para guardar los datos del usuario.
  // Se muestran alertas para dar feedback al usuario
  async onSubmit() {
    // recogida de parámetros para la request
    let request: SetUserRequest ={
      username: this.alias,
      email: this.email,
      password: this.password
    };

    // llamada al servicio
    let response: SetUserResponse;
    console.log(request);
    let responseObservable: Observable<SetUserResponse> = this.registroService.setUser(request);
    
    // obtención de los datos vía suscripción al observable
    responseObservable.subscribe(datos =>{
      response = datos;
      console.log(response);
      // se muestra la alerta de verificación con los datos de la respuesta
      this.alertaVerificacion(response);
    },
    // en caso de error, se muestra una alerta con la información del error como feedback
    (error) => {
      console.error('Error', error);
      this.alertaError(error);
    },);
  }

  // método asíncrono que muestra una alerta para introducir el código enviado al correo electrónico indicado para su validación
  async alertaVerificacion(response: SetUserResponse) {
    const alert = await this.alertController.create({
      header: response.mensaje,
      inputs: [
        {
          name: 'entradaUsuario',
          type: 'text',
          placeholder: 'Indica el código de verificación',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          // al aceptar, verificamos el código introducido por el usuario
          handler: (input) => {

            console.log('Input usuario', input.entradaUsuario);

            this.verificarCodigo(response.id,input);
            
          },
        },
      ],
    });

    await alert.present();
  }
  // método asíncrono que muestra una alerta para mostrar los mensajes de error
  async alertaError(error: any) {
    const alert = await this.alertController.create({
      header: error.error.message,
      buttons: [
        {
          text: 'Aceptar',
        },
      ],
    });

    await alert.present();
  }
  // método que valida el código introducido por el usuario vía servicio
  verificarCodigo(idUser: number, inputCodigo: any) {
    // los códigos tienen una longitud de 6 
    if(inputCodigo.entradaUsuario.length == 6){
      // se introducen los datos de la request
      let request: VerifyEmailRequest = {
        idUsuario: idUser,
        codigoVerificacion: inputCodigo.entradaUsuario
      };

      // llamamos al servicio de vrificación del email
      let response: VerifyEmailResponse;
      console.log(request);
      let responseObservable: Observable<VerifyEmailResponse> = this.registroService.verifyEmail(request);
      
      // nos suscribimos al observable para obtener el resultado del servicio
      responseObservable.subscribe(datos =>{
        response = datos;
        console.log(response);
        // mostramos una alerta con el feedback
        this.alertaCorrecto(response);
      },
      // en caso de error, mostramos una alerta con información adicional
      (error) => {
        console.error('Error', error);
        this.alertaError(error);
      },);

    }else{
      // si no cumple con la longitud establecida, mostramos una alerta con la información
      this.alertaError(this.errorLongitud);
    }
  }

  // método asíncrono que muestra la respuesta del servicio cuando no ha habido errores
  async alertaCorrecto(response: VerifyEmailResponse) {
    const alert = await this.alertController.create({
      header: response.mensaje,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // TODO - ¿qué hacer cuando el código es correcto?
          },
        },
      ],
    });

    await alert.present();
  }
}