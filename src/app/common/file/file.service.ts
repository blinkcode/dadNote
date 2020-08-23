import { AccountBook } from './../model/model';
import { Injectable } from '@angular/core';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { reject } from 'q';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  root = '';
  path = '';
  filePath
  fileName = '';
  constructor(
    private file: File
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
  }
  /**
   * 创建文件夹
   * @param basePath 基础路径
   * @param dir 文件夹
   */
  private createDir(basePath: string, dir: string): Promise<string> {
    return new Promise((resolve) => {
      this.file.checkDir(basePath, dir).then((flag) => {
        if (flag) {
          resolve(`${basePath}/${dir}`);
        } else {
          this.file.createDir(basePath, dir, true).then(() => {
            resolve(`${basePath}/${dir}`);
          }).catch((err)=>console.log(err));
        }
      }).catch((err)=>console.log(err))
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
        if (!flag) {
          const json = { id: '', date: '', cars: [], persons: [], datas: [] }
          this.file.writeFile(path, fileName, JSON.stringify(json, null, 4)).then(() => {
            resolve(`${path}/${fileName}`);
          }).catch((err)=>console.log(err))
        } else {
          resolve(`${path}/${fileName}`)
        }
      }).catch((err)=>console.log(err))
    })
  }

  /**
   * 读取当天的账本
   */
  readFile(): Promise<AccountBook> {
    return new Promise(async (resolve) => {
      if (this.filePath) {
        this.file.readAsText(this.path, this.fileName).then((res) => {
          resolve(JSON.parse(res));
        }).catch((err)=>console.log(err))
      } else {
        setTimeout(() => {
          this.file.readAsText(this.path, this.fileName).then((res) => {
            resolve(JSON.parse(res));
          }).catch((err)=>console.log(err))
        }, 3000);
      }
    })
  }

  /**
   * 
   */
  saveFile(note: AccountBook) {
    return this.file.writeExistingFile(this.path, this.fileName, JSON.stringify(note, null, 4));
  }

}
