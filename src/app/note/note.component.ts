import { CameraService } from './../common/camera/camera.service';
import { FileService } from './../common/file/file.service';
import { Person, AccountBook, Type, Origin } from './../common/model/model';
import { StorageService } from './../common/storage/storage.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Car } from '../common/model/model';
import { AlertInput } from '@ionic/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import { v4 as uuidv4 } from 'uuid';
import { Big } from "big.js";
import { isNumber } from 'util';
import * as cloneDeep from "clone-deep";

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
    private toast: ToastService,
    private camera: CameraService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.readFile();
    });
  }
  readFile() {
    this.toast.loading('正在加载，请稍后')
    this.file.readFile(new Date().toISOString()).then((account) => {
      this.toast.hide();
      this.accountBook = account;
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
   * 切换车队
   * @param index any
   */
  changeTab(index: any){
    this.activeTabIndex = index.index;
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
    }]
    this.accountBook.cars.push({ ...this.selectedCar, datas: arr, persons: [... this.selectedPerson] })
    console.log(this.accountBook);
    this.selectedCar = null;
    this.selectedPerson = [];
  }

  addRow(){
    const car = this.accountBook.cars[this.activeTabIndex];
    const row = {
      id: uuidv4(),
      carNo: car.carNo,
      startTime: '',
      endTime: '',
      origin: '',
      type: '',
      maozhong: '',
      pizhong: car.weight,
      jingzhong: '',
      amount: '',
      img: '',
    }
    const datas = cloneDeep(this.accountBook.cars[this.activeTabIndex].datas);
    datas.push(row)
    this.accountBook.cars[this.activeTabIndex].datas = datas;
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
      backdropDismiss: false,
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
      backdropDismiss: false,
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
      case 'type':
        this.editTypeCtrl();
        break;
      default:
        break;
    }
  }

  /**
   * 来源编辑
   */
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
      backdropDismiss: true,
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
            if (blah === 'edit') {
              this.selfEditCtrl('origin');
            } else if (blah) {
              this.setCellValue('origin', blah);
            } else {
              return false;
            }
          }
        }
      ]
    })
    await alert.present();
  }

  /**
   * 类型编辑
   */
  async editTypeCtrl() {
    const types: Type[] = this.storage.get('type');
    const inputs = [];
    types.forEach((type) => {
      const input: AlertInput = { type: 'radio', label: type.typeName, value: type.typeName };
      inputs.push(input);
    });
    inputs.push({ value: 'edit', type: 'radio', label: '自定义', });
    const alert = await this.alertCtrl.create({
      header: '选择货料类型',
      inputs: inputs,
      backdropDismiss: true,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: '确定',
          handler: (blah: string) => {
            if (blah === 'edit') {
              this.selfEditCtrl('type');
            } else {
              this.setCellValue('type', blah);
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
  async selfEditCtrl(type, i?: number, j?: number, oldValue?: string) {
    if (isNumber(i)) {
      this.editCarIndex = i;
    }
    if (isNumber(j)) {
      this.editRowIndex = j;
    }
    const config = { type: '货料类型', origin: '货料来源', maozhong: "毛重", pizhong: '皮重', amount: '料款' };
    const config1 = { type: 'text', origin: 'text', maozhong: "number", pizhong: 'number', amount: 'number' };
    const title = config[type];
    const inputType = config1[type];
    const alert = await this.alertCtrl.create({
      header: title,
      backdropDismiss: true,
      inputs: [
        {
          value: oldValue || '',
          name: type,
          type: inputType,
          placeholder: `请输入${title}`,
          attributes: {
            autofocus: true
          },
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
            if (blah[type]) {
              this.setCellValue(type, blah[type]);
            } else {
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }
  setCellValue(type, value) {
    this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex][type] = value;
    if (type === 'maozhong') {
      const pizhong = this.accountBook.cars[this.editCarIndex].weight;
      const jingzhong = new Big(value).minus(pizhong).toString();
      this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex].jingzhong = jingzhong;
    }
  }
  /**
   * @description 打开摄像头
   * @author Blink
   * @date 2020-08-25
   * @param {number} i
   * @param {number} j
   * @memberof NoteComponent
   */
  openCamera(i: number, j: number) {
    this.editCarIndex = i;
    this.editRowIndex = j;
    this.setCellValue('img', '123123');
    this.camera.openCamera().then((img) => {
      this.setCellValue('img', img);
    })
  }

  deleteImg(i: number, j: number) {
    this.editCarIndex = i;
    this.editRowIndex = j;
    this.setCellValue('img', '');
  }

  /**
   * @description 保存
   * @author Blink
   * @date 2020-08-25
   * @memberof NoteComponent
   */
  save() {
    this.file.saveFile(this.accountBook).then(() => {
      this.toast.success('保存成功');
    });
  }

  export (){
    const loading = this.toast.loading('正在导出')
    this.file.exportFileByDate('2020-08-25').then((res) => {
      this.toast.hide()
      this.toast.success('导出成功');
    }).catch((err) => {
      console.log(err);
      this.toast.fail('导出失败');
    })
  }

  async getImgBase64(img){
    if(img.trim()){
      const result = await this.file.readImgAsBase64(img);
      console.log(result);
      return result;
    } else {
      console.log(123);
      return img;
    }
  }
}
