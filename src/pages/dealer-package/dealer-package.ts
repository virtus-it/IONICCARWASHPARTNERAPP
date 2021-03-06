import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, INTERNET_ERR_MSG, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {p} from "@angular/core/src/render3";

@IonicPage()
@Component({
  selector: 'page-dealer-package',
  templateUrl: 'dealer-package.html',
})
export class DealerPackagePage {

  currentSeg: string;
  isUpdate: any = false;
  imgUrl: any;
  list: any;
  type: string = "1";
  page1: boolean = true;
  page2: boolean = false;
  person = {
    "type": "category", "category": "", "priority": "",
    "desp": "", "categoryid": "", imgUrl: ""
  };
  btnText: string = "Save";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private camera: Camera,
              private platform: Platform,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchPackages();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchPackages();
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }

  assetImg() {
    this.imgUrl = 'assets/imgs/img_repairing_service.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerCategoryHomePage');
  }

  ngOnInit() {
    //this.fetchPackages();
  }

  /*update(item) {
    console.log(this.currentSeg);
    this.isUpdate = true;
    this.page1 = !this.page1;
    this.page2 = !this.page2;
    this.person.type = item.type;
    this.person.category = item.category;
    this.person.priority = item.priority;
    this.person.desp = item.category_desc;
    this.person.categoryid = item.categoryid;
    this.person.imgUrl = this.apiService.getImg() + "category_" + item.categoryid + ".png";
    this.btnText = "Update";

    this.ref.detectChanges();
  }*/

  onImageError(item) {
    item.url = "http://placehold.it/500x200";
  }

  fetchPackages() {
    let input = {
      "product": {
        "transtype": "getallpackages",
        "loginid": UtilsProvider.USER_ID,
        "apptype": APP_TYPE
      }
    };


    try {
      this.apiService.postReq(this.apiService.createCategory(), JSON.stringify(input)).then(res => {
        console.log(res);
        if (res && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            element["url"] = this.apiService.getImg() + "category_" + element.categoryid + ".png";
          }
          this.list = res.data;
        }
      }, err => {
        console.log(err);
      })
    }catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  createPackage(event, package1) {

    this.alertUtils.showLog(package1);
    this.alertUtils.showLog('package1 : '+package1);

    if (package1 == '')
      this.alertUtils.showLog('package : create');
    else
      this.alertUtils.showLog('package : update');
    let model = this.modalCtrl.create('DealerPackageCreatePage', {
      from: 'package',
      data: package1,
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          if (data.actionType == 'create')
            this.alertUtils.showToast('Package successfully created');
          else
            this.alertUtils.showToast('Package successfully updated');

          this.fetchPackages();

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

  showPromptForDelete(item) {
    let prompt = this.alertCtrl.create({
      title: 'DELETE PACKAGE',
      message: 'Are you sure. You want delete package?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Sure',
          handler: data => {
            try {

              let input = {
                "product": {
                  "transtype": "deletepackage",
                  "categoryid": item.categoryid,
                  "loginid": UtilsProvider.USER_ID,
                  "apptype": APP_TYPE
                }
              };

              let data = JSON.stringify(input);

              this.alertUtils.showLoading();
              this.apiService.postReq(this.apiService.createCategory(), data).then(res => {
                this.alertUtils.hideLoading();
                this.alertUtils.showLog(res);
                this.alertUtils.showLog(res.data);

                if (res.result == this.alertUtils.RESULT_SUCCESS) {
                  this.alertUtils.showToast('Package successfully deleted');
                  this.fetchPackages();
                } else
                  this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
              }, error => {

              })
            } catch (e) {

            }

          }
        }
      ]
    });
    prompt.present();
  }

}
