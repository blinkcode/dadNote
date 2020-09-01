import { CameraService } from './../common/camera/camera.service';
import { FileService } from './../common/file/file.service';
import { Person, AccountBook, Type, Origin } from './../common/model/model';
import { StorageService } from './../common/storage/storage.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Car } from '../common/model/model';
import { AlertInput } from '@ionic/core';
import { ToastService, ModalService } from 'ng-zorro-antd-mobile';
import { v4 as uuidv4 } from 'uuid';
import { Big } from "big.js";
import { isNumber } from 'util';
import * as cloneDeep from "clone-deep";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit, AfterViewInit {
    swipeable = false;
    editable = true;
    activeTabIndex = 0;
    selectedCar: Car = null;
    selectedPerson: Person[] = [];
    accountBook: AccountBook = { id: '', date: '', cars: [] };
    editCarIndex: number;
    editRowIndex: number;
    config: any = {};
    scroll = { x: '1000px', y: '500px' };
    setOfCheckedId = new Set<string>(); // 选中的id
    @ViewChild('tableBox') tableBox: ElementRef;
    @ViewChild('tableHeader') tableHeader: ElementRef;
    constructor(
        private alertCtrl: AlertController,
        private file: FileService,
        private toast: ToastService,
        private camera: CameraService,
        private modal: ModalService,
        private activedRouter: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.activedRouter.queryParamMap.subscribe(params => {
            if (params.has('year') && params.has('month') && params.has('date')) {
                this.editable = false;
                const date = params.get('year') + '-' + params.get('month') + '-' + params.get('date');
                setTimeout(() => {
                    this.file.readConfig().then((config) => {
                        this.config = config;
                        this.readFile(date);
                    })
                }, 10);
            } else {
                this.editable = true;
                setTimeout(() => {
                    this.file.readConfig().then((config: any) => {
                        this.config = config;
                        this.readFile();
                    });
                }, 10);
            }
        })

    }
    ngAfterViewInit(): void {
        this.getResize();

    }

    getResize() {
        const width = this.tableBox.nativeElement.offsetWidth;
        const height = this.tableBox.nativeElement.offsetHeight;
        // 计算高度
        const scrollHeight = height - 45 - 61;
        this.scroll.y = scrollHeight + 'px';
        this.scroll.x = width + 'px';
    }
    /**
     * @description 读取账本文件
     * @author Blink
     * @date 2020-08-29
     * @memberof NoteComponent
     */
    readFile(date?: string) {
        this.toast.loading('正在加载，请稍后', 0)
        this.file.readFile(date || new Date().toISOString()).then((account) => {
            this.toast.hide();
            this.accountBook = account;
        })
    }

    /**
     * 切换车队
     * @param index any
     */
    changeTab(index: any) {
        this.activeTabIndex = index.index;
    }

    /**
     * 添加今日车队
     * 1. 添加车队，
     * 2. 往今日数据中添加新车队信息
     */
    addCar() {
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
            thumbnail: ''
        }]
        this.accountBook.cars.push({ ...this.selectedCar, datas: arr, persons: [... this.selectedPerson] })
        console.log(this.accountBook);
        this.selectedCar = null;
        this.selectedPerson = [];
    }

    /**
     * @description 编辑车辆信息
     * @author Blink
     * @date 2020-08-30
     * @memberof NoteComponent
     */
    async editCar() {
        if (!this.editable) {
            return false;
        }
        const car = this.accountBook.cars[this.activeTabIndex];
        const carIDs = [];
        this.accountBook.cars.map(({ id }) => carIDs.push(id));
        // const unSelectedCar = this.config.car.filter(({ id }) => {
        //     return this.accountBook.cars.filter((car3) => car3.id !== id).length !== 0;
        // });
        const unSelectedCar = [];
        this.config.car.forEach(element => {
            let flag = true;
            const len = this.accountBook.cars.forEach((element1) => {
                if (element1.id === element.id) {
                    flag = false;
                }
            });
            if (flag) {
                unSelectedCar.push(element);
            }
        });
        const car1 = [...unSelectedCar, { id: car.id, carNo: car.carNo }];
        const persons = this.config.person;
        const inputs: AlertInput[] = [];
        car1.forEach(car2 => {
            const input: AlertInput = { type: 'radio', label: car2.carNo, value: car2.id, checked: car.id === car2.id };
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
                            this.editPerson(blah);
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
     * @description 编辑人
     * @author Blink
     * @date 2020-08-30
     * @memberof NoteComponent
     */
    async editPerson(carID: string) {
        const persons = this.config.person;
        const selectedPerson = [];
        this.accountBook.cars[this.activeTabIndex].persons.map(({ id }) => selectedPerson.push(id));
        const inputs: AlertInput[] = []
        persons.forEach(person => {
            const input: AlertInput = { type: 'checkbox', label: person.userName, value: person.id, checked: selectedPerson.includes(person.id) };
            inputs.push(input);
        });
        const alert = await this.alertCtrl.create({
            header: '修改随车人员',
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
                            const car = this.config.car.filter(car => car.id === carID).pop();
                            const person = this.config.person.filter(person => blah.includes(person.id));
                            this.accountBook.cars[this.activeTabIndex].persons = person;
                            this.accountBook.cars[this.activeTabIndex].weight = car.weight;
                            this.accountBook.cars[this.activeTabIndex].id = car.id;
                            this.accountBook.cars[this.activeTabIndex].carNo = car.carNo;
                            const data = cloneDeep(this.accountBook.cars[this.activeTabIndex].datas);
                            data.forEach(element => element.carNo = car.carNo);
                            this.accountBook.cars[this.activeTabIndex].datas = data;
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
     * @description 添加一行数据
     * @author Blink
     * @date 2020-08-30
     * @memberof NoteComponent
     */
    addRow() {
        if (!this.editable) {
            return false;
        }
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
     * @description 删除一行数据
     * @author Blink
     * @date 2020-08-30
     * @memberof NoteComponent
     */
    deleteRow() {
        if (!this.editable) {
            return false;
        }
        if (!this.setOfCheckedId.size) {
            this.toast.info('请勾选一行', 1500);
            return false;
        }
        this.modal.alert('删除', '确定要删除么', [
            { text: '取消', onPress: () => { } },
            {
                text: '删除',
                onPress: () =>
                    new Promise(resolve => {
                        this.accountBook.cars[this.activeTabIndex].datas.forEach((data, i) => {
                            if (this.setOfCheckedId.has(data.id)) {
                                const data = cloneDeep(this.accountBook.cars[this.activeTabIndex].datas);
                                data.splice(i, 1);
                                this.accountBook.cars[this.activeTabIndex].datas = data;
                                resolve();
                            }
                        })
                    }),
                style: {
                    color: '#ffffff',
                    background: '#e94f4f'
                }
            }
        ]);
    }
    /**
     * 添加车辆弹出框
     */
    async addCarCtrl() {
        if (!this.editable) {
            return false;
        }
        const cars = this.config.car;
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
        const persons: Person[] = this.config.person;
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
        if (!this.editable) {
            return false;
        }
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
        const types: Origin[] = this.config.origin;
        const inputs = [];
        types.forEach((type) => {
            const input: AlertInput = { type: 'radio', label: type.originName, value: type.originName };
            inputs.push(input);
        });
        inputs.push({ value: 'edit', type: 'radio', label: '自定义', });
        const alert = await this.alertCtrl.create({
            header: '选择货料来源',
            backdropDismiss: false,
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
        const types: Type[] = this.config.type;
        const inputs = [];
        types.forEach((type) => {
            const input: AlertInput = { type: 'radio', label: type.typeName, value: type.typeName };
            inputs.push(input);
        });
        inputs.push({ value: 'edit', type: 'radio', label: '自定义', });
        const alert = await this.alertCtrl.create({
            header: '选择货料类型',
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
        if (!this.editable) {
            return false;
        }
        const config = { type: '货料类型', origin: '货料来源', maozhong: "毛重", pizhong: '皮重', amount: '料款' };
        const config1 = { type: 'text', origin: 'text', maozhong: "number", pizhong: 'number', amount: 'number' };
        const title = config[type];
        const inputType = config1[type];
        const alert = await this.alertCtrl.create({
            header: title,
            backdropDismiss: false,
            inputs: [
                {
                    value: oldValue || '',
                    name: type,
                    type: inputType,
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
    private setCellValue(type, value) {
        if (!this.editable) {
            return false;
        }
        this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex][type] = value;
        if (type === 'maozhong') {
            const pizhong = this.accountBook.cars[this.editCarIndex].weight;
            const jingzhong = new Big(value).minus(pizhong).toString();
            this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex].jingzhong = jingzhong;
        }
        this.updateEndTime();
    }

    /**
     * 更新回厂时间
     */
    updateEndTime() {
        const time = this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex].endTime;
        if (!time.trim()) {
            this.accountBook.cars[this.editCarIndex].datas[this.editRowIndex].endTime = new Date().toISOString()
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
        if (!this.editable) {
            this.toast.info('只有当天的账本可以修改');
            return false;
        }
        this.editCarIndex = i;
        this.editRowIndex = j;
        this.camera.openCamera().then((img: any) => {
            this.setCellValue('img', img.img)
            this.setCellValue('thumbnail', img.thumbnail);
        })
    }

    deleteImg(i: number, j: number) {
        if (!this.editable) {
            this.toast.info('只有当天的账本可以修改');
            return false;
        }
        this.editCarIndex = i;
        this.editRowIndex = j;
        this.setCellValue('img', '');
        this.setCellValue('thumbnail', '');
    }

    /**
     * @description 保存
     * @author Blink
     * @date 2020-08-25
     * @memberof NoteComponent
     */
    save() {
        if (!this.editable) {
            return false;
        }
        this.file.saveFile(this.accountBook).then(() => {
            this.toast.success('保存成功');
        });
    }

    /**
     * 查看图片
     * @param filePath 文件地址
     */
    seeImg(filePath: string) {
        this.file.seeImg(filePath).catch(err => {
            console.log('打开失败', err);
            this.toast.fail('打开失败');
        })
    }

    /**
     * @description 行勾选变化
     * @author Blink
     * @date 2020-08-30
     * @param {number} id
     * @param {boolean} checked
     * @memberof NoteComponent
     */
    onItemChecked(id: string, checked: boolean): void {
        this.setOfCheckedId.clear();
        if (checked) {
            this.setOfCheckedId.add(id);
        }
    }

    /**
     * 返回今日账本
     */
    backToday() {
        // this.readFile()
        this.router.navigateByUrl('/tabs/note');
    }


}
