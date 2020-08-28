import { StorageService } from './../storage/storage.service';
import { AccountBook } from './../model/model';
import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { reject } from 'q';
import { DeviceService } from '../device/device.service';
import { ToastService } from 'ng-zorro-antd-mobile';
import { v4 as uuidv4 } from 'uuid';
import { FileOpener } from "@ionic-native/file-opener/ngx";
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  root = '';
  path = '';
  filePath = '';
  fileName = '';
  constructor(
    private file: File,
    private storage: StorageService,
    private device: DeviceService,
    private fileOpener: FileOpener
  ) { }
  /**
   * 检查必须的文件夹是不是存在
   * 文件夹路径为${root}/dataNote/${year}/${month}/datas
   * 图片和导出地址: ${root}/dataNote/${year}/${month}/exports
   */
  async init() {
    const root = this.file.externalRootDirectory;
    const year = moment().year() + '';
    const month = moment().month() + 1 + '';
    const date = moment().date() + '';
    const dadNote = await this.createDir(root, 'dadNote');
    // const note = await this.createDir(dadNote, 'note');
    const year1 = await this.createDir(dadNote, year);
    const month1 = await this.createDir(year1, month);
    const datas = await this.createDir(month1, 'datas');
    await this.createDir(month1,'exports');
    this.filePath = await this.createFile(datas, `${date}.json`);
    this.fileName = `${date}.json`;
    // console.log(this.path, this.filePath, this.fileName);
  }
  /**
   * 创建文件夹
   * @param basePath 基础路径
   * @param dir 文件夹
   */
  private createDir(basePath: string, dir: string): Promise<string> {
    return new Promise((resolve) => {
      this.file.checkDir(basePath, dir).then((flag) => {
        resolve(`${basePath}${dir}/`);
      }).catch(() => {
        this.file.createDir(basePath, dir, true).then(() => {
          resolve(`${basePath}${dir}/`);
        }).catch((err) => console.log(err));
      })
    })
  }

  /**
   * 创建文件
   * @param path 
   * @param fileName 
   */
  private createFile(path, fileName): Promise<string> {
    return new Promise((resolve) => {
      this.file.checkFile(path, fileName).then((flag) => {
        resolve(`${path}${fileName}`)
      }).catch(() => {
        const json = { id: uuidv4, date: new Date().toDateString(), cars: [] }
        this.file.writeFile(path, fileName, JSON.stringify(json, null, 4)).then(() => {
          resolve(`${path}${fileName}`);
        }).catch((err) => console.log(err))
      })
    })
  }

  /**
   * 读取当天的账本
   */
  readFile(dateStr: string): Promise<AccountBook> {
    if (!this.device.isMobile()) {
      return this.readFileByWeb();
    }
    const year = moment(dateStr).years();
    const month = moment(dateStr).month() + 1 + '';
    const date = moment(dateStr).date();
    const root = this.file.externalRootDirectory;
    const path = `${root}dadNote/${year}/${month}/datas/`;
    return new Promise(async (resolve) => {
      if (this.filePath) {
        this.file.readAsText(path, `${date}.json`).then((res) => {
          resolve(JSON.parse(res));
        }).catch((err) => console.log(err))
      } else {
        setTimeout(() => {
          this.file.readAsText(path, `${date}.json`).then((res) => {
            resolve(JSON.parse(res));
          }).catch((err) => console.log(err))
        }, 3000);
      }
    })
  }

  private readFileByWeb(): Promise<AccountBook> {
    return new Promise((resolve) => {
      const date = new Date().toDateString();
      const note = this.storage.get(date) || { id: '', date: '', cars: [] };
      resolve(note);
    })
  }

  /**
   * 
   */
  saveFile(note: AccountBook): Promise<any> {
    if (!this.device.isMobile()) {
      return this.saveFileByWeb(note);
    }
    const year = moment().years();
    const month = moment().month() + 1 + '';
    const date = moment().date();
    const root = this.file.externalRootDirectory;
    const path = `${root}dadNote/${year}/${month}/datas/`;
    return this.file.writeExistingFile(path, `${date}.json`, JSON.stringify(note, null, 4));
  }

  private saveFileByWeb(note: AccountBook): Promise<boolean> {
    return new Promise((resolve) => {
      const date = new Date().toDateString();
      this.storage.set(date, note);
      resolve(true);
    })
  }

  /**
   * @description 导出xlsx文件
   * @author Blink
   * @date 2020-08-25
   * @param {AccountBook} accountBook
   * @memberof FileService
   */
  exportFile(accountBook: AccountBook) {
    const header = ['车队', '出发时间', '回厂时间', '货料来源', '货料种类', '皮重', '毛重', '净重', '料款'];
    const sheets = [];
    accountBook.cars.forEach((car) => {
      const data = [header];
      car.datas.forEach((d) => {
        const a = [d.carNo, d.startTime, d.endTime, d.origin, d.type, d.pizhong, d.maozhong, d.jingzhong, d.amount];
        data.push(a);
      })
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      sheets.push(ws);
    });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    sheets.forEach((sheet, i) => XLSX.utils.book_append_sheet(wb, sheet, accountBook.cars[i].carNo));
    const date = moment(accountBook.date).format('YYYY-MM-DD[-过磅单.xlsx]');
    /* save to file */
    XLSX.writeFile(wb, `${date}.xlsx`);
    // const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // let blob = new Blob([wbout], {type: 'application/octet-stream'});
    // this.file.writeFile(f, filename, blob, {replace: true});
  }

  /**
   * @description 导出过磅单
   * @author Blink
   * @date 2020-08-25
   * @param {string} date
   * @memberof FileService
   */
  exportFileByDate(dateStr: string) {
    const year = moment(dateStr).years();
    const month = moment(dateStr).month() + 1 + '';
    const date = moment(dateStr).date();
    const root = this.file.externalRootDirectory;
    const path = `${root}dadNote/${year}/${month}/exports/`;
    return new Promise((resolve, reject) => {
      this.readFile(dateStr).then((res: AccountBook) => {
        const header = ['车队', '出发时间', '回厂时间', '货料来源', '货料种类', '皮重', '毛重', '净重', '料款'];
        const sheets = [];
        res.cars.forEach((car) => {
          const data = [header];
          car.datas.forEach((d) => {
            const a = [d.carNo, d.startTime, d.endTime, d.origin, d.type, d.pizhong, d.maozhong, d.jingzhong, d.amount];
            data.push(a);
          })
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
          sheets.push(ws);
        });
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        sheets.forEach((sheet, i) => XLSX.utils.book_append_sheet(wb, sheet, res.cars[i].carNo));
        const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        let blob = new Blob([wbout], { type: 'application/octet-stream' });
        const date = moment(res.date).format('YYYY-MM-DD[-过磅单.xlsx]');
        this.file.writeFile(path, date, blob, { replace: true }).then((res) => {
          resolve(res);
        }).catch(reject)
      }).catch(reject)
    })
  }

  readImgAsBase64(filePath: string): Promise<any>{
    const fileName = filePath.split('/').pop();
    const path = filePath.split(fileName).shift();
    console.log(path,fileName);
    return  this.file.readAsDataURL(path, fileName);
  }

  /**
   * 查看图片
   * @param filePath 图片地址1
   */
  seeImg(filePath: string){
    return this.fileOpener.open(filePath, 'image/jpeg');
  }

}
