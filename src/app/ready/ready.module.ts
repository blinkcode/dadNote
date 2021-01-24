import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadyPageRoutingModule } from './ready-routing.module';

import { ReadyPage } from './ready.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadyPageRoutingModule
  ],
  declarations: [ReadyPage]
})
export class ReadyPageModule {}
