import { AccountBook, AccountCar } from './../model/model';
import { Component, OnInit, Input } from '@angular/core';
import { Big } from "big.js";

@Component({
    selector: 'app-total',
    templateUrl: './total.component.html',
    styleUrls: ['./total.component.scss'],
})
export class TotalComponent implements OnInit {

    @Input()
    accountBook: AccountBook
    date = '';
    cars: any[] = [];
    outCars: any[] = [];
    total = '0';
    carTotal = { total: '0', count: 0 };
    outCarTotal = { total: '0', count: 0 };
    constructor() { }

    ngOnInit() {
        this.init();
    }
    init() {
        this.date = this.accountBook.date;
        // this.cars = this.accountBook.cars;
        this.cars = this.initCar();
        this.outCars = this.initOutCar();
        this.carTotal = this.getTotalCar();
        this.outCarTotal = this.getOutTotalCar();
        this.total = this.initTotal();
    }
    initCar() {
        const cars = [];
        this.accountBook.cars.forEach(car => {
            const obj = {};
            let total = '0';
            let totalCount = 0;
            const car1: string[] = [];
            const car2 = [];
            car.datas.forEach((d) => {
                const index = car1.indexOf(d.type)
                if (index !== -1) {
                    car2[index].count++;
                    car2[index].jingzhong = new Big(car2[index].jingzhong).plus(d.jingzhong || '0').toString();
                } else {
                    car2.push({ type: d.type, count: 1, jingzhong: d.jingzhong || '0' })
                    car1.push(d.type);
                }
                total = new Big(total).plus(d.jingzhong || '0').toString();
                totalCount++;
            })
            const persons = [];
            car.persons.forEach(person => persons.push(person.userName));
            Reflect.set(obj, 'carNo', car.carNo);
            Reflect.set(obj, 'person', persons.join('、'));
            Reflect.set(obj, 'total', total);
            Reflect.set(obj, 'types', car2),
                Reflect.set(obj, 'totalCount', totalCount)
            cars.push(obj);
        })
        return cars;
    }
    initOutCar() {
        const cars = [];
        const outCars = this.accountBook.outCars || [];
        const car1: string[] = [];
        outCars.forEach(car => {
            const index = car1.indexOf(car.origin + car.type)
            if (index !== -1) {
                cars[index].count++;
                cars[index].jingzhong = new Big(cars[index].jingzhong).plus(car.jingzhong || '0').toString();
            } else {
                cars.push({ origin: car.origin, type: car.type, count: 1, jingzhong: car.jingzhong || '0' })
                car1.push(car.origin + car.type);
            }
        });
        return cars;
    }

    initTotal() {
        let total = '0';
        this.cars.forEach(car => {
            total = new Big(car.total).plus(total).toString();
        });
        this.outCars.forEach(outCar => {
            total = new Big(outCar.jingzhong).plus(total).toString();
        });
        return total;
    }

    getTotalCar() {
        let total = { total: '0', count: 0 };
        this.cars.forEach(car => {
            total.total = new Big(car.total || '0').plus(total.total).toString();
            total.count = total.count + car.totalCount;
        });
        return total;
    }

    getOutTotalCar(){
        let total = { total: '0', count: 0 };
        this.outCars.forEach(car => {
            total.total = new Big(car.jingzhong || '0').plus(total.total).toString();
            total.count = total.count + car.count;
        });
        return total;
    }
}
