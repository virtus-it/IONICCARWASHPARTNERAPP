
import { Injectable } from '@angular/core';
import {UtilsProvider} from "../utils/utils";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ActionSheetController, AlertController, Platform} from "ionic-angular";

@Injectable()
export class ImageUtilsProvider {

  constructor(private alertUtils: UtilsProvider,
              private camera: Camera,
              private alertCtrl: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private platform: Platform) {
    alertUtils.showLog('Hello ImageUtilsProvider Provider');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose or take a picture',
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.getImage(false);
          }
        },
        {
          text: 'Choose pictures',
          handler: () => {
            this.getImage(true);
          }
        }
      ]
    });
    actionSheet.present();
  }

  private getImage(isPickGalleryImage) {
    let sourceType = this.camera.PictureSourceType.CAMERA;
    if(isPickGalleryImage)
      sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;

    let options: CameraOptions;
    if (this.platform.is('android')) {
      options = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: false,
      }
    } else if (this.platform.is('ios')) {
      options = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: sourceType,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
      }
    }
    console.log('taking photo');
    return this.camera.getPicture(options);
  }

}
