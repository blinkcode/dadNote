import { AccountBook } from './../model/model';
import { Component, OnInit, Input } from '@angular/core';
import { Big } from 'big.js';
import { CameraService } from '../camera/camera.service';
import html2canvas from 'html2canvas';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { ToastService } from 'ng-zorro-antd-mobile';


@Component({
	selector: 'app-total',
	templateUrl: './total.component.html',
	styleUrls: ['./total.component.scss'],
})
export class TotalComponent implements OnInit {
	@Input()
	accountBook: AccountBook;
	date = '';
	cars: any[] = [];
	outCars: any[] = [];
	outCars1: any[] = [];
	guozhaCars: any[] = [];
	total = '0';
	carTotal = { total: '0', count: 0 };
	carDetail = []; // 公司车辆拉货详情
	outcarDetail = []; // 外来车辆拉货详情(白)
	outcarDetail1 = []; // 外来车辆拉货详情（夜）
	outCarTotal = { total: '0', count: 0 };
	outCarTotal1 = { total: '0', count: 0 };
	outCarTotal2 = { total: '0', count: 0 };
	guozhaCarTotal = { total: '0', count: 0 };
	constructor(
		private camera: CameraService,
		private socialSharing: SocialSharing,
		private modal: ModalController,
		private toast: ToastService,
		private toastCtrl: ToastController
	) {}

	ngOnInit() {
		this.init();
	}
	init() {
		this.date = this.accountBook.date;
		// this.cars = this.accountBook.cars;
		this.cars = this.initCar();
		this.outCars = this.initOutCar();
		this.outCars1 = this.initOutCar1();
		this.guozhaCars = this.initGuozhaCar();
		this.carTotal = this.getTotalCar();
		this.outCarTotal = this.getOutTotalCar();
		this.guozhaCarTotal = this.getGuozhaTotalCar();
		this.total = this.initTotal();
		this.carDetail = this.getDetailCar();
		this.outcarDetail = this.getOutDetailCar();
		this.outcarDetail1 = this.getOutDetailCar1();
	}
	initCar() {
		const cars = [];
		this.accountBook.cars.forEach((car) => {
			const obj = {};
			let total = '0';
			let totalCount = 0;
			const car1: string[] = [];
			const car2 = [];
			car.datas.forEach((d) => {
				const jingzhong = d.jingzhong.trim();
				if (jingzhong && jingzhong !== '0') {
					const index = car1.indexOf(d.type);
					if (index !== -1) {
						car2[index].count++;
						car2[index].jingzhong = new Big(car2[index].jingzhong)
							.plus(d.jingzhong || '0')
							.toString();
					} else {
						car2.push({
							type: d.type,
							count: 1,
							jingzhong: d.jingzhong || '0',
						});
						car1.push(d.type);
					}
					total = new Big(total).plus(d.jingzhong || '0').toString();
					totalCount++;
				}
			});
			const persons = [];
			car.persons.forEach((person) => persons.push(person.userName));
			obj['carNo'] = car.carNo;
			obj['person'] = persons.join('、');
			obj['total'] = total;
			obj['types'] = car2;
			obj['totalCount'] = totalCount;
			cars.push(obj);
		});
		return cars;
	}
	initOutCar() {
		const cars = [];
		const outCars = this.accountBook.outCars || [];
		const car1: string[] = [];
		outCars.forEach((car) => {
			if (!car.night) {
				const jingzhong = car.jingzhong.trim();
				if (jingzhong && jingzhong !== '0') {
					const index = car1.indexOf(car.origin + car.type);
					if (index !== -1) {
						cars[index].count++;
						cars[index].jingzhong = new Big(cars[index].jingzhong)
							.plus(car.jingzhong || '0')
							.toString();
					} else {
						cars.push({
							origin: car.origin,
							type: car.type,
							count: 1,
							jingzhong: car.jingzhong || '0',
						});
						car1.push(car.origin + car.type);
					}
				}
			}
		});
		return cars;
	}
	// 夜间外来车辆
	initOutCar1() {
		const cars = [];
		const outCars = this.accountBook.outCars || [];
		const car1: string[] = [];
		outCars.forEach((car) => {
			if (car.night) {
				const jingzhong = car.jingzhong.trim();
				if (jingzhong && jingzhong !== '0') {
					const index = car1.indexOf(car.origin + car.type);
					if (index !== -1) {
						cars[index].count++;
						cars[index].jingzhong = new Big(cars[index].jingzhong)
							.plus(car.jingzhong || '0')
							.toString();
					} else {
						cars.push({
							origin: car.origin,
							type: car.type,
							count: 1,
							jingzhong: car.jingzhong || '0',
						});
						car1.push(car.origin + car.type);
					}
				}
			}
		});
		return cars;
	}
	initGuozhaCar() {
		const cars = [];
		const guozhaCars = this.accountBook.guozhaCars || [];
		const car1: string[] = [];
		guozhaCars.forEach((car) => {
			const jingzhong = car.jingzhong.trim();
			if (jingzhong && jingzhong !== '0') {
				const index = car1.indexOf(car.origin + car.type);
				if (index !== -1) {
					cars[index].count++;
					cars[index].jingzhong = new Big(cars[index].jingzhong)
						.plus(car.jingzhong || '0')
						.toString();
				} else {
					cars.push({
						origin: car.origin,
						type: car.type,
						count: 1,
						jingzhong: car.jingzhong || '0',
					});
					car1.push(car.origin + car.type);
				}
			}
		});
		return cars;
	}

	initTotal() {
		let total = '0';
		this.cars.forEach((car) => {
			total = new Big(car.total).plus(total).toString();
		});
		this.outCars.forEach((outCar) => {
			total = new Big(outCar.jingzhong).plus(total).toString();
		});
		return total;
	}

	getTotalCar() {
		let total = { total: '0', count: 0 };
		this.cars.forEach((car) => {
			total.total = new Big(car.total || '0')
				.plus(total.total)
				.toString();
			total.count = total.count + car.totalCount;
		});
		return total;
	}

	getDetailCar() {
		const types = [];
		const detail = [];
		this.cars.forEach((car) => {
			car.types.forEach((type) => {
				const index = types.indexOf(type.type);
				if (index !== -1) {
					const count = detail[index].count;
					const jingzhong = detail[index].jingzhong;
					detail[index].count = new Big(type.count)
						.plus(count)
						.toString();
					detail[index].jingzhong = new Big(type.jingzhong)
						.plus(jingzhong)
						.toString();
				} else {
					types.push(type.type);
					detail.push({
						type: type.type,
						count: type.count,
						jingzhong: type.jingzhong,
					});
				}
			});
		});
		return detail;
	}

	getOutDetailCar() {
		const types = [];
		const detail = [];
		this.outCars.forEach((car) => {
			const index = types.indexOf(car.type);
			if (index !== -1) {
				const count = detail[index].count;
				const jingzhong = detail[index].jingzhong;
				detail[index].count = new Big(car.count).plus(count).toString();
				detail[index].jingzhong = new Big(car.jingzhong)
					.plus(jingzhong)
					.toString();
			} else {
				types.push(car.type);
				detail.push({
					type: car.type,
					count: car.count,
					jingzhong: car.jingzhong,
				});
			}
		});
		this.outCars1.forEach((car) => {
			const index = types.indexOf(car.type);
			if (index !== -1) {
				const count = detail[index].count;
				const jingzhong = detail[index].jingzhong;
				detail[index].count = new Big(car.count).plus(count).toString();
				detail[index].jingzhong = new Big(car.jingzhong)
					.plus(jingzhong)
					.toString();
			} else {
				types.push(car.type);
				detail.push({
					type: car.type,
					count: car.count,
					jingzhong: car.jingzhong,
				});
			}
		});
		return detail;
	}

	getOutDetailCar1() {
		const types = [];
		const detail = [];
		this.outCars1.forEach((car) => {
			const index = types.indexOf(car.type);
			if (index !== -1) {
				const count = detail[index].count;
				const jingzhong = detail[index].jingzhong;
				detail[index].count = new Big(car.count).plus(count).toString();
				detail[index].jingzhong = new Big(car.jingzhong)
					.plus(jingzhong)
					.toString();
			} else {
				types.push(car.type);
				detail.push({
					type: car.type,
					count: car.count,
					jingzhong: car.jingzhong,
				});
			}
		});
		return detail;
	}

	getOutTotalCar() {
		let total = { total: '0', count: 0 };
		this.outCars.forEach((car) => {
			const j = new Big(car.jingzhong || '0');
			total.total = j.plus(total.total).toString();
			total.count = total.count + car.count;
			this.outCarTotal1.total = new Big(car.jingzhong || '0')
				.plus(this.outCarTotal1.total)
				.toString();
			this.outCarTotal1.count = this.outCarTotal1.count + car.count;
		});
		this.outCars1.forEach((car) => {
			const j = new Big(car.jingzhong || '0');
			total.total = new Big(car.jingzhong || '0')
				.plus(total.total)
				.toString();
			total.count = total.count + car.count;
			this.outCarTotal2.total = j
				.plus(this.outCarTotal2.total)
				.toString();
			this.outCarTotal2.count = this.outCarTotal2.count + car.count;
		});
		return total;
	}

	getGuozhaTotalCar() {
		let total = { total: '0', count: 0 };
		this.guozhaCars.forEach((car) => {
			total.total = new Big(car.jingzhong || '0')
				.plus(total.total)
				.toString();
			total.count = total.count + car.count;
		});
		return total;
	}

	/**
	 * 分享
	 */
	share() {
		const element = document.getElementById('content_box');
		this.modal.getTop().then((modal: any) => {
			html2canvas(modal).then((canvas) => {
				canvas.toBlob((content) => {
					this.camera
						.saveFile(content, new Date().toDateString())
						.then((path: string) => {
							this.socialSharing
								.share(null, null, path, null)
								.then(
									() => {},
									(err) => console.log('分享失败', err)
								);
						});
				});
			});
		});
	}
	/**
	 * 复制文字
	 */
	copyText() {
		const copyToClipboard = str => {
			const el = document.createElement('textarea');
			el.value = str;
			el.setAttribute('readonly', '');
			el.style.position = 'absolute';
			el.style.left = '-9999px';
			document.body.appendChild(el);
			const selected =
			  document.getSelection().rangeCount > 0
				? document.getSelection().getRangeAt(0)
				: false;
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
			if (selected) {
			  document.getSelection().removeAllRanges();
			  document.getSelection().addRange(selected);
			}
		};
		const date = moment(this.accountBook.date).format('YYYY-MM-DD');
		let day = '';
		let night = '';
		this.outCars.forEach((car) => {
			day += `
	${car.origin}-${car.type}-${car.jingzhong}-${car.count}车`;
		});
		this.outCars1.forEach((car) => {
			night += `
	${car.origin}-${car.type}-${car.jingzhong}-${car.count}车`;
		});
		const msg = `
${date}:

车队：拉料-${this.carTotal.total}

外来-白班：${day}
白班小计: ${this.outCarTotal1.total}

外来-夜班:${night}
夜班小计: ${this.outCarTotal2.total}

今日统计: ${this.total}`;
		copyToClipboard(msg);
		this.toastCtrl.create({
			message:'复制成功',
			duration: 1000,
			position: 'middle'
		}).then(toast => {
			toast.present();
		})
	}
}
