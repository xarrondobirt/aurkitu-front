import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ObjetoPerdidoService } from 'src/app/services/objeto-perdido';
import { TipoObjeto, FiltroFecha } from 'src/app/interfaces/objetos';
import { Router } from '@angular/router';

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
  filtrosFecha: FiltroFecha[] = [
    { label: 'Últimos 7 días', days: 7 },
    { label: 'Últimos 30 días', days: 30 },
    { label: 'Últimos 90 días', days: 90 }
  ];
  fechaSeleccionadaTexto = 'Rango de fechas';
  fechaDesde: string | null = null;
  @ViewChild('tipoAccordion') tipoAccordion!: IonAccordionGroup;
  @ViewChild('fechaAccordion') fechaAccordion?: IonAccordionGroup;

  constructor(
    private fb: FormBuilder,
    private objetoService: ObjetoPerdidoService,
    private ruta: Router
  ) {}

  ngOnInit() {
    this.formBusqueda = this.fb.group({
      ubicacion: this.fb.group({
        latitud: [null, Validators.required],
        longitud: [null, Validators.required]
      }),
      radio: [null, Validators.required],
      idTipoObjeto: [null],
      fechaDesde: [null]
    });

    this.objetoService.obtenerTiposObjeto().subscribe(tipos => {
      this.tiposObjeto = tipos;
    });

      // ✅ SELECCIÓN POR DEFECTO: ÚLTIMOS 7 DÍAS
      const filtroPorDefecto = this.filtrosFecha.find(f => f.days === 7);
      if (filtroPorDefecto) {
        this.seleccionarFiltroFecha(filtroPorDefecto);
      }
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

  seleccionarFiltroFecha(filtro: FiltroFecha) {
    const hoy = new Date();
    const fechaDesde = new Date(hoy);
    fechaDesde.setDate(hoy.getDate() - filtro.days);

    // Formato ISO (lo que el back espera normalmente)
    this.fechaDesde = fechaDesde.toISOString();

    this.formBusqueda.patchValue({
      fechaDesde: this.fechaDesde
    });

    this.fechaSeleccionadaTexto = filtro.label;

    if (this.fechaAccordion) {
    this.fechaAccordion.value = undefined;
  }
  }

  buscarObjetos() {
  const filtros = {
    ubicacion: this.formBusqueda.value.ubicacion,
    radio: this.formBusqueda.value.radio,
    tipo: { id: this.formBusqueda.value.idTipoObjeto },
    fecha: this.formBusqueda.value.fechaDesde
  };

  console.log("Filtros:", filtros);

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
    // event.target.src = 'assets/icon/no-image.png';
    const target = event.target;
    const fallbackSrc = 'assets/icon/no-image.png';


    if (target.src.includes(fallbackSrc) || target.dataset.fallbackApplied) {
      return;
    }

    target.dataset.fallbackApplied = 'true';
    target.src = fallbackSrc;
  }

  goConversacion(obj: any) {
    console.log('Ir a conversación del objeto:', obj);
    this.ruta.navigate(['/messages', obj.id]);

  }

}
