import { FileService } from './common/file/file.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DeviceService } from './common/device/device.service';
import { PermissionService } from './common/permission/permission.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private device: DeviceService,
    private file: FileService,
    private persmission: PermissionService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.device.isMobile()) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.file.init();
        this.persmission.getPermission();
      }
    });
  }
}
