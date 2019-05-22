import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";
import {Camera, CameraOptions} from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-dealer-products-create',
  templateUrl: 'dealer-products-create.html',
})
export class DealerProductsCreatePage {

  imgUrl: any;
  showProgress: any;
  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  isUpdate: boolean = true;
  b64Image: any;

  categorySelected: boolean = false;
  categoryList: string[];
  categoryProductsList: string[];
  // vechicleTypes = [];
  priorityList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  categoryPos: number = -1;

  input = {
    category: "", categoryid: "", currency: "aed", brandname: "", pname: "", ptype: "", pcost: "",
    minorderqty: "", priority: "1", iscanreturnable: false, servicecharge: "", discount: "", id: [],
    expressdeliverycharges: "", isauthorized: false
  };
  output = {"result": "", "actionType": "", "data": ""};
  showToast: boolean = true;
  private categoryitem: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private camera: Camera,
              private platform: Platform,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private formBuilder: FormBuilder) {

    this.user = navParams.get('item');
    this.categoryitem = navParams.get('categoryitem');

    alertUtils.showLog(this.user);
    alertUtils.showLog(this.categoryitem);
    alertUtils.showLog("this.user :" + this.user);


    if (this.user == '') {
      this.isUpdate = false;
      this.pageTitle = 'CREATE SERVICE';
      this.buttonTitle = 'CREATE';
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT SERVICE';
      this.buttonTitle = 'UPDATE';

      //updating values
      this.input.pname = this.user.pname;
      this.input.ptype = this.user.ptype;
      this.input.pcost = JSON.stringify(this.user.pcost);
      this.input.brandname = this.user.brandname;
      this.input.categoryid = this.user.categoryid;
      this.input.category = this.user.category;
      this.input.discount = this.user.discount;
      this.input.priority = JSON.stringify(this.user.priority);
      this.input.iscanreturnable = this.user.iscanreturnable;
      this.input.isauthorized = this.user.isauthorized;
      // this.input.id = JSON.parse(this.user.vechiclesid);

      this.imgUrl = this.apiService.getImg() + 'product_' + this.user.productid + '.png'
    }

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE;
            this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
            this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;

            //initial call
            // this.getCategories();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE;
            this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
            this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;

            //initial call
            // this.getCategories();
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

  isAuthorized() {
    this.input.isauthorized = !this.input.isauthorized;
  }

  isCansReturnble() {
    this.input.iscanreturnable = !this.input.iscanreturnable;
  }

  updateCategoryDetails(event, category) {
    this.input.category = category.category;
    this.input.categoryid = category.categoryid;
    this.categorySelected = true;

    this.getCategoryProducts(category);
  }

  updateProductDetails($event, product) {
    this.input.pname = product.pname;
    this.input.brandname = product.pname;
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doValidation() {

    this.alertUtils.showLog(JSON.stringify(this.input));

    // if (this.alertUtils.validateText(this.input.category, 'Category', 2, 50)) {
      if (this.alertUtils.validateText(this.input.pname, 'Service Name', 3, 50)) {
        if (this.alertUtils.validateText(this.input.ptype, "Service Type", 1, 50)) {
          if (this.alertUtils.validateText(this.input.currency, "Currency", 3, 20)) {
            if (this.alertUtils.validateNumber(this.input.pcost, "Product Cost", 1, 4)) {
              //if (this.alertUtils.validateNumber(this.input.minorderqty, 'Min Order Qty', 1, 3)) {
              //if (this.alertUtils.validateNumber(this.input.priority, 'Priority', 1, 3)) {
              // (this.alertUtils.validateNumber(this.input.expressdeliverycharges, 'Express Delivery Charge', 1, 4)) {
              // if (this.alertUtils.validateNumber(this.input.servicecharge, 'Service Charge', 1, 4)) {

              this.showToast = false;

              if (this.isUpdate)
                this.doUpdate();
              else
                this.doCreate();
              /* }
             }
           }*/
              // }
            }
          }
        }
      // }
    }

    if (this.showToast) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }

  }

  doCreate() {
    try {
      let vechicles = [];
      if (this.input.id && this.input.id.length > 0) {
        for (let i = 0; i < this.input.id.length; i++) {
          let innerInput = {"id": this.input.id[i]};
          vechicles[i] = innerInput;
        }
      }

      let input = {
        "product": {
          "category": this.categoryitem.category,
          "categoryid": this.categoryitem.categoryid,
          "currency": this.input.currency,
          "brandname": this.input.pname,
          "pname": this.input.pname,
          "ptype": this.input.ptype,
          "pcost": this.input.pcost,
          "discount": this.input.discount,
          "minorderqty": this.input.minorderqty,
          "priority": this.input.priority,
          "iscanreturnable": this.input.iscanreturnable,
          "servicecharge": this.input.servicecharge,
          "expressdeliverycharges": this.input.expressdeliverycharges,
          "vechicles": vechicles,
          "vechiclesid": this.input.id,
          "isauthorized": this.input.isauthorized,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.createProduct(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res.data);
        this.alertUtils.showLog(res.data.message);

        this.output.result = res.result;
        this.output.actionType = 'create';
        this.output.data = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
          /*if(this.b64Image && this.b64Image.length > 0){
            this.uploadImg(this.b64Image,'product_'+res.data.productid);
          }*/
          //this.viewCtrl.dismiss(this.output);
          //this.alertUtils.showToastWithButton("User successfully created", true, 'OK');
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, error => {

      })
    } catch (e) {

    }
  }

  doUpdate() {

    try {

      let vechicles = [];
      if (this.input.id && this.input.id.length > 0) {
        for (let i = 0; i < this.input.id.length; i++) {
          let innerInput = {"id": this.input.id[i]};
          vechicles[i] = innerInput;
        }
      }

      let input = {
        "product": {
          "pid": this.user.productid,
          "category": this.input.category,
          "categoryid": this.input.categoryid,
          "currency": this.input.currency,
          "brandname": this.input.pname,
          "pname": this.input.pname,
          "ptype": this.input.ptype,
          "pcost": this.input.pcost,
          "discount": this.input.discount,
          "minorderqty": this.input.minorderqty,
          "priority": this.input.priority,
          "iscanreturnable": this.input.iscanreturnable,
          "servicecharge": this.input.servicecharge,
          "expressdeliverycharges": this.input.expressdeliverycharges,
          "vechicles": vechicles,
          "vechiclesid": this.input.id,
          "isauthorized": this.input.isauthorized,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLog('input : ' + data);

      this.alertUtils.showLoading();
      this.apiService.putReq(this.apiService.editProduct(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res.data);

        this.output.result = res.result;
        this.output.actionType = 'update';
        this.output.data = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, error => {

      })
    } catch (e) {

    }
  }

  getCategories() {

    this.categoryList = []
    let url = this.apiService.getProductCategory() + this.USER_ID + "/" + this.USER_TYPE + "/" + APP_TYPE;

    this.alertUtils.showLog(url);

    this.alertUtils.showLoading();
    this.apiService.getReq(url).then(res => {
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.categoryList = res.data;
        // this.vechicleTypes = res.data[0].VEHICLE;
      } else
        this.categoryList = [];
    }, error => {

    })
  }

  getCategoryProducts(catDetails: any) {

    let input = {
      "root": {
        "userid": this.USER_ID,
        "usertype": this.USER_TYPE,
        "category": catDetails.category,
        "categoryid": catDetails.categoryid,
        "apptype": APP_TYPE
      }
    };

    let data = JSON.stringify(input);

    this.alertUtils.showLog('input : ' + data);

    this.alertUtils.showLoading();
    this.apiService.postReq(this.apiService.getProductsByCategory(), data).then(res => {
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.categoryProductsList = res.data;
      }
    }, error => {

    })
  }

  promptPickImage(event) {
    let prompt = this.alertCtrl.create({
      title: 'PICK IMAGE',
      /*message: 'Are you sure. You want delete customer?',*/
      buttons: [
        {
          text: 'Gallery',
          handler: data => {
            this.pickImage(0);
          }
        },
        {
          text: 'Camera',
          handler: data => {
            this.pickImage(1);
          }
        }
      ]
    });
    prompt.present();
  }

  pickImage(sourceType) {

    try {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 256,
        targetHeight: 256,
        sourceType: sourceType
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image = imageData;

        if (base64Image && base64Image.length > 0) {
          if (this.isUpdate) {
            this.uploadImg(base64Image, 'product_' + this.user.productid);
          } else {
            this.b64Image = base64Image;
          }
        }

      }, (err) => {
        // Handle error
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  uploadImg(s, fileName) {
    let input = {
      "image": {
        "filename": fileName,
        "base64string": s,
      }
    };

    this.showProgress = true;
    this.apiService.postReq(this.apiService.imgUpload(), JSON.stringify(input)).then(res => {
      this.showProgress = false;
      this.alertUtils.showLog("POST (SUCCESS)=> IMAGE UPLOAD: " + res.data);

      this.viewCtrl.dismiss(this.output);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {

      } else
        this.alertUtils.showToast(res.result);

    }, error => {
      this.alertUtils.showLog("POST (ERROR)=> IMAGE UPLOAD: " + error);
    })
  }
}
