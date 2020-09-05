import { ToastService } from 'ng-zorro-antd-mobile';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { StorageService } from './common/storage/storage.service';
import { FileService } from './common/file/file.service';
import { Component, HostListener } from '@angular/core';

import { Platform, ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DeviceService } from './common/device/device.service';
import { PermissionService } from './common/permission/permission.service';
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  keyValue = false;
  backButtonPressed = false; // 用于判断返回键是否触发
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private device: DeviceService,
    private file: FileService,
    private persmission: PermissionService,
    private storage: StorageService,
    private keyboard: Keyboard,
    private actionCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private router: Router,
    private minimize: AppMinimize,
    private toast: ToastService,
    private nav: NavController,
    private screenOrientation: ScreenOrientation,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.device.isMobile()) {
        this.persmission.getPermission().then(() => {
          this.file.init();
        });
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        // 键盘监听
        this.keyboardEvent();
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.orientationEvent();
        ;
      } else {
        const config = this.storage.get('config');;
        if (!config) {
          this.file.saveConfig({ car: [], person: [], origin: [], type: [] });
        }
      }
    });
  }

  @HostListener('document:ionBackButton', ['$event'])
  private overrideHardBackAction($event: any) {
    $event.detail.register(100, async () => {
      /** 关闭键盘 */
      if (this.keyValue) {
        this.keyboard.hide();
        return false;
      }
      /** 关闭action sheet */
      const element = await this.actionCtrl.getTop();
      if (element) {
        element.dismiss();
        return false;
      }

      /** 关闭modal */
      const element1 = await this.modalCtrl.getTop();
      if (element1) {
        return false;
      }
      /* 在tabs路由下的监听返回按钮提示退出，特别：tabs/sysdrpbconfig移动基础设置需要单独区分 */
      const currentUrl = this.router.url;
      if (currentUrl.indexOf('/tabs/') !== -1) {
        if (this.backButtonPressed) {
          this.backButtonPressed = false;
          this.minimize.minimize(); // 程序最小化
        } else {
          this.toast.show('再按一次退出应用', 1000);
          this.backButtonPressed = true;
          setTimeout(() => this.backButtonPressed = false, 2000);
        }
      }
    });
  }
  /**
   * @description 键盘监听
   * @author Blink
   * @date 2020-05-02
   * @private
   */
  private keyboardEvent() {
    this.keyboard.onKeyboardWillHide().subscribe(res => {
      setTimeout(() => {
        this.keyValue = false;
      }, 300);
    });
    this.keyboard.onKeyboardWillShow().subscribe(res => {
      this.keyValue = true;
    });
  }

  /**
   * @description 横竖屏监听
   * @author Blink
   * @date 2020-08-29
   * @private
   * @memberof AppComponent
   */
  private orientationEvent() {
    // detect orientation changes
    // this.screenOrientation.onChange().subscribe(
    //   () => {

    //   }
    // );
  }

}
