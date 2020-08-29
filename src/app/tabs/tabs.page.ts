import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    private router: Router
  ) { }
  tabbarStyle: object = { position: 'fixed', width: '100%', height: '50px', bottom: 0 };
  unselectedTintColor: string = '#888';
  tintColor: string = '#108ee9';
  selectedIndex = 0;

  tabBarTabOnPress(pressParam: any) {
    const { index } = pressParam;
    switch (index) {
      case 0:
        this.router.navigateByUrl('/tabs/note');
        break;
      case 1:
        this.router.navigateByUrl('/tabs/view');
        break;
      case 2:
        this.router.navigateByUrl('/tabs/setting');
        break;

      default:
        break;
    }
    this.selectedIndex = pressParam.index;
  }

}
