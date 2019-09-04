import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, OrderTypes, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";
declare var google;
import {
  GoogleMap,
  GoogleMaps,
  GoogleMapsEvent,
  ILatLng,
  LatLng, LatLngBounds, Marker,
  Polygon
} from "@ionic-native/google-maps";
import {async} from "rxjs/scheduler/async";
import {MapUtilsProvider} from "../../providers/map-utils/map-utils";


@IonicPage()
@Component({
  selector: 'page-dealer-order-details-assign-forward',
  templateUrl: 'dealer-order-details-assign-forward.html',
})
export class DealerOrderDetailsAssignForwardPage {

  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string = 'ASSIGN';
  user: any;
  showMap:boolean = false;
  map: GoogleMap;
  segmentValue:any;
  isListView: boolean = true;
  isUpdate: boolean = true;
  selectedValue;
  input = {
    firstname: "", lastname: "", phno1: "", email: "", phno2: "", phno3: "", platNo: "",
    locality: "", addr: "", advAmt: "", paymentType: "cod", customerType: "residential"
  };

  output = {"result": "", "actionType": "", "data": ""};
  segmentSelected: string = 'suppliers';
  suppliersList: string[];
  distributorsList: string[];
  mainList = [];
  item: any;
  orderInfo: any;


  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private mapUtils: MapUtilsProvider,
              private platform: Platform,
              private formBuilder: FormBuilder) {

    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    this.orderInfo = navParams.get('orderInfo');
    this.suppliersList = navParams.get('suppliersList');
    this.distributorsList = navParams.get('distributorsList');

    this.mainList = this.suppliersList;

    try {
      this.platform.ready().then(ready => {

        if(this.platform.is('android') || this.platform.is('ios'))
          this.showMap = false;
        else
          this.showMap = true;

        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLogs(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE;
            this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
            this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;
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
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLogs(e);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doValidation(event) {

    this.alertUtils.showLogs('selected value',this.selectedValue);

    if (this.selectedValue != '') {
      if (this.buttonTitle == 'ASSIGN') {
        this.doAssign();
      } else if (this.buttonTitle == 'FORWARD') {
        this.doForward();
      }
    } else {
      if (this.buttonTitle == 'ASSIGN') {
        this.alertUtils.showToast('Select any supplier');
      } else if (this.buttonTitle == 'FORWARD') {
        this.alertUtils.showToast('Select any distributor');
      }
    }

  }

  doAssign() {
    try {
      let input = {
        "order": {
          "orderid": this.orderInfo.order_id,
          "to": this.selectedValue.userid,
          "from": this.DEALER_ID,
          "orderfrom": this.orderInfo.order_id,
          "orderstatus": OrderTypes.ASSIGNED,
          /*"autoassign":true,
          "supplierID": this.input.phno3,
          "supplierName": this.input.email,
          "supplierMno": 'paani',*/
          "autoassign": false,
          "quantity": this.orderInfo.quantity,
          "product_type": this.orderInfo.prod_type,
          "product_name": this.orderInfo.brandname,
          "usertype": this.USER_TYPE,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.assignOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLogRes(this.apiService.assignOrder(),data,res);

        this.output.result = res.result;
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          UtilsProvider.ORDER_STUAS_UPDATED = true;
          this.output.actionType = 'assign';
          this.viewCtrl.dismiss(this.output);
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, error => {
        this.alertUtils.showLogRes(this.apiService.assignOrder(),data,error);
      })
    } catch (e) {

    }
  }

  doForward() {
    try {

      let input = {
        "order": {
          "orderid": this.orderInfo.order_id,
          "to": this.orderInfo.dealerdetails.userid,
          "from": this.DEALER_ID,
          "orderto": this.DEALER_ID,
          "orderstatus": OrderTypes.ORDERED,
          "quantity": this.orderInfo.quantity,

          "productid": this.orderInfo.prod_id,
          "product_name": this.orderInfo.brandname,
          "product_type": this.orderInfo.prod_type,
          "product_cost": this.orderInfo.prod_cost,
          "servicecharges": 10,
          "expressdeliverycharges": 15,

          "usertype": this.USER_TYPE,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.forwardOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLogRes(this.apiService.assignOrder(),data,res);

        /*this.output.result = res.result;
        this.output.actionType = 'create';
        this.output.data = res.data;
*/
        /*if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
          //this.alertUtils.showToastWithButton("User successfully created", true, 'OK');
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
*/
      }, error => {
        this.alertUtils.showLogRes(this.apiService.assignOrder(),data,error);
      })
    } catch (e) {

    }
  }

  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);

    this.selectedValue = '';

    if (ev._value == 'listView') {
      this.buttonTitle = 'ASSIGN';
      this.mainList = this.suppliersList;
      this.isListView = true;
    } else {
      this.loadMap();
      this.isListView = false;
    }
    this.alertUtils.showLogs('ListView', this.isListView);
  }


  ngAfterViewInit() {
    //this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas1', {
    });

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        let coordinates: LatLng = new LatLng(25.2048, 55.2708);

        let position = {
          target: coordinates,
          zoom: 11
        };

        this.map.animateCamera(position);

        //there is no customer lat lng updating using geo coder
        if(!(this.orderInfo.orderby_latitude && this.orderInfo.orderby_longitude))
          this.getLatLngs({},this.orderInfo.orderby_address,this.orderInfo.orderby_latitude,this.orderInfo.orderby_longitude,false,false,true);

        //show supplier marker without zoom and validate whether he have in 10km radius
        for(let i=0;i<this.suppliersList.length;i++){
            let sObj:any = this.suppliersList[i];
            //this.alertUtils.showLogs('sObj', sObj);
            this.getLatLngs(sObj,sObj.address,sObj.latitude,sObj.longitude,true,true);
        }

        //show customer marker with zoom
        this.getLatLngs({},this.orderInfo.orderby_address,this.orderInfo.orderby_latitude,this.orderInfo.orderby_longitude,false,false,false);
      });
  }

  getLatLngs(sObj:any,address: any, lat:any,lng:any,findDistence:boolean,isSupplier?:boolean, dontShowMarker?:boolean):LatLng {
    try {

      this.alertUtils.showLog('<<< GEO_CODER >>>');
      this.alertUtils.showLog('sObj :'+sObj);
      this.alertUtils.showLog('address :'+address);
      this.alertUtils.showLog('lat :'+lat);
      this.alertUtils.showLog('lng :'+lng);
      this.alertUtils.showLog('findDistence :'+findDistence);
      this.alertUtils.showLog('isSupplier :'+isSupplier);
      this.alertUtils.showLog('dontShowMarker :'+dontShowMarker);
      this.alertUtils.showLog('<<< LOGS >>>');

      if(lat && lng){
          if(findDistence){
            this.findDistenceAndShowMarker(new LatLng(lat,lng),sObj,isSupplier);
          }else{
            if(dontShowMarker){
              this.orderInfo.orderby_latitude = lat;
              this.orderInfo.orderby_longitude = lng;
            }else{
              let coordinates: LatLng = new LatLng(lat, lng);
              this.addMarker(coordinates,sObj,isSupplier);
            }
          }
      }else{
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address }, (results, status) => {
          this.alertUtils.showLogs('Getting lat lngs from addr : supplier : '+isSupplier,results);

          if(results&& results[0] && results[0].geometry && results[0].geometry.location){
            let loc = results[0].geometry.location;
            this.alertUtils.showLogs(loc.lat());
            this.alertUtils.showLogs(loc.lng());

            if(loc.lat(),loc.lng()){
              if(dontShowMarker){
                this.orderInfo.orderby_latitude = lat;
                this.orderInfo.orderby_longitude = lng;
              }else{
                if(findDistence){
                  this.findDistenceAndShowMarker(new LatLng(loc.lat(), loc.lng()),sObj,isSupplier);
                }else{
                  let coordinates: LatLng = new LatLng(loc.lat(), loc.lng());
                  this.addMarker(coordinates,sObj,isSupplier);
                }
              }
            }
          }
        });
      }
    } catch (e) {
      this.alertUtils.showLogs('Getting lat lngs from addr',e);
      return null;
    }
  }

  addMarker(loc:LatLng, sObj:any, isSupplier:boolean){

    try {
      this.alertUtils.showLogs(loc);

      let iconColor = 'blue';
      let iconTitle = 'Customer';
      if(isSupplier){
        iconColor = 'red';
        iconTitle = sObj.firstname;
      }


      let marker: Marker = this.map.addMarkerSync(
        {title: iconTitle,
          content:'test content',
          sObj: sObj,
        icon: iconColor,
        animation: 'DROP',
        position: loc});

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {

        let marker: Marker = <Marker>params[1];
        let obj: any = marker.get('sObj');
        this.alertUtils.showLogs(sObj);
        if(isSupplier)
          this.selectedValue = sObj;
        else
          this.selectedValue = '';
      });


      if(!isSupplier){
        let position = {
          target: loc,
          zoom: 11,
          clickable:true,
        };

        this.map.animateCamera(position);
      }

    } catch (e) {
    }
  }

  findDistenceAndShowMarker(loc:LatLng, sObj:any, isSupplier:boolean){
    try {

      var radlat1 = Math.PI * loc.lat/180;
      var radlat2 = Math.PI * this.orderInfo.orderby_latitude/180;
      var theta = loc.lng-this.orderInfo.orderby_longitude;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344

      this.alertUtils.showLogs('distence : ',dist);

      if(dist < 100){

        sObj['distence'] = dist;
        this.addMarker(loc,sObj,isSupplier);
      }

    }catch (e) {

    }
  }
}
