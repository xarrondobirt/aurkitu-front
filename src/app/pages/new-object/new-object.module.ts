import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewObjectPageRoutingModule } from './new-object-routing.module';
import { NewObjectPage } from './new-object.page';
import { OwnComponentsModule } from "src/app/components/own-components.module";
import { AurkituMapComponent } from '../../components/aurkitu-map/aurkitu-map.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    NewObjectPageRoutingModule,
    OwnComponentsModule,
    AurkituMapComponent
  ],
  declarations: [NewObjectPage]
})
export class NewObjectPageModule {}
