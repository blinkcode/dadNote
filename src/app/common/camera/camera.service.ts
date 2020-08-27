import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(
    private camera: Camera,
  ) { }

  openCamera(): Promise<string> {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    return new Promise((resolve, reject) => {
      this.camera.getPicture(options).then((url) => {
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log('图片', url);
        resolve(url);
      }, reject);
    })
  }

}
