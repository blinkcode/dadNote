import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    private platform: Platform
  ) { }

  /* @description
   * @author Blink
   * @date 2020-03-05
   * @returns {boolean} 检测是否是真机
   */
  isMobile(): boolean {
    return (this.platform.is('mobile')
      || this.platform.is('cordova')
      || this.platform.is('hybrid'))
      && !this.platform.is('mobileweb');
  }
}
