import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, APP_USER_TYPE, FRAMEWORK, MOBILE_TYPE, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {NetworkProvider} from "../../providers/network/network";
import {DealerOrdersHomePage} from "../dealer-orders-home/dealer-orders-home";

@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'login.html',
})
export class LoginPage {

  //development
  username:string='9863636314';
  password:any='9863636314';

  //production
/*   username:string='9863636315';
   password:any='98498';*/

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private networkProvider: NetworkProvider,
              private menuCtrl: MenuController,
              private utils: UtilsProvider,
              private apiUrl : ApiProvider) {
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad LogInPage');
    this.menuCtrl.enable(false);
  }

  logIn(){

    //this.utils.showToastSnackBar('clicked');

    let input = {
      "User": {
        "emailid": this.username,
        "mobileno": this.username,
        "pwd": this.password,
        "apptype": APP_TYPE,
        "mobiletype": MOBILE_TYPE,
        "framework": FRAMEWORK,
        "user_type": APP_USER_TYPE
      }
    };

    let data = JSON.stringify(input);

    this.utils.showLog("data",data);

    this.utils.showLoading();
    this.networkProvider.postReq(this.apiUrl.login(),data).then(res=>{
      this.utils.hideLoading();
      this.utils.showLog("res",res.data);

      //this.utils.showToastSnackBar(res.data);

      if(res.result == this.utils.RESULT_SUCCESS){
        if(res.data && res.data.user){
          let input = res.data.user;
          let uType=input.USERTYPE;

          if(uType == UserType.DEALER ||
            uType == UserType.SUPPLIER ||
            uType == UserType.SALES_TEAM ||
            uType == UserType.SALES ||
            uType == UserType.CUSTOMER_CARE){

            let uId,uName,uPhno,uAddr,uDealerId,uDealerName,uDealerPhno,uDealerAddr;

            uId = input.userid;
            uName = input.first_name+" "+input.last_name;
            uPhno = input.mobileno;
            uAddr = input.address;

            if(uType == UserType.DEALER){
              uDealerId = uId;
              uDealerName = uName;
              uDealerPhno = uPhno;
              uDealerAddr = uAddr;
            }else{
              uDealerId = input.userid;
              uDealerName = input.userid;
              uDealerPhno = input.userid;
              uDealerAddr = input.userid;
            }

            UtilsProvider.setValues(uId,uName,uPhno,uAddr,uType,uDealerId,uDealerName,uDealerPhno,uDealerAddr);

            this.navCtrl.setRoot(DealerOrdersHomePage);
            //this.navCtrl.push(DealerOrdersHomePage);

          }else {
            //show alert
            //Its Admin Application
            //please use customer application

            alert('Its Admin application\n please use customer application');
          }

        }
      }else{
        alert(res);
      }


    },error=>{
      this.utils.showLog(error);
      this.utils.hideLoading();
    })

  }

}
