import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private androidPermissions: AndroidPermissions,
  ) { }


  /**
   * @description 获取权限许可
   * @author Blink
   * @date 2020-03-05
   */
  getPermission() {
    const permissions = [
      this.androidPermissions.PERMISSION.INTERNET, // 网络
      this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, // 读
      this.androidPermissions.PERMISSION.REQUEST_INSTALL_PACKAGES, // 下载更新
      this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, // 写
      this.androidPermissions.PERMISSION.CAMERA, // 相机
      this.androidPermissions.PERMISSION.ACCESS_NETWORK_STATE, // 网络状态
      this.androidPermissions.PERMISSION.MOUNT_UNMOUNT_FILESYSTEMS, // 文件读取
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, // 近似位置
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, // 精确位置
      this.androidPermissions.PERMISSION.ACCESS_WIFI_STATE, // wifi状态
      this.androidPermissions.PERMISSION.CHANGE_WIFI_STATE, // 改变wifi状态
      this.androidPermissions.PERMISSION.READ_PHONE_STATE, // 手机信息
      this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS, // 精确位置
      this.androidPermissions.PERMISSION.BLUETOOTH, // 蓝牙
      this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN, // 蓝牙-管理员
      this.androidPermissions.PERMISSION.CALL_PHONE, // 打电话
      this.androidPermissions.PERMISSION.SEND_SMS, // 发短信 手动添加
    ];
    /* 一次性获取所需的所有权限 */
    return this.androidPermissions.requestPermissions(permissions)
    // .then(res => {
      /*这个地方有些疑问，第一次安装检查权限，会去请求获取权限，
        结果返回的是false,第二次启动时，已有权限，仍然返回的是false.
      */
    // }).catch(err => { });
  }

}
