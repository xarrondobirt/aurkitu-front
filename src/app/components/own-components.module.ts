import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from './explore-container/explore-container.component';
import { TopBarComponent } from './top-bar/top-bar.component';



@NgModule({
  declarations: [ExploreContainerComponent, TopBarComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[ExploreContainerComponent, TopBarComponent]
})
export class OwnComponentsModule { }
