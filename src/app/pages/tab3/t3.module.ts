import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab3Page } from './tab3.page';
import { RouterModule, Routes } from '@angular/router';
import { ExploreContainerComponent } from "src/app/explore-container/explore-container.component";

const routes: Routes = [
  { path: '', component: Tab3Page }
];

@NgModule({
  declarations: [Tab3Page],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), ExploreContainerComponent]
})
export class Tab2PageModule {}