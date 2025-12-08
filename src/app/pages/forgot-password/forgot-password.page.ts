import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPassword } from '../../services/forgot-password';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RecuperarPassResponse, RecuperarPassRequest} from 'src/app/interfaces/users';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone:false,
})

// Página de recuperación de contraseña
export class ForgotPasswordPage implements OnInit {

  // Inputs del formulario
  email: string = '';

  // Formulario
  formularioForgotPass!: FormGroup;

  // Mensaje de error
  errorPassword = {
    error:{
      message: 'Correo electrónico no válido'
    }
  };

  // Constructor. Inyección de servicios y controladores
  constructor(private forgotPass: ForgotPassword, private formBuilder: FormBuilder, private alertController: AlertController, private router: Router) { }

  // método al iniciar que incluye la verificación del correo electrónico
  ngOnInit() {
    // verificación del correo electrónico
    this.formularioForgotPass = this.formBuilder.group({
      email: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') // 100 max length en BBDD
        ]
      ]
    });
  }

  // método asíncrono para el reseteo de la contraseña
  async onSubmit() {
    try{

      const respuesta = await this.correoRecuperacion(); 
      await this.alertaVerificacion(respuesta);

    }catch(error:any){

      await this.alertaError(error);
    }
  }

  // método asíncrono que recoge el correo del usuario que quiere recuperar la contraseña
  async correoRecuperacion():Promise<RecuperarPassResponse> {
    // recogida de parámetros para la request
    let request: RecuperarPassRequest ={
      email: this.email
    };

    // llamada al servicio
    const promesa = new Promise<RecuperarPassResponse>((resolve, reject) => {
      this.forgotPass.correoRecuperacion(request).subscribe({
        next: (response: RecuperarPassResponse) => {
          console.log('Respuesta RecuperarPassResponse:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error RecuperarPassResponse:', error);
          reject(error);
        },
      });
    });

    return promesa;
  }

  // método asíncrono que muestra una alerta que indica el envío del código de verificación
  async alertaVerificacion(response: RecuperarPassResponse) {
    const email = this.formularioForgotPass.value.email || this.email;
    const alert = await this.alertController.create({
      header: response.mensaje,
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          
          handler: () => {
            // llevar a la pagina de reset
             this.router.navigate(['/reset-password'], {state: {email}});
          },
        },
      ]
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
}
