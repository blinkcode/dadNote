import { Component, OnInit } from '@angular/core';
import { File, Entry } from '@ionic-native/file/ngx';
import { DeviceService } from '../common/device/device.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  years: string[];
  swipeable = false;
  constructor(
    private file: File,
    private device: DeviceService
  ) { }

  ngOnInit() {
    this.init()
  }

  init() {
    this.getYear().then((years: any[]) => {
      this.years = years;
    })
  }
  /**
   * 获取所有年份
   */
  getYear() {
    const root = this.file.externalRootDirectory;
    const years = [];
    if (!this.device.isMobile()) {
      return Promise.resolve(['2020', '2019', '2018'])
    }

    return new Promise((resolve, reject) => {
      this.file.listDir(`${root}`, 'dadNote').then((dir: Entry[]) => {
        dir.forEach((d) => {
          console.log(d.isDirectory)
          if (d.isDirectory) {
            years.push(d.name);
          }
        })
      });
      resolve(years.sort((a, b) => Number(b) - Number(a)))
    })
  }

}
