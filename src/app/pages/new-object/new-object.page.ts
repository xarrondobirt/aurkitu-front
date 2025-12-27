import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonAccordionGroup } from '@ionic/angular';
import { Router } from '@angular/router';
import { ObjetoPerdidoService } from 'src/app/services/objeto-perdido';
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

  // Referencias a los acordeones
  @ViewChild('tipoAccordion') tipoAccordion!: IonAccordionGroup;
  @ViewChild('colorAccordion') colorAccordion!: IonAccordionGroup;

  constructor(
    private formBuilder: FormBuilder,
    private objetoService: ObjetoPerdidoService,
    private alertController: AlertController,
    private router: Router
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

    this.objetoService.crearObjetoPerdido(objeto).subscribe(
      () => this.alertaCorrecto(),
      error => this.alertaError(error)
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
}
