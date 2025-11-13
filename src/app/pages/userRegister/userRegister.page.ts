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
  // caracteristicas de la contraseña para mostrar en el tooltip
  literalesPassword = [
     '6 caracteres',
     'Mayúscula y minúscula',
     'Número',
     'Carácter especial'
  ];



  // inyección de servicios y controladores
  constructor(private registroService: RegistroUsuarioService, private formBuilder: FormBuilder, private alertController: AlertController) {}

  // método al iniciar que incluye las validaciones de los inputs del usuario en el formulario.
  ngOnInit() {
    this.formularioRegistro = this.formBuilder.group({
      alias: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_-]{3,50}$')  // 100 max length en BBDD - Username debe tener entre 3 y 50 caracteres en back
        ]
      ],
      email: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') // 100 max length en BBDD
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$') // min 6 backend
        ]
      ]
    });
  }
  
  // método asíncrono que lleva el flujo de registro del usuario
  // Se muestran alertas para dar feedback al usuario
  async onSubmit() {
    try{

      const respuesta = await this.registrarUsuario(); 
      await this.alertaVerificacion(respuesta);

    }catch(error:any){

      await this.alertaError(error);
    }
  }
 // método asíncrono que recoge los datos necesarios para la request y realiza la llamada al servicio registroService para guardar los datos del usuario.
  async registrarUsuario(): Promise<SetUserResponse>  {
    // recogida de parámetros para la request
    let request: SetUserRequest ={
      username: this.alias,
      email: this.email,
      password: this.password
    };

    // llamada al servicio
    const promesa = new Promise<SetUserResponse>((resolve, reject) => {
      this.registroService.setUser(request).subscribe({
        next: (response: SetUserResponse) => {
          console.log('Respuesta setUser:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error setUser:', error);
          reject(error);
        },
      });
    });

    return promesa;
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
          cssClass: 'mayusculas'
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
          handler: async (input) => {

            console.log(input.entradaUsuario);
            input.entradaUsuario = input.entradaUsuario.toUpperCase();
            const acierto = await this.verificarEntradaUsuario(input, response);

            return acierto;
            
          },
        },
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }
  async verificarEntradaUsuario(input: any, response: SetUserResponse): Promise<boolean> {
    console.log('Input usuario', input.entradaUsuario);

    try {
    // validamos el formato
    if (!input?.entradaUsuario || input.entradaUsuario.length !== 6) {
      await this.alertaError(this.errorLongitud);
      return false;
    }

    // llamamos al servicio
    const verifyResponse = await this.verificarCodigo(response.id, input);

    // mostraos la alerta correcta
    await this.alertaCorrecto(verifyResponse);
    return true; 

    } catch (error) {
      // en caso de error, mostramos la alerta de error y no cerraos la alerta de verificación
      await this.alertaError(error);
      return false; 
    }    
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
  async verificarCodigo(idUser: number, inputCodigo: any) {
    // construimos la request
    const request: VerifyEmailRequest = {
      idUsuario: idUser,
      codigoVerificacion: inputCodigo.entradaUsuario
    };
  
    console.log('Request verifyEmail', request);
  
    // llamamos al servicio
    const promesa = new Promise<VerifyEmailResponse>((resolve, reject) => {
      this.registroService.verifyEmail(request).subscribe({
        next: (response: VerifyEmailResponse) => {
          console.log('Response verifyEmail:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error verifyEmail:', error);
          reject(error);
        }
      });
    });
  
    // devolvemos la promesa
    return promesa;
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
