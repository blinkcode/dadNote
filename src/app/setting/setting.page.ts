import { FileService } from './../common/file/file.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  config: any = null;
  swipeable = false;
  activeTab = 0;
  activeTab1 = 0;
  constructor(private file: FileService) {}

  ngOnInit() {
    this.file.readConfig().then((config) => {
      this.config = config;
    });
  }
  changeTabe({ index }) {
    this.activeTab1 = index;
  }
}
