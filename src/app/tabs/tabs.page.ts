import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  constructor(
    private router: Router,
  ) { }
  tabbarStyle: object = { position: 'fixed', width: '100%', height: '50px', bottom: 0 };
  unselectedTintColor: string = '#888';
  tintColor: string = '#108ee9';
  selectedIndex = 0;

  ngOnInit(): void {
    this.routerEvent();
  }
  tabBarTabOnPress(pressParam: any) {
    const { index } = pressParam;
    console.log(index);
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
  private routerEvent() {
    this.router.events.subscribe((res: any) => {
      if (event => event instanceof NavigationStart) {
        if (this.router.url.indexOf('/tabs/note') !== -1) {
          this.selectedIndex = 0;
        } else if (this.router.url.indexOf('/tabs/view') !== -1) {
          this.selectedIndex = 1;
        } else if (this.router.url.indexOf('/tabs/setting') !== -1) {
          this.selectedIndex = 2;
        }
      }
    });
  }

}
