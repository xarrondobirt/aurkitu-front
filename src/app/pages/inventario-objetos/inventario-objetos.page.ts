import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ObjetoPerdidoService } from 'src/app/services/objeto-perdido';
import { TipoObjeto, FiltroFecha } from 'src/app/interfaces/objetos';
import { MensajesRequest } from 'src/app/interfaces/messages';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-inventario-objetos',
  templateUrl: './inventario-objetos.page.html',
  styleUrls: ['./inventario-objetos.page.scss'],
  standalone: false,
})

export class InventarioObjetosPage implements OnInit {

  // Formulario
  formBusqueda!: FormGroup;

  // Gestión tokens
  tokensLocal: any;
  refrescado: boolean = false;

  // Environment para poder usarlo en el HTML
  public environment = environment;

  // Búsqueda de objetos perdidos
  busquedaRealizada = false;
  objetos: any[] = [];

  // Filtro búsqueda por tipo de objeto
  tipoSeleccionadoTexto = "Tipo de objeto";
  tiposObjeto: TipoObjeto[] = [];

  // Filtro búsqueda por fecha de objeto
  filtrosFecha: FiltroFecha[] = [
    { label: 'Últimos 7 días', days: 7 },
    { label: 'Últimos 30 días', days: 30 },
    { label: 'Últimos 90 días', days: 90 }
  ];
  fechaSeleccionadaTexto = 'Rango de fechas';
  fechaDesde: string | null = null;

  // Referencias a los acordeones (drop down) para cerrarlos desde el ts
  @ViewChild('tipoAccordion') tipoAccordion!: IonAccordionGroup;
  @ViewChild('fechaAccordion') fechaAccordion?: IonAccordionGroup;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private objetoService: ObjetoPerdidoService,
    private authenticationService: AuthenticationService,
    private ruta: Router
  ) {}

  // Al iniciar
  ngOnInit() {
    // Gestión tokens
    this.tokensLocal = this.authenticationService.getTokensLocal();

    // Inicialización del formulario
    this.formBusqueda = this.fb.group({
      ubicacion: this.fb.group({
        latitud: [null, Validators.required],
        longitud: [null, Validators.required]
      }),
      radio: [null, Validators.required],
      idTipoObjeto: [null],
      fechaDesde: [null]
    });

    // Token
    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };

    // Carga de tipos de objetos
    this.objetoService.obtenerTiposObjeto().subscribe({
      next: tipos => {
        this.tiposObjeto = tipos;
      },
      error: async (err) => {
        if(err.error.status == 401 && this.refrescado == false){
          this.refrescado = true;
          // refrescar el token
          await this.authenticationService.refrescarToken(this.tokensLocal);
          this.tokensLocal = this.authenticationService.getTokensLocal();
          console.log(this.tokensLocal);
          // volvemos al inicio del método
          this.ngOnInit();
        }
        console.error('Error cargando tipos de objeto', err);
      }
    });

    // Carga de selector de últimos x días. Por defecto últimos 7
    const filtroPorDefecto = this.filtrosFecha.find(f => f.days === 7);
    if (filtroPorDefecto) {
      this.seleccionarFiltroFecha(filtroPorDefecto);
    }
  }

  // handle captura eventos del mapa
  handleSearchChange(event: any) {
    this.formBusqueda.patchValue({
      ubicacion: { latitud: event.lat, longitud: event.lng },
      radio: event.radius
    });
  }

  // Se ejecuta al seleccionar un tipo en el drop down.
  seleccionarTipo(tipo: TipoObjeto) {
    this.formBusqueda.patchValue({ idTipoObjeto: tipo.id });
    this.tipoSeleccionadoTexto = tipo.descripcion;
    this.tipoAccordion.value = undefined;
  }

  // Calcula la fecha desde hoy hasta el número de días seleccionados 7/30/90
  seleccionarFiltroFecha(filtro: FiltroFecha) {
    // Cálculo fecha x días anterior
    const hoy = new Date();
    const fechaDesde = new Date(hoy);
    fechaDesde.setDate(hoy.getDate() - filtro.days);

    // Formato ISO (lo que el back espera normalmente)
    this.fechaDesde = fechaDesde.toISOString();

    // Actualización del formulario
    this.formBusqueda.patchValue({
      fechaDesde: this.fechaDesde
    });

    this.fechaSeleccionadaTexto = filtro.label;

    if (this.fechaAccordion) {
      this.fechaAccordion.value = undefined;
    }
  }

  // Búsqueda de objetos que coincidan con los filtros de ubicación, radio, tipo y fecha
  buscarObjetos() {
    // Datos para enviar a back
    const filtros = {
      ubicacion: this.formBusqueda.value.ubicacion,
      radio: this.formBusqueda.value.radio,
      tipo: { id: this.formBusqueda.value.idTipoObjeto },
      fecha: this.formBusqueda.value.fechaDesde
    };

    // Token
    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };

    console.log("Filtros:", filtros);

    // Llamada al servicio
    this.objetoService.buscarObjetos(filtros).subscribe({
      next: (res: any) => {
        console.log("Respuesta backend:", res);

        // Normalizamos el resultado
        if (Array.isArray(res)) {
          this.objetos = res;
        } else if (Array.isArray(res.data)) {
          this.objetos = res.data;
        } else if (Array.isArray(res.objetos)) {
          this.objetos = res.objetos;
        } else {
          this.objetos = [];
        }

        this.busquedaRealizada = true;
      },
      error: async (err) => {
        if(err.error.status == 401 && this.refrescado == false){
          this.refrescado = true;
          // refrescar el token
          await this.authenticationService.refrescarToken(this.tokensLocal);
          this.tokensLocal = this.authenticationService.getTokensLocal();
          console.log(this.tokensLocal);
          // volvemos al inicio del método
          this.buscarObjetos();
        console.error("Error:", err);
        this.objetos = [];}
      }
    })
  }

  // Carga de imagen por defecto cuando no tenemos ninguna almacenada
  onImageError(event: any) {
    const target = event.target;
    const fallbackSrc = 'assets/icon/no-image.png';

    // Evitar bucle al cargar la imagen
    if (target.src.includes(fallbackSrc) || target.dataset.fallbackApplied) {
      return;
    }

    target.dataset.fallbackApplied = 'true';
    target.src = fallbackSrc;
  }

  // Método para ir a la conversación desde el botón de sobre del objeto
  goConversacion(obj: any) {

    if (!obj.puedeChatear) return; // seguridad 
    
    const idUsuario = obj?.usuario?.id;
    const idObjeto = obj?.id;

    // Token
    const request: MensajesRequest = {
      accessToken: this.tokensLocal.accessToken
    };

    if (!idUsuario || !idObjeto) {
      console.error('Faltan datos para abrir la conversación', obj);
      return;
    }

    // Llamada al servicio
    this.objetoService.verChat(idUsuario, idObjeto).subscribe({
      next: (conversacion: any) => {
        console.log('Conversación recibida:', conversacion);

        this.ruta.navigate(['/messages'], {
          state: { 
            conversacion: {
              ...conversacion,
              // Normalización para utilización de pantalla de mensajes
              id: conversacion.id ?? conversacion.idConversacion,
              participante: {
                id: idUsuario,
                username: obj.usuario?.username,
              },
              idObjeto: idObjeto
            }
          }
        });
      },
      error: async (err) => {
        if(err.error.status == 401 && this.refrescado == false){
          this.refrescado = true;
          // refrescar el token
          await this.authenticationService.refrescarToken(this.tokensLocal);
          this.tokensLocal = this.authenticationService.getTokensLocal();
          console.log(this.tokensLocal);
          // volvemos al inicio del método
          this.goConversacion(obj);
          console.error('Error al obtener la conversación', err);
        }
      }
    });
  }
}
