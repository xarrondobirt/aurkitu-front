import { ConversacionResponse, MensajesRequest } from './../../interfaces/messages';
import { LogoutRequest} from './../../interfaces/users';
import { ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, Observable, of} from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { LogoutService } from 'src/app/services/logout-service';
import { MensajesService } from 'src/app/services/mensajes-service';
import { TokenService } from 'src/app/services/token-service';
import { Location } from '@angular/common';


interface configuracionPag {
  nombre: string,
  home: boolean,
  logout: boolean,
  backarrow: boolean,
  messages: boolean
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: false
})

// Componente personalizado y reutilizable que actúa como cabecera. Incluye el acceso a los mensajes del usuario, logout y menú 
export class TopBarComponent implements OnInit{
  // variable que guarda el número de mensajes pendientes, para mostrar una imagen u otra
  mensajesSinLeer: boolean = true;
  // tokens en storage
  tokensLocal: any;
  listaConversacionesPdtes: ConversacionResponse[] = [];
  // añadir más paginas cuando se hayan generado
  @Input() pagina!: 'menu' | 'conversations' | 'messages' | 'login' | 'userRegister' | 'resetPassword' |'newObject' | 'objectFilter' |'forgotPassword' |'inventarioObjetos';
  // array con la configuración de cada pagina
  configuracionPaginas: configuracionPag[] = [];
  // configuración de la pagina actual
  paginaActual: any;


  constructor(private router: Router, private servicioLogout: LogoutService, private tokenService: TokenService, private mensajesService: MensajesService, private authenticationService: AuthenticationService, private location: Location) {}

  ngOnInit(){
    // obtener el accesstoken del storage
    this.tokensLocal = this.authenticationService.getTokensLocal();
  
    console.log(this.tokensLocal.accessToken);

    // cargar la configuracion de cada pagina
    this.cargarConfiguracion();

    if(this.paginaActual.messages){
      // obtener los mensajes pendientes
      this.getMensajesPendientes();
    }
  }
  ngOnChanges(changes: SimpleChanges){
    console.log(this.pagina);
    if (changes['pagina'] && this.pagina == 'menu') {
      this.tokensLocal = this.authenticationService.getTokensLocal();
      this.getMensajesPendientes();
    }
  }

  // método para cargar la configuracion de cada página respecto a los iconos home, backarrow, logout y mensajes
  cargarConfiguracion() {

    // cargamos la configuración de cada pantalla
    this.cargarConfiguracionPagina('menu', false, true, false, true);
    this.cargarConfiguracionPagina('conversations', true, false, false, false);
    this.cargarConfiguracionPagina('messages', true, false, true, false);
    this.cargarConfiguracionPagina('newObject', true, false, false, false);
    this.cargarConfiguracionPagina('objectFilter', true, false, false, false);
    this.cargarConfiguracionPagina('login',false, false, false, false);
    this.cargarConfiguracionPagina('userRegister',false, false, true, false);
    this.cargarConfiguracionPagina('resetPassword',false, false, true, false);
    this.cargarConfiguracionPagina('forgotPassword',false, false, true, false);
    this.cargarConfiguracionPagina('inventarioObjetos', true, false, false, false);

    console.log(this.configuracionPaginas);

    // inicializamos la pagina actual
    this.paginaActual = this.configuracionPaginas.find(i => i.nombre == this.pagina);
    console.log(this.paginaActual);
  }

  // método para cargar la configuracion de cada pantalla y añadirla al listado
  cargarConfiguracionPagina(nombrePagina: string, homePagina: boolean, logoutPagina: boolean, backarrowPagina: boolean, messagesPagina: boolean){
    let configPagina: configuracionPag =  {
      nombre: nombrePagina,
      home: homePagina,
      logout: logoutPagina,
      backarrow: backarrowPagina,
      messages: messagesPagina
    };
    
    this.configuracionPaginas.push(configPagina);
  }

  // método para saber si hay mensajes pendientes
  getMensajesPendientes(){
    // obtener si hay conversaciones con mensajes pdtes de leer por el remitente

    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };
    // llamada al servicio 
    this.mensajesService.getConversaciones(request).subscribe({
      next: (conver) => {
        this.listaConversacionesPdtes = conver;
        this.mensajesSinLeer = this.listaConversacionesPdtes.some(u => u.mensajesSinLeer == true);
        console.log(this.mensajesSinLeer);
        console.log('Conversaciones recibidas:', conver);
      },
      error: (err) => {
        console.error('Error al obtener conversaciones', err);

        if(err.error.message =='Sesión caducada'){
          // refrescar el token
          this.authenticationService.refrescarToken(this.tokensLocal);
          // volvemos a obtener las conversaciones con el token refrescado
          this.getMensajesPendientes();
        }
      }
    });
  }

  
  goConversaciones() {
    this.router.navigate(['/conversations']);
  }
  // método para cerrar sesión y llevar a la página de login
  async logout() {

    // cerrar sesión
    let request: LogoutRequest = {
      accessToken: this.tokensLocal.accessToken
    };

    console.log(request);

    const response = await firstValueFrom(
      this.servicioLogout.logout(request).pipe(
        catchError(error => {
          console.error(error);
          return of(null); 
        })
      )
    );

    // delete access token y refresh token 
    this.authenticationService.deleteTokens();

    // llevar a la página de login
    this.router.navigate(['/login']);
  }

  // método que lleva a la página del menú
  goMenu() {
    this.router.navigate(['/menu']);
  }

  goBack(){
    this.location.back();
  }
}
