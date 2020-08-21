import { ViewComponent } from './../view/view.component';
import { NoteComponent } from './../note/note.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TabsPage } from './tabs.page';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { NzTableModule } from 'ng-zorro-antd/table';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    NgZorroAntdMobileModule,
    NzTableModule
  ],
  declarations: [TabsPage, NoteComponent, ViewComponent]
})
export class TabsPageModule { }
