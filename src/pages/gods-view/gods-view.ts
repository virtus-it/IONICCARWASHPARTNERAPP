import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import {AbstractPage} from "../../abstract/abstract";
import {APP_TYPE, KEY_USER_INFO, OrderTypes, RES_SUCCESS, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {CallWebserviceProvider} from "../../providers/call-webservice/call-webservice";
import {TranslateService} from "@ngx-translate/core";
import {
  BaseArrayClass, GoogleMap,
  GoogleMaps,
  GoogleMapsEvent,
  ILatLng,
  LatLng,
  LatLngBounds, Marker,
  Polygon
} from "@ionic-native/google-maps";
import {GeocoderProvider} from "../../providers/geocoder/geocoder";

declare var google;

@IonicPage()
@Component({
  selector: 'page-gods-view',
  templateUrl: 'gods-view.html',
})
export class GodsViewPage extends AbstractPage {

  listOf: any;
  map: GoogleMap;
  searchtype: string = 'all';
  searchtext: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiProvider,
              private platform: Platform,
              public geoCoder: GeocoderProvider,
              private alertUtils: UtilsProvider,
              public loadingCtrl: LoadingController,
              public webservice: CallWebserviceProvider,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {
    super(loadingCtrl, webservice);
    try {
      this.platform.ready().then(ready => {
        let lang = "en";
        if (UtilsProvider.lang) {
          lang = UtilsProvider.lang
        }

        this.translateService.use(lang);

      });

    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }

  ngAfterViewInit() {
    this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
      this.alertUtils.showLog(value);
      if (value && value.hasOwnProperty('USERTYPE')) {
        UtilsProvider.setUSER_INFO(value);
        this.alertUtils.initUser(value);

        this.presentLoading();
        this.loadMap();
      }
    }, (error) => {
      let value = UtilsProvider.USER_INFO
      if (value && value.hasOwnProperty('USERTYPE')) {
        UtilsProvider.setUSER_INFO(value);
        this.alertUtils.initUser(value);

        this.presentLoading();
        this.loadMap();
      }
    });
  }

  fetch() {

    if (this.searchtype == 'name' && this.searchtext == '') {
      this.alertUtils.showToast('please enter search text');
    } else {
      if (!this.event)
        this.presentLoading();

      // {"transtype":"filter","searchtype":"all","searchtext":"null","lastid":"0","pagesize":"10"}}

      let input = {
        "root": {
          "transtype": 'filter',
          'searchtype': this.searchtype ? this.searchtype : null,
          'searchtext': this.searchtext ? this.searchtext : null,
          "userid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE,
          "pagesize": "10"
        }
      };

      this.postWebservice('get', this.apiService.godsView(), JSON.stringify(input));
    }
  }

  loadMap() {
    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('map_canvas', {
      target: {
        lat: 25.2048,
        lng: 55.2708
      },
    });

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        //console.log('Map is ready!');

        this.map.clear();

        let coordinates: LatLng = new LatLng(25.2048, 55.2708);

        let position = {
          target: coordinates,
          zoom: 11
        };

        this.map.animateCamera(position);

        this.closeLoading();
        this.fetch();
      });
  }

  validate(s) {
    return this.alertUtils.validate(s);
  }

  updatePaymentType(s) {
    if (s) {
      if (s == 'cash' || s == 'cod')
        return 'COD';
      else if (s == 'online payment')
        return 'Online payment';
      else
        return s;
    }
  }

  addMarker(obj) {

    try {
      let pos: LatLng = new LatLng(obj.latitude, obj.longitude);
      this.alertUtils.showLog(pos);

      let iconColor = 'blue';
      let title = 'Name: '+this.validate(obj.firstname) +' '+ this.validate(obj.lastname);

      if(obj.orderstatus == OrderTypes.ORDER_STARTED){
        iconColor = 'red';
        title = title +' \n(En Route)';
      } else if(obj.orderstatus == OrderTypes.JOB_STARTED){
        iconColor = 'green';
        title = title +' \n (Job Started)';
      }else if(obj.orderstatus == OrderTypes.ARRIVED){
        iconColor = 'yellow';
        title = title +' \n(Reached)';
      }else if(obj.orderstatus == OrderTypes.JOB_COMPLETED){
        iconColor = 'blue';
        title = title +' \n(Job Completed)';
      }else if(obj.orderstatus == OrderTypes.DELIVERED){
        iconColor = 'blue';
        title = title +' \n(Delivered)';
      }else if(obj.orderstatus == 'inactive'){
        iconColor = 'black';
        title = title +' \n(In Active)';
      }else if(obj.orderstatus == 'active'){
        iconColor = 'blue';
        title = title +' \n(Active)';
      }

      let marker: Marker = this.map.addMarkerSync(
        {
          title: title,
          content: 'test content',
          sObj: obj,
          icon: iconColor,
          animation: 'DROP',
          position: pos
        });

      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {

        let marker: Marker = <Marker>params[1];
        let obj: any = marker.get('sObj');
      });

      let position = {
        target: pos,
        zoom: 11,
        clickable: true,
      };
      this.map.animateCamera(position);

    } catch (e) {
    }
  }

  protected webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'get':

        this.listOf = [];
        this.map.clear();

        if (json && json.result == RES_SUCCESS && json.data) {

          for (let i = 0; i < json.data.length; i++) {
            const obj = json.data[i];
            if (obj.paymenttype) {
              if (obj.paymenttype == 'cash' || obj.paymenttype == 'cod')
                obj["paymenttype"] = 'cod';
            }

            if (!obj.latitude || !obj.longitude) {
              let geocoder = new google.maps.Geocoder();
              geocoder.geocode({'address': obj.address}, (results, status) => {

                if (results && results[0] && results[0].geometry && results[0].geometry.location) {
                  let loc = results[0].geometry.location;
                  obj.latitude = loc.lat();
                  obj.longitude = loc.lng();

                  this.addMarker(obj);
                }
              });
            }else{
              this.addMarker(obj);
            }
            this.listOf.push(obj);
          }

        }


        break;


      default:
        alert("Something went wrong.")
        break;
    }
  }

  protected handleError(json, reqId) {
  }

}
