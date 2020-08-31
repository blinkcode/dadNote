import { FileService } from './../file/file.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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
  @Input()
  config: any;
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
    private modal: ModalService,
    private toast: ToastService,
    private alertCtrl: AlertController,
    private file: FileService
  ) { }

  ngOnInit() {
    // this.init();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['config'].currentValue) {
      this.lists = this.config[this.id];
    }
  }

  init() {
    // this.file.readConfig().then((config: any) => {
    //   this.config = config;
    //   this.lists = this.config[this.id];
    // })
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
      backdropDismiss: false,
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
              this.config[this.id].push({ id: id1, ...blah });
            } else {
              const origin = this.lists[this.openIndex];
              this.config[this.id][this.openIndex] = { ...origin, ...blah };
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
      backdropDismiss: false,
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
              this.config[this.id].push({ id: id1, ...blah })
            } else {
              const origin = this.lists[this.openIndex];
              this.config[this.id][this.openIndex] = { ...origin, ...blah };
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
      backdropDismiss: false,
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
              this.config[this.id].push({ id: id1, ...blah })
            } else {
              const origin = this.lists[this.openIndex];
              this.config[this.id][this.openIndex] = { ...origin, ...blah };
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
      backdropDismiss: false,
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
              this.config[this.id].push({ id: id1, ...blah });
            } else {
              const origin = this.lists[this.openIndex];
              this.config[this.id][this.openIndex] = { ...origin, ...blah };
            }
            this.save();
          }
        }
      ]
    });
    await alert.present();
  }

  save() {
    this.file.saveConfig(this.config).then(() => {
      this.toast.info('保存成功', 1000);
    })
  }
  open(index) {
    this.openIndex = index;
  }

  itemClick(index) {
    this.openIndex = index;
    this.modal.operation([
      {
        text: '修改', onPress: () => {
          this.add(true);
          this.modal.close();
        }
      },
      {
        text: '删除', onPress: () => {
          // this.modal.close();
          setTimeout(() => {
            this.delete();
          },400);
        }
      },
      { text: '取消', onPress: () => { } }
    ]);
  }
  delete() {
    this.modal.alert('删除', '确定要删除么', [
      { text: '取消', onPress: () => { } },
      {
        text: '删除',
        onPress: () =>
          new Promise(resolve => {
            this.config[this.id].splice(this.openIndex, 1);
            this.file.saveConfig(this.config).then(() => {
              this.toast.info('删除成功', 2000);
              resolve();
            })
          }),
        style: {
          color: '#ffffff',
          background: '#e94f4f'
        }
      }
    ]);

  }

}
