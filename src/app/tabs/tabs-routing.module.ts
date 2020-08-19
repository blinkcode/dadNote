import { ViewComponent } from './../view/view.component';
import { NoteComponent } from './../note/note.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SettingComponent } from '../setting/setting.component';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'note',
        component: NoteComponent,
      },
      {
        path: 'view',
        component: ViewComponent,
      },
      {
        path: 'setting',
        component: SettingComponent
      },
      {
        path: '',
        redirectTo: 'note',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
