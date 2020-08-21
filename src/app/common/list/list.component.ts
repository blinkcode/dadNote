import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { ModalService, ToastService } from 'ng-zorro-antd-mobile';
import { AlertController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input()
  id = '';
  lists: any[] = [];
  openIndex: 0;
  right = [
    {
      text: '修改',
      onPress: () => this.add(true),
      style: { color: 'white', 'background-color': '#108ee9' }
    },
    {
      text: '删除',
      onPress: () => this.delete(),
      style: { color: 'white', 'background-color': '#f4333c' }
    }
  ];
  constructor(
    private storage: StorageService,
    private modal: ModalService,
    private toast: ToastService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.lists = this.storage.get(this.id) || [];
  }
  add(edit?: boolean) {
    switch (this.id) {
      case 'car':
        this.addCarCtrl(edit);
        break;
      case 'person':
        this.addPersonCtrl(edit);
        break;
      case 'type':
        this.addTypeCtrl(edit);
        break;
      case 'origin':
        this.addOriginCtrl(edit);
        break;
      default:
        break;
    }
  }

  async addCarCtrl(edit?: boolean) {
    const alert = await this.alertCtrl.create({
      header: '车辆信息!',
      message: '请输入车牌号和皮重',
      inputs: [
        {
          value: edit ? this.lists[this.openIndex]['carNo'] : '',
          name: 'carNo',
          type: 'text',
          placeholder: '鲁A12345'
        },
        {
          value: edit ? this.lists[this.openIndex]['weight'] : '',
          name: 'weight',
          type: 'number',
          min: 0,
          placeholder: '请输入车重,默认单位为吨'
        },
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: '确定',
          handler: (blah) => {
            if (!edit) {
              const id1 = uuidv4();
              this.lists.push({ id: id1, ...blah });
            } else {
              const origin = this.lists[this.openIndex];
              this.lists[this.openIndex] = { ...origin, ...blah };
            }
            this.save();
          }
        }
      ]
    });
    await alert.present();
  }
  async addPersonCtrl(edit?: boolean) {
    const alert = await this.alertCtrl.create({
      header: '人员信息!',
      message: '请输入人名',
      inputs: [
        {
          value: edit ? this.lists[this.openIndex]['userName'] : '',
          name: 'userName',
          type: 'text',
          placeholder: '李洪亮'
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
          handler: (blah) => {
            if (!edit) {
              const id1 = uuidv4();
              this.lists.push({ id: id1, ...blah });
            } else {
              const origin = this.lists[this.openIndex];
              this.lists[this.openIndex] = { ...origin, ...blah };
            }
            this.save();
          }
        }
      ]
    });
    await alert.present();
  }
  async addTypeCtrl(edit?: boolean) {
    const alert = await this.alertCtrl.create({
      header: '货料种类',
      message: '请输入货料种类',
      inputs: [
        {
          value: edit ? this.lists[this.openIndex]['typeName'] : '',
          name: 'typeName',
          type: 'text',
          placeholder: '苹果'
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
          handler: (blah) => {
            if (!edit) {
              const id1 = uuidv4();
              this.lists.push({ id: id1, ...blah });
            } else {
              const origin = this.lists[this.openIndex];
              this.lists[this.openIndex] = { ...origin, ...blah };
            }
            this.save();
          }
        }
      ]
    });
    await alert.present();
  }
  async addOriginCtrl(edit?: boolean) {
    const alert = await this.alertCtrl.create({
      header: '货料来源',
      message: '请输入货料来源',
      inputs: [
        {
          value: edit ? this.lists[this.openIndex]['originName'] : '',
          name: 'originName',
          type: 'text',
          placeholder: '大自然公司'
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
          handler: (blah) => {
            if (!edit) {
              const id1 = uuidv4();
              this.lists.push({ id: id1, ...blah });
            } else {
              const origin = this.lists[this.openIndex];
              this.lists[this.openIndex] = { ...origin, ...blah };
            }
            this.save();
          }
        }
      ]
    });
    await alert.present();
  }

  save() {
    this.storage.set(this.id, this.lists);
    this.toast.info('保存成功', 1000);
  }
  open(index) {
    this.openIndex = index;
  }
  edit() {

  }
  delete() {
    this.modal.alert('删除', '确定要删除么', [
      { text: '取消', onPress: () => { } },
      {
        text: '删除',
        onPress: () =>
          new Promise(resolve => {
            this.lists.splice(this.openIndex, 1);
            this.storage.set(this.id, this.lists);
            setTimeout(() => {
              resolve();
              this.toast.info('删除成功', 2000);
            }, 100);
          }),
        style: {
          color: '#ffffff',
          background: '#108ee9'
        }
      }
    ]);

  }

}
