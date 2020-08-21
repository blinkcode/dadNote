import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {

  carList: any[] = [{ title: '车队' }];
  activeTabIndex = 0;
  dataSet: any[] = []
  constructor() { }

  ngOnInit() {
    this.dataSet = new Array(10).fill({});
  }

  addCar() {
    this.carList.push({ title: '车队' });
  }

}
