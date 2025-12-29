import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InventarioObjetosPageRoutingModule } from './inventario-objetos-routing.module';
import { InventarioObjetosPage } from './inventario-objetos.page';
import { OwnComponentsModule } from "src/app/components/own-components.module";
import { AurkituMapComponent } from '../../components/aurkitu-map/aurkitu-map.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    InventarioObjetosPageRoutingModule,
    AurkituMapComponent,
    OwnComponentsModule
  ],
  declarations: [InventarioObjetosPage]
})
export class InventarioObjetosPageModule {}
