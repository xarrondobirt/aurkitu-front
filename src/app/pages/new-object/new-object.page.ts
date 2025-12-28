import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonAccordionGroup, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ObjetoPerdidoService } from 'src/app/services/objeto-perdido';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ObjetoPerdidoDTO, TipoObjeto, ColoresObjeto } from 'src/app/interfaces/objetos';


@Component({
  selector: 'app-new-object',
  templateUrl: './new-object.page.html',
  styleUrls: ['./new-object.page.scss'],
  standalone: false,
})
export class NewObjectPage implements OnInit {

  // Formulario de nuevo objeto
  formularioObjeto!: FormGroup;

  // Guardan los datos de ubicación que devuelve el mapa
  resultadoBusqueda: any = null;

  // Dropdown de tipo de objeto y colores
  tiposObjeto: TipoObjeto[] = [];
  coloresObjeto: ColoresObjeto[] = [];

  // Textos visibles en los accordion (drop down)
  tipoSeleccionadoTexto = 'Tipo de objeto';
  colorSeleccionadoTexto = 'Color';

  // Referencias a los acordeones (drop down) para cerrarlos desde el ts
  @ViewChild('tipoAccordion') tipoAccordion!: IonAccordionGroup;
  @ViewChild('colorAccordion') colorAccordion!: IonAccordionGroup;

  // Mapa
  //map!: L.Map;
  //marker!: L.Marker;

  // Ficheros
  selectedPhoto: File | null = null;
  selectedDocument: File | null = null;
  isSubmitting = false;

  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private objetoService: ObjetoPerdidoService,
    private alertController: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {}

  // Al iniciar
  ngOnInit() {

    // Fecha hoy por defecto = Hoy
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0]; // formato YYYY-MM-DD

    // Campos del formulario y valores por defecto
    this.formularioObjeto = this.formBuilder.group({
      ubicacion: this.formBuilder.group ({
        latitud: [null, Validators.required],
        longitud: [null, Validators.required],
      }),
      radio: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      idTipoObjeto: [null, Validators.required],
      descripcion: ['', Validators.required],
      marca: [''],
      serie: [''],
      idColor: [null, Validators.required],
      fecha: [fechaHoy, Validators.required],
    });

    // Actualizar texto cuando cambian los valores
    this.formularioObjeto.get('idTipoObjeto')?.valueChanges.subscribe(id => {
      const tipo = this.tiposObjeto.find(t => t.id === id);
      this.tipoSeleccionadoTexto = tipo ? tipo.descripcion : 'Tipo de objeto';
    });

    this.formularioObjeto.get('idColor')?.valueChanges.subscribe(id => {
      const color = this.coloresObjeto.find(c => c.id === id);
      this.colorSeleccionadoTexto = color ? color.descripcion : 'Color';
    });

    // Cargar datos desde backend de tipos de objeto
    this.objetoService.obtenerTiposObjeto().subscribe({
      next: tipos => {
        this.tiposObjeto = tipos;
        const id = this.formularioObjeto.value.idTipoObjeto;
        if (id) {
          const tipo = tipos.find(t => t.id === id);
          this.tipoSeleccionadoTexto = tipo ? tipo.descripcion : 'Tipo de objeto';
        }
      },
      error: err => console.error('Error cargando tipos de objeto', err)
    });

    // Cargar datos desde backend de colores de objeto
    this.objetoService.obtenerColoresObjeto().subscribe({
      next: colores => {
        this.coloresObjeto = colores;
        const id = this.formularioObjeto.value.idColor;
        if (id) {
          const color = colores.find(c => c.id === id);
          this.colorSeleccionadoTexto = color ? color.descripcion : 'Color';
        }
      },
      error: err => console.error('Error cargando colores', err)
    });
  }

  // handle captura eventos del mapa
  handleSearchChange(event: any) {
    this.resultadoBusqueda = event;
    console.log('Datos Búsqueda:', event);

    // Actualización de valores de latitud, longitud y radio
    this.formularioObjeto.patchValue({
      ubicacion: {
        latitud: event.lat,
        longitud: event.lng
      },
      radio: event.radius
    });
  }

  // Métodos para seleccionar tipo y cerrar el acordeón
  seleccionarTipo(tipo: TipoObjeto) {
    this.formularioObjeto.patchValue({ idTipoObjeto: tipo.id });
    this.tipoSeleccionadoTexto = tipo.descripcion;

    // Cierra el acordeón
    this.tipoAccordion.value = undefined;
  }

  // Métodos para seleccionar colores y cerrar el acordeón
  seleccionarColor(color: ColoresObjeto) {
    this.formularioObjeto.patchValue({ idColor: color.id });
    this.colorSeleccionadoTexto = color.descripcion;

    // Cierra el acordeón
    this.colorAccordion.value = undefined;
  }

  // Al pulsar el botón
  async onSubmit() {
    // Controlar si el formulario es válido
    if (this.formularioObjeto.invalid) {
      console.log("Formulario inválido:", this.formularioObjeto.value);
    return;
    }

    // Adaptar valores al DTO para el envío a back
    const objeto: ObjetoPerdidoDTO = this.formularioObjeto.value;
    objeto.marca = objeto.marca || '';
    objeto.serie = objeto.serie || '';
    objeto.fecha = new Date(objeto.fecha).toISOString();

    console.log("OBJETO ENVIADO:", JSON.stringify(objeto, null, 2));

    // Control ficheros
    this.isSubmitting = true;

    // Envío a back a través del servicio
    this.objetoService.crearObjetoPerdido(objeto, this.selectedPhoto ?? undefined, this.selectedDocument ?? undefined).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertaCorrecto();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.alertaError(error);
      }
    });
  }

  // Alerta exito
  async alertaCorrecto() {
    const alert = await this.alertController.create({
      header: 'Objeto registrado',
      message: 'El objeto perdido se ha guardado correctamente',
      buttons: [{
        text: 'Aceptar',
        handler: () => this.router.navigate(['/menu']),
      }],
    });
    await alert.present();
  }

  // Alerta error
  async alertaError(error: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: error.error?.message || 'Error al guardar el objeto',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  // Handler fichero foto
  onPhotoChange(file: File | null) {
    this.selectedPhoto = file;
  }

  // Handler fichero factura
  onDocumentChange(file: File | null) {
    this.selectedDocument = file;
  }

  /*
  async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color });
    t.present();
  }
  */
}