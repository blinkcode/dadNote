import { StorageService } from './../storage/storage.service';
import { AccountBook } from './../model/model';
import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { reject } from 'q';
import { DeviceService } from '../device/device.service';
import { ToastService } from 'ng-zorro-antd-mobile';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  root = '';
  path = '';
  filePath
  fileName = '';
  constructor(
    private file: File,
    private storage: StorageService,
    private device: DeviceService,
  ) { }
  /**
   * 必须的文件夹是不是存在
   * 文件夹路径为${root}/dataNote/note/${year}/${month}
   */
  async init() {
    const root = this.file.externalRootDirectory;
    console.log(root);
    const year = new Date().getFullYear() + '';
    const month = new Date().getMonth() + 1 + '';
    const date = new Date().getDate() + '';
    const dadNote = await this.createDir(root, 'dadNote');
    const note = await this.createDir(dadNote, 'note');
    const year1 = await this.createDir(note, year);
    this.path = await this.createDir(year1, month);
    this.filePath = await this.createFile(this.path, `${date}.json`);
    this.fileName = `${date}.json`;
    console.log(this.path, this.filePath, this.fileName);
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
        const json = { id: '', date: '', cars: [] }
        this.file.writeFile(path, fileName, JSON.stringify(json, null, 4)).then(() => {
          resolve(`${path}${fileName}`);
        }).catch((err) => console.log(err))
      })
    })
  }

  /**
   * 读取当天的账本
   */
  readFile(): Promise<AccountBook> {
    if(!this.device.isMobile()){
      return this.readFileByWeb();
    }
    return new Promise(async (resolve) => {
      if (this.filePath) {
        this.file.readAsText(this.path, this.fileName).then((res) => {
          resolve(JSON.parse(res));
        }).catch((err) => console.log(err))
      } else {
        setTimeout(() => {
          this.file.readAsText(this.path, this.fileName).then((res) => {
            resolve(JSON.parse(res));
          }).catch((err) => console.log(err))
        }, 3000);
      }
    })
  }

  private readFileByWeb(): Promise<AccountBook>{
    return new Promise((resolve) => {
      const date = new Date().toDateString();
      const note = this.storage.get(date) || { id: '', date: '', cars: [] };
      resolve(note);
    })
  }

  /**
   * 
   */
  saveFile(note: AccountBook) {
    if(!this.device.isMobile()){
      return this.saveFileByWeb(note);
    }
    return this.file.writeExistingFile(this.path, this.fileName, JSON.stringify(note, null, 4));
  }

  private saveFileByWeb(note: AccountBook){
    return new Promise((resolve) => {
      const date = new Date().toDateString();
      this.storage.set(date, note);
    })
  }

}
