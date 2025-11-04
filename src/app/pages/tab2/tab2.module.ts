import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';
import { RouterModule, Routes } from '@angular/router';
import { ExploreContainerComponent } from "src/app/explore-container/explore-container.component";

const routes: Routes = [
  { path: '', component: Tab2Page }
];

@NgModule({
  declarations: [Tab2Page],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), ExploreContainerComponent]
})
export class Tab2PageModule {}