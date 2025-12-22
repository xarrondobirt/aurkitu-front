import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AurkituMapComponent } from '../../components/aurkitu-map/aurkitu-map.component';

@Component({
  selector: 'app-prueba-mapa',
  templateUrl: './prueba-mapa.page.html',
  styleUrls: ['./prueba-mapa.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AurkituMapComponent
  ]
})
export class PruebaMapaPage implements OnInit {

  // Guardan los datos que devuelve el mapa
  resultadoBusqueda: any = null;

  constructor() { }

  ngOnInit() {
  }

  // HANDLERS PARA CAPTURAR LOS EVENTOS DEL MAPA
  // Para el mapa de Búsqueda
  handleSearchChange(event: any) {
    this.resultadoBusqueda = event;
    console.log('Datos Búsqueda:', event);
  }
}
