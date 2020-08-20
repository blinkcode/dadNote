import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingPageRoutingModule } from './setting-routing.module';

import { SettingPage } from './setting.page';

import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';
import { ListComponent } from '../common/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingPageRoutingModule,
    NgZorroAntdMobileModule
  ],
  declarations: [SettingPage, ListComponent]
})
export class SettingPageModule {}
