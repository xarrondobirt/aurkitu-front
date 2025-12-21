import { Component, OnInit, AfterViewInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ObjetoPerdidoService } from 'src/app/services/objeto-perdido';
import { ObjetoPerdidoDTO, TipoObjeto, ColoresObjeto } from 'src/app/interfaces/objetos';
import * as L from 'leaflet';


@Component({
  selector: 'app-new-object',
  templateUrl: './new-object.page.html',
  styleUrls: ['./new-object.page.scss'],
  standalone: false,
})


// Página nuevo objeto
export class NewObjectPage implements OnInit  {

  // Formulario
  formularioObjeto!: FormGroup;

  // Array de tipos de objetos
  tiposObjeto: TipoObjeto[] = [];

  // Array de tipos de objetos
  coloresObjeto: ColoresObjeto[] = [];

  // Mapa
  map!: L.Map;
  marker!: L.Marker;

  // Constructor. Inyección de servicios y controladores
  constructor(
    private formBuilder: FormBuilder,
    private objetoService: ObjetoPerdidoService,
    private alertController: AlertController,
    private router: Router
  ) {}

  // Método al iniciar que incluye las validaciones de los inputs del usuario en el formulario
  ngOnInit() {
    this.formularioObjeto = this.formBuilder.group({
      //ubicacion: ['', Validators.required],
      lat: [null, Validators.required],
      lng: [null, Validators.required],
      radio: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]+$')
        ]
      ],
      idTipoObjeto: [null, Validators.required],
      descripcion: ['', Validators.required],
      marca: [''],
      numSerie: [''],
      idColor: [null, Validators.required],
      fechaPerdida: ['', Validators.required],
    });

    // tipos de objetos
    var vTipo = this; // guardamos el contexto del componente

    this.objetoService.obtenerTiposObjeto().subscribe(
      function(tipos) {
        console.log('Tipos objeto BACKEND:', tipos);
        vTipo.tiposObjeto = tipos; // asignamos el resultado al array
      },
      function(error) {
        console.error('Error cargando tipos de objeto', error);
      }
    );

    // colores de objetos
    var vColor = this; // guardamos el contexto del componente

    this.objetoService.obtenerColoresObjeto().subscribe(
      function(colores) {
        console.log('Colores objeto BACKEND:', colores);
        vColor.coloresObjeto = colores; // asignamos el resultado al array
      },
      function(error) {
        console.error('Error cargando tipos de objeto', error);
      }
    );
  }

  // ionViewDidEnter() {
  //   this.initMap();
  // }

  // initMap() {
  //   this.map = L.map('map').setView([40.416775, -3.703790], 13);

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors'
  //   }).addTo(this.map);

  //   this.map.on('click', (e: any) => {
  //     const coords = e.latlng;
  //     if (this.marker) this.map.removeLayer(this.marker);
  //     this.marker = L.marker([coords.lat, coords.lng]).addTo(this.map);

  //     this.formularioObjeto.patchValue({
  //       lat: coords.lat,
  //       lng: coords.lng
  //     });
  //   });

  //   // Forzar recalculo de tamaño después de render
  //   setTimeout(() => this.map.invalidateSize(), 300);
  // }

  
  // // Mapa para ubicar el objeto perdido
  // ngAfterViewInit() {
  //   const map = L.map('map').setView([40.416775, -3.703790], 13);

  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors'
  //   }).addTo(map);

  //   let marker: L.Marker;

  //   map.on('click', (e: any) => {
  //     const coords = e.latlng;
  //     if (marker) map.removeLayer(marker);
  //     marker = L.marker([coords.lat, coords.lng]).addTo(map);

  //     this.formularioObjeto.patchValue({
  //       lat: coords.lat,
  //       lng: coords.lng
  //     });
  //   });

  //   // Esto fuerza a Leaflet a recalcular tamaño cuando ya se ha renderizado
  //   setTimeout(() => {
  //     map.invalidateSize();
  //   }, 200); // 200ms suele ser suficiente en Ionic
  // }


  // Método asíncrono que se llama al pulsar "Guardar objeto"
  async onSubmit() {
    // Si el formulario es inválido, no hace nada
    if (this.formularioObjeto.invalid) return;

    // Extraemos los valores del formulario en un objeto que cumple la interfaz
    const objeto: ObjetoPerdidoDTO = this.formularioObjeto.value;
    objeto.marca = objeto.marca || '';
    objeto.numSerie = objeto.numSerie || '';
    objeto.fechaPerdida = new Date(objeto.fechaPerdida).toISOString();
    console.log('DTO a enviar:', objeto);

    // Llamada al servicio que hace el POST al backend
    this.objetoService.crearObjetoPerdido(objeto).subscribe(
      () => this.alertaCorrecto(), // Si todo va bien, mostramos alerta de éxito
      (error) => this.alertaError(error) // Si hay error, mostramos alerta de error
    );
  }

  // Alerta de éxito
  async alertaCorrecto() {
    const alert = await this.alertController.create({
      header: 'Objeto registrado', // Título de la alerta
      message: 'El objeto perdido se ha guardado correctamente', // Mensaje
      buttons: [
        {
          text: 'Aceptar',
          handler: () => this.router.navigate(['/menu']), // Al aceptar, vuelve al menú
        },
      ],
    });
    await alert.present(); // Mostramos la alerta
  }

  // Alerta de error
  async alertaError(error: any) {
    const alert = await this.alertController.create({
      header: 'Error', // Título de la alerta
      // Mostramos el mensaje devuelto por el backend o un mensaje genérico
      message: error.error?.message || 'Error al guardar el objeto',
      buttons: ['Aceptar'], // Solo un botón de cerrar
    });
    await alert.present(); // Mostramos la alerta
  }

}
