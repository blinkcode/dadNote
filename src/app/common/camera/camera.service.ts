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
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    return new Promise((resolve, reject) => {
      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        resolve(base64Image);
      }, reject);
    })
  }

}
