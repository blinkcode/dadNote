import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.page.html',
  styleUrls: ['./ready.page.scss'],
})
export class ReadyPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    window.document.addEventListener("deviceready", ()=> {
      this.router.navigateByUrl('tabs');
    });
  }

}
