import { AccountBook } from './../model/model';
import { Component, OnInit, Input } from '@angular/core';
import { thistle } from 'color-name';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss'],
})
export class TotalComponent implements OnInit {

  @Input()
  accountBook: AccountBook
  date = '';
  constructor() { }

  ngOnInit() {
    this.init();
  }
  init(){
    this.date = this.accountBook.date;
  }

}
