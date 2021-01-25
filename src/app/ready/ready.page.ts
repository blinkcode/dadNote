import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../common/device/device.service';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.page.html',
  styleUrls: ['./ready.page.scss'],
})
export class ReadyPage implements OnInit {

  constructor(
    private router: Router,
    private device: DeviceService,
  ) { }

  ngOnInit() {
    if(this.device.isMobile()){
      window.document.addEventListener("deviceready", ()=> {
        this.router.navigateByUrl('tabs');
      });
    } else {
      this.router.navigateByUrl('tabs');
    }
  }

}
