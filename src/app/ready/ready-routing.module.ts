import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadyPage } from './ready.page';

const routes: Routes = [
  {
    path: '',
    component: ReadyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadyPageRoutingModule {}
