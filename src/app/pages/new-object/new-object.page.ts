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

  formularioObjeto!: FormGroup;

  // Guardan los datos que devuelve el mapa
  resultadoBusqueda: any = null;

  tiposObjeto: TipoObjeto[] = [];
  coloresObjeto: ColoresObjeto[] = [];

  // Textos visibles en los accordion
  tipoSeleccionadoTexto = 'Tipo de objeto';
  colorSeleccionadoTexto = 'Color';

  // Mapa
  map!: L.Map;
  marker!: L.Marker;

  // Ficheros
  selectedPhoto: File | null = null;
  selectedDocument: File | null = null;
  isSubmitting = false;

  // Referencias a los acordeones
  @ViewChild('tipoAccordion') tipoAccordion!: IonAccordionGroup;
  @ViewChild('colorAccordion') colorAccordion!: IonAccordionGroup;

  constructor(
    private formBuilder: FormBuilder,
    private objetoService: ObjetoPerdidoService,
    private alertController: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
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
      fecha: ['', Validators.required],
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

    // Cargar datos desde backend
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

  // HANDLERS PARA CAPTURAR LOS EVENTOS DEL MAPA
  // Para el mapa de Búsqueda
  handleSearchChange(event: any) {
    this.resultadoBusqueda = event;
    console.log('Datos Búsqueda:', event);

    // Suponiendo que el evento trae event.lat y event.lng
    this.formularioObjeto.patchValue({
      ubicacion: {
        latitud: event.lat,
        longitud: event.lng
      },
      radio: event.radius
    });
  }

  // Métodos para seleccionar tipo y color y cerrar el acordeón
  seleccionarTipo(tipo: TipoObjeto) {
    this.formularioObjeto.patchValue({ idTipoObjeto: tipo.id });
    this.tipoSeleccionadoTexto = tipo.descripcion;

    // Cierra el acordeón
    this.tipoAccordion.value = undefined;
  }

  seleccionarColor(color: ColoresObjeto) {
    this.formularioObjeto.patchValue({ idColor: color.id });
    this.colorSeleccionadoTexto = color.descripcion;

    // Cierra el acordeón
    this.colorAccordion.value = undefined;
  }

  async onSubmit() {
    /*if (this.formularioObjeto.invalid) {
      console.log("Formulario inválido:", this.formularioObjeto.value);
    return;
  }*/

    const objeto: ObjetoPerdidoDTO = this.formularioObjeto.value;
    objeto.marca = objeto.marca || '';
    objeto.serie = objeto.serie || '';
    objeto.fecha = new Date(objeto.fecha).toISOString();

    console.log("OBJETO ENVIADO:", JSON.stringify(objeto, null, 2));

    this.isSubmitting = true;
    /*
    const formData = new FormData();

    if (this.selectedPhoto) {
      formData.append('foto', this.selectedPhoto);
    }
    if (this.selectedDocument) {
      formData.append('factura', this.selectedDocument);
    }

    const foto = this.selectedPhoto;
    const doc = this.selectedDocument;*/

    this.objetoService.crearObjetoPerdido(objeto, this.selectedPhoto ?? undefined, this.selectedDocument ?? undefined).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertaCorrecto();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.alertaError(error);
      }
    }

      /*
      () => this.alertaCorrecto(),
      error => this.alertaError(error)*/
    );
  }

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

  async alertaError(error: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: error.error?.message || 'Error al guardar el objeto',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  onPhotoChange(file: File | null) {
    this.selectedPhoto = file;
  }

  onDocumentChange(file: File | null) {
    this.selectedDocument = file;
  }

  /*
   async enviarDatos() {

    this.isSubmitting = true;
    const formData = new FormData();

    if (this.selectedPhoto) {
      formData.append('foto', this.selectedPhoto);
    }
    if (this.selectedDocument) {
      formData.append('factura', this.selectedDocument);
    }

    /*
    this.http.post(this.urlAPI, formData, { headers }).subscribe({
      next: (response) => {
        console.log('Subida ok:', response);
        this.mostrarToast('¡Objeto subido correctamente!', 'success');
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error en subida:', err);
        const errorMsg = err.error?.message || err.statusText || 'Error desconocido';
        this.mostrarToast(`Error: ${errorMsg}`, 'danger');
        this.isSubmitting = false;
      }
    });
    
  }*/

  async mostrarToast(msg: string, color: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color });
    t.present();
  }
}