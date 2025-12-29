import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ObjetoPerdidoService } from 'src/app/services/objeto-perdido';
import { TipoObjeto } from 'src/app/interfaces/objetos';

@Component({
  selector: 'app-inventario-objetos',
  templateUrl: './inventario-objetos.page.html',
  styleUrls: ['./inventario-objetos.page.scss'],
  standalone: false,
})
export class InventarioObjetosPage implements OnInit {

  formBusqueda!: FormGroup;
  public environment = environment;
  resultados: any[] = [];
  busquedaRealizada = false;
  tiposObjeto: TipoObjeto[] = [];
  tipoSeleccionadoTexto = "Tipo de objeto";
  objetos: any[] = [];


  @ViewChild('tipoAccordion') tipoAccordion!: IonAccordionGroup;

  constructor(
    private fb: FormBuilder,
    private objetoService: ObjetoPerdidoService
  ) {}

  ngOnInit() {
    this.formBusqueda = this.fb.group({
      ubicacion: this.fb.group({
        latitud: [null, Validators.required],
        longitud: [null, Validators.required]
      }),
      radio: [null, Validators.required],
      idTipoObjeto: [null]
    });

    this.objetoService.obtenerTiposObjeto().subscribe(tipos => {
      this.tiposObjeto = tipos;
    });
  }

  handleSearchChange(event: any) {
    this.formBusqueda.patchValue({
      ubicacion: { latitud: event.lat, longitud: event.lng },
      radio: event.radius
    });
  }

  seleccionarTipo(tipo: TipoObjeto) {
    this.formBusqueda.patchValue({ idTipoObjeto: tipo.id });
    this.tipoSeleccionadoTexto = tipo.descripcion;
    this.tipoAccordion.value = undefined;
  }

  buscarObjetos() {
  const filtros = {
    ubicacion: this.formBusqueda.value.ubicacion,
    radio: this.formBusqueda.value.radio,
    tipo: { id: this.formBusqueda.value.idTipoObjeto }
  };

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
    error: (err) => {
      console.error("Error:", err);
      this.objetos = [];
    }
  });
}


  verDetalle(obj: any) {
    console.log("Ver detalle:", obj);
    // Aquí puedes navegar a otra página o abrir modal
  }

  
  onImageError(event: any) {
    event.target.src = 'assets/no-image.png';
  }
}
