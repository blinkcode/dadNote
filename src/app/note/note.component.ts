import { FileService } from './../common/file/file.service';
import { Person, AccountBook, Type, Origin } from './../common/model/model';
import { StorageService } from './../common/storage/storage.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Car } from '../common/model/model';
import { AlertInput } from '@ionic/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {

  carList: any[] = [{ carNo: '鲁A123456' }];
  activeTabIndex = 0;
  // dataSet: any[] = [];
  selectedCar: Car = null;
  selectedPerson: Person[] = [];
  accountBook: AccountBook = { id: '', date: '', cars: [] };
  editCarIndex: number;
  editRowIndex: number;
  constructor(
    private alertCtrl: AlertController,
    private storage: StorageService,
    private file: FileService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.readFile();
    });
  }
  readFile() {
    this.toast.loading('正在加载，请稍后')
    this.file.readFile().then((account) => {
      this.toast.hide();
      this.accountBook = account;
      console.log(this.accountBook);
    })
  }

  /**
   * 初始化数据
   * 1. 获取当前的车队
   * 2. 获取当前的数据
   */
  init() {

  }

  /**
   * 添加今日车队
   * 1. 添加车队，
   * 2. 往今日数据中添加新车队信息
   */
  addCar() {
    // this.carList.push(JSON.parse(JSON.stringify(this.selectedCar)));
    const arr = [{
      id: uuidv4(),
      carNo: this.selectedCar.carNo,
      startTime: '',
      endTime: '',
      origin: '',
      type: '',
      maozhong: '',
      pizhong: this.selectedCar.weight,
      jingzhong: '',
      amount: '',
      img: '',
    },{
      id: uuidv4(),
      carNo: this.selectedCar.carNo,
      startTime: '',
      endTime: '',
      origin: '',
      type: '',
      maozhong: '',
      pizhong: this.selectedCar.weight,
      jingzhong: '',
      amount: '',
      img: '',
    },{
      id: uuidv4(),
      carNo: this.selectedCar.carNo,
      startTime: '',
      endTime: '',
      origin: '',
      type: '',
      maozhong: '',
      pizhong: this.selectedCar.weight,
      jingzhong: '',
      amount: '',
      img: '',
    }]
    this.accountBook.cars.push({ ...this.selectedCar, datas: arr, persons: [... this.selectedPerson] })
    console.log(this.accountBook);
    this.selectedCar = null;
    this.selectedPerson = [];
  }

  /**
   * 添加车辆弹出框
   */
  async addCarCtrl() {
    const cars = this.storage.get('car') || [];
    const freeCars: Car[] = cars.filter((car: Car) => {
      return !this.accountBook.cars.filter((c: Car) => c.id === car.id).pop();
    });
    const inputs: AlertInput[] = [];
    freeCars.forEach(car => {
      const input: AlertInput = { type: 'radio', label: car.carNo, value: car.id };
      inputs.push(input);
    })
    const alert = await this.alertCtrl.create({
      header: '选择车队',
      inputs: inputs,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: '确定',
          handler: (blah) => {
            console.log(blah);
            if (blah) {
              this.selectedCar = freeCars.filter(car => car.id === blah).pop();
              this.addPersonCtrl();
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }
  /**
   * 添加人员弹出框
   */
  async addPersonCtrl() {
    const persons: Person[] = this.storage.get('person') || [];
    const inputs: AlertInput[] = [];
    persons.forEach(person => {
      const input: AlertInput = { type: 'checkbox', label: person.userName, value: person.id };
      inputs.push(input);
    });
    const alert = await this.alertCtrl.create({
      header: '选择随车人员',
      inputs: inputs,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: '确定',

          handler: (blah: string[]) => {
            if (blah.length) {
              this.selectedPerson = persons.filter(person => blah.includes(person.id));
              this.addCar();
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * 编辑控制器
   */
  editCtrl(column: string, editCarIndex, editRowIndex) {
    this.editCarIndex = editCarIndex;
    this.editRowIndex = editRowIndex;
    switch (column) {
      case 'origin':
        this.editOriginCtrl();
        break;
      default:
        break;
    }
  }

  async editOriginCtrl() {
    const types: Origin[] = this.storage.get('origin');
    const inputs = [];
    types.forEach((type) => {
      const input: AlertInput = { type: 'radio', label: type.originName, value: type.originName };
      inputs.push(input);
    });
    inputs.push({ value: 'edit', type: 'radio', label: '自定义', });
    const alert = await this.alertCtrl.create({
      header: '选择货料来源',
      inputs: inputs,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: '确定',
          handler: (blah: string) => {
            // console.log(blah);
            if (blah === 'edit') {
              this.selfEditCtrl('origin');
            } else {
              this.setCellValue('origin', blah);
            }
          }
        }
      ]
    })
    await alert.present();
  }
  /**
   * 当使用自定义编辑的时候
   * @param type 编辑的列
   */
  async selfEditCtrl(type) {
    const config = { type: '货料类型', origin: '货料来源' };
    const title = config[type];
    const alert = await this.alertCtrl.create({
      header: title,
      inputs: [
        {
          value: '',
          name: type,
          type: 'text',
          placeholder: `请输入${title}`
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: '确定',
          handler: (blah: string) => {
            if(blah[type]){
              this.setCellValue(type, blah[type]);
            }
            return false;
          }
        }
      ]
    });
    await alert.present();
  }
  setCellValue(type,value){
    this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex][type] = value;
  }
}
