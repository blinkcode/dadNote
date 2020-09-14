import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import Compressor from 'compressorjs';

@Injectable({
    providedIn: 'root'
})
export class CameraService {

    constructor(
        private camera: Camera,
        private file: File
    ) { }

    openCamera(): Promise<any> {
        const options: CameraOptions = {
            quality: 80,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
        }
        return new Promise(async (resolve, reject) => {
            try {
                let picStr = await this.camera.getPicture(options);
                picStr = 'data:image/jpeg;base64,' + picStr;
                const content: Blob = this.dataURLtoBlob(picStr);
                const thumbnail: string = await this.createThumbnail(content);
                const imgPath = await this.saveFile(content, new Date().toDateString());
                resolve({ img: imgPath, thumbnail: thumbnail });
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 
     * @param content 文件内容
     * @param dateStr 时间
     * @param isThumbnail 是否是缩略图
     */
    saveFile(content: Blob, dateStr: string, isThumbnail?: boolean): Promise<any> {
        const year = moment(dateStr).year();
        const month = moment(dateStr).month() + 1 + '';
        const date = moment(dateStr).date();
        const root = this.file.externalRootDirectory;
        const path = `${root}dadNote/${year}/${month}/exports/`;
        const random = this.random();
        const fileName = `${year}${month}${date}${random}.jpg`;
        return new Promise((resolve, reject) => {
            this.file.writeFile(path, fileName, content).then(res => {
                console.log('save img success');
                resolve(path + fileName);
            }).catch(err => {
                console.log('save img failed', console.log(err))
                reject(err);
            })
        })
    }

    /**
     * 生成缩略图图片
     * @param content 
     */
    private createThumbnail(content: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            new Compressor(content, {
                quality: 0.2,
                convertSize: Infinity,
                maxWidth: 300,
                success: (result) => this.blobToDataURL(result, resolve),
                error: reject,
            });
        })
    }
    /**
    * base64转blob
    * @param dataurl 图片的base64
    */
    private dataURLtoBlob(dataurl): Blob {
        const arr = dataurl.split(',');
        //注意base64的最后面中括号和引号是不转译的   
        const _arr = arr[1].substring(0, arr[1].length - 2);
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(_arr);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**
     * 
     * @param blob 文件的Blob类型
     * @param callback 转换成功的回调
     */
    private blobToDataURL(blob: Blob, callback) {
        var a = new FileReader();
        a.onload = function (e) { callback(e.target.result); }
        a.readAsDataURL(blob);
    }

    /**
     * 获取6位随机数
     */
    private random() {
        return Math.floor(Math.random() * 1000000);
    }




}
