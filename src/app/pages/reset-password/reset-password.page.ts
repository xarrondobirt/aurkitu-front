import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ResetPassResponse, ResetPassRequest} from 'src/app/interfaces/users';
import { ForgotPassword } from '../../services/forgot-password';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone:false,
})
export class ResetPasswordPage implements OnInit {

  // inputs del formulario
  codigo: string = '';
  password: string = '';
  password2: string ='';

  // formulario
  formularioResetPass!: FormGroup;

  // email del usuario
  email!: string;

  // mensaje de error
  errorLongitud = {
    error:{
      message: 'Longitud del código innadecuada'
    }
  };

  // caracteristicas de la contraseña para mostrar en el tooltip
  // literalesPassword = [
  //    '6 caracteres',
  //    'Mayúscula y minúscula',
  //    'Número',
  //    'Carácter especial'
  // ];

   // inyección de servicios y controladores
  constructor(private resetPass: ForgotPassword, private formBuilder: FormBuilder, private alertController: AlertController,private router: Router) {
    // Recuperar email enviado desde forgot-password
    const nav = this.router.getCurrentNavigation();
    this.email = nav?.extras?.state?.['email'] || '';
  }

  // método al iniciar que incluye las validaciones de los inputs del usuario en el formulario.
  ngOnInit() {
    this.formularioResetPass = this.formBuilder.group({
      codigo: ['',
        [
          Validators.required,
          Validators.pattern('^[A-Z0-9]{6}$')// min 6 backend
        ]
      ],
      password: ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$') // min 6 backend
        ]
      ],
      password2: ['',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$') // min 6 backend
        ]
      ]
    });
  }

  // método asíncrono que lleva el flujo de creación de la nueva contraseña
  // Se muestran alertas para dar feedback al usuario
  async onSubmit() {
    try{

      const respuesta = await this.updatePassword(); 
      await this.alertaVerificacion(respuesta);

    }catch(error:any){

      await this.alertaError(error);
    }
  }

  // método asíncrono para crear la nueva contraseña
  async updatePassword(): Promise<ResetPassResponse> {

    // Validar que ambas passwords introducidas son iguales
    const pass1 = this.formularioResetPass.value.password;
    const pass2 = this.formularioResetPass.value.password2;

    if (pass1 !== pass2) {
      throw {
        error: {
          message: 'Las contraseñas no coinciden'
        }
      };
    }

    // request para back
    const request: ResetPassRequest = {
      email: this.email,
      nuevaPassword: pass1,
      repitePassword: pass2,
      codVerificacion: this.formularioResetPass.value.codigo
    };

    console.log('REQUEST RESET PASSWORD:', request);

    // llamada al servicio
    const promesa = new Promise<ResetPassResponse>((resolve, reject) => {

      this.resetPass.setNewPass(request).subscribe({
        next: (response: ResetPassResponse) => {
          console.log('Respuesta ResetPassResponse:', response);
          resolve(response);
        },
        error: (error) => {
          console.error('Error ResetPassResponse:', error);
          reject(error);
        },
      })
  });

  return promesa;
  }


  // método asíncrono que muestra una alerta que indica el envío del código de verificación
  async alertaVerificacion(response: ResetPassResponse) {
    const alert = await this.alertController.create({
      header: response.mensaje,
      buttons: [
        {
          text: 'Aceptar',
          role: 'confirm',
          
          handler: () => {
            // llevar a la pagina de reset
              this.router.navigate(['/login']);
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
