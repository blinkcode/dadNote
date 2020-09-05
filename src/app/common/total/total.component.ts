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
    constructor() { }

    ngOnInit() {
        this.init();
    }
    init() {
        this.date = this.accountBook.date;
        // this.cars = this.accountBook.cars;
        this.cars = this.initCar();
        this.outCars = this.initOutCar();
    }
    initCar() {
        const cars = [];
        this.accountBook.cars.forEach(car => {
            const obj = {};
            let jingzhong = '0';
            car.datas.forEach((d) => {
                jingzhong = new Big(d.jingzhong).plus(jingzhong).toString();
            })
            Reflect.set(obj, 'carNo', car.carNo);
            const persons = [];
            car.persons.forEach(person => persons.push(person.userName));
            Reflect.set(obj, 'person', persons.join('、'));
            Reflect.set(obj, 'jingzhong', jingzhong);
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
                cars[index].jingzhong = new Big(cars[index].jingzhong).plus(car.jingzhong).toString();
            } else {
                cars.push({ origin: car.origin, type: car.type, count: 1, jingzhong: car.jingzhong })
                car1.push(car.origin + car.type);
            }
        })
        return cars;
    }

}
