import { SetLoginRequest, SetLoginResponse } from 'src/app/interfaces/users';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LoginUsuario } from '../../services/login-usuario';
import { TokenService } from 'src/app/services/token-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})

// Página de login.
export class LoginPage implements OnInit {

  // Inputs del formulario
  user: string ='';
  password: string = '';

  // Formulario
  formularioLogin!: FormGroup;

  // Mensaje de error
  errorPassword = {
    error:{
      message: 'Usuario y/o Contraseña incorrectos'
    }
  };

  // Constructor. Inyección de servicios y controladores
  constructor(private loginService: LoginUsuario, private formBuilder: FormBuilder, private alertController: AlertController, private tokenService: TokenService, private router: Router) { }

  // Método al iniciar que incluye las validaciones de los inputs del usuario en el formulario
  ngOnInit() {
    this.formularioLogin = this.formBuilder.group({
      user: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_-]{3,15}$') 
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

  // Método asíncrono que recoge los datos necesarios para la request
  async onSubmit() {
    // Recogida de parámetros para la request
    let request: SetLoginRequest ={
      username: this.user,
      password: this.password
    };

    // Llamada al servicio
    let response: SetLoginResponse;
    console.log(request);
    let responseObservable: Observable<SetLoginResponse> = this.loginService.setUser(request);
    
    // Obtención de datos mediante el observable
    responseObservable.subscribe(datos =>{
      response = datos;
      console.log(response);
      this.actualizarTokens(response);
      // Alerta login correcto. Se cambiará cuando tengamos la siguiente pantalla
      this.alertaCorrecto();
    },
    // En caso de error, se muestra una alerta con la información del error como feedback
    (error) => {
      console.error('Error', error);
      this.alertaError(error);
    }
    );
  }

  // TEMP hasta crear siguientes pantallas
    async alertaCorrecto() {
      const alert = await this.alertController.create({
        header: 'Login Correcto',
        message: 'Has iniciado sesión correctamente',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.router.navigate(['/menu']);
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
  
  // método para actualizar los tokens
  actualizarTokens(response: SetLoginResponse) {
    this.tokenService.setAccessToken(response.accessToken);
    this.tokenService.setRefreshToken(response.refreshToken);
    this.tokenService.setSessionUsername(this.user);
  }
}