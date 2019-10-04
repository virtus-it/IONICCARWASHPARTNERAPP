import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';

declare var google;
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation, ILatLng, LatLng, BaseArrayClass, Polygon, PolygonOptions, LatLngBounds
} from '@ionic-native/google-maps';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, RES_SUCCESS, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-service-areas',
  templateUrl: 'service-areas.html',
})
export class ServiceAreasPage {

  map: GoogleMap;
  polygons = [];

  data = [];
  currentPolygon: any;
  polygonPoints: ILatLng[] = [];
  polygon: ILatLng[] = [];
  polygonsSaved: Polygon[] = [];
  private USER_ID;
  private USER_TYPE;

  isNewPolygon:boolean = true;
  isEditingPolygon:boolean = false;
  isEditedPolygon:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public apiService: ApiProvider,
              private alertUtils: UtilsProvider,
              public toastCtrl: ToastController,
              private translateService: TranslateService) {

    try {
      this.platform.ready().then(ready => {
        let lang = "en";
                if (UtilsProvider.lang) {
                  lang = UtilsProvider.lang
                }
                UtilsProvider.sLog(lang);
                translateService.use(lang);
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            this.getAreas();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            this.getAreas();
          }
        });
      });


    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ngAfterViewInit() {
    this.loadMap();
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

        let coordinates: LatLng = new LatLng(25.2048, 55.2708);

        let position = {
          target: coordinates,
          zoom: 11
        };

        this.map.animateCamera(position);


        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          (data) => {
            if(this.isNewPolygon) {
              this.drawEarlierPolygons();
              this.polygonPoints.push(data[0]);
              this.drawPolygon(this.polygonPoints, true);

              if (this.polygonPoints.length > 2) {
                this.isEditingPolygon = true;
                this.currentPolygon = this.polygonPoints;
              } else {
                this.isEditingPolygon = false;
                this.isEditedPolygon = false;
              }
            }else{
              this.alertUtils.showLog(data);
              for(let i=0;i<this.polygonsSaved.length;i++){
                let polygon: Polygon = this.polygonsSaved[i];
                let points: BaseArrayClass<ILatLng> =  polygon.getPoints();
                let array: ILatLng[] = points.getArray();
                let bounds:LatLngBounds = new LatLngBounds(array);

                if(bounds.contains(data[0])){
                  polygon.remove();
                  this.polygons.splice(i, 1);
                  this.isEditingPolygon = false;
                  this.isEditedPolygon = true;
                  this.currentPolygon = null;
                  this.polygonPoints = [];
                }
              }
            }
          }
        );
      });
  }

  drawEarlierPolygons() {
    this.map.clear();
    for (let i = 0; i < this.polygons.length; i++) {
      this.drawPolygon(this.polygons[i], false);
    }
  }

  drawPolygon(polygonPoints, showMarkers) {

    let polygon: Polygon = this.map.addPolygonSync({
      'points': polygonPoints,
      'strokeColor': '#AA00FF',
      'fillColor': '#00FFAA',
      'strokeWidth': 10
    });

    this.polygonsSaved.push(polygon);

   // polygon.setClickable(true);

    if (showMarkers)
      this.showPolygonMarker(polygon);

  }


  showPolygonMarker(polygon) {
    let points: BaseArrayClass<ILatLng> = polygon.getPoints();

    points.forEach((latLng: ILatLng, idx: number) => {
      let marker: Marker = this.map.addMarkerSync({
        draggable: true,
        position: latLng
      });
      marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe((params) => {
        let position: LatLng = params[0];
        points.setAt(idx, position);
      });
    });
  }

  getAreas() {

    try {

      let input = {
        "root": {
          "transtype": "getall",
          "userid": this.USER_ID,
          "user_type": this.USER_TYPE,
          "pagesize": '10',
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.apiService.postReq(this.apiService.getPolygon(), data).then(res => {

        this.alertUtils.showLog('res : '+JSON.stringify(res));
        this.alertUtils.showLog(res);

        if(res.result == RES_SUCCESS){
          this.data = res.data[0].polygonvalue;
          for(let i=0;i<this.data.length;i++){
            this.polygons.push(this.data[i].path);
          }
          this.drawEarlierPolygons();
        }

      }, error => {

      });
    } catch (e) {
    }
  }

  polygonCreate(){
    this.isNewPolygon = true;
  }

  polygonEdit(){
    this.isNewPolygon = false;
  }

  reset(){
    this.currentPolygon = null;
    this.polygonPoints = [];
    this.polygons = [];
    this.getAreas();
  }

  close(){
    this.isEditingPolygon = false;
    this.isEditedPolygon = false;
    this.currentPolygon = null;
    this.polygonPoints = [];
    this.drawEarlierPolygons();
  }

  createArea(){
    this.polygons.push(this.currentPolygon);
    this.drawEarlierPolygons();
    this.isEditingPolygon = false;
    this.isEditedPolygon = true;
    this.currentPolygon = null;
    this.polygonPoints = [];
  }

  saveIntoServer() {
    try {
      this.isEditingPolygon = false;
      this.isEditedPolygon = false;

      this.currentPolygon = null;
      this.polygonPoints = [];

      let polygonvalue = [];
      for (let i = 0; i < this.polygons.length; i++) {
        let p = this.polygons[i];
        this.alertUtils.showLog('polygon '+p);
        this.alertUtils.showLog(p);

        let path = {
          "path": p
        };

        this.alertUtils.showLog('path '+path);

        polygonvalue.push(path);

      }

      this.polygons = [];

      let input = {
        "root": {
          "transtype": "create",
          "userid": this.USER_ID,
          "user_type": this.USER_TYPE,
          "polygonvalue":polygonvalue,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

     let data = JSON.stringify(input);

       this.alertUtils.showLog(input);
           this.apiService.postReq(this.apiService.getPolygon(), data).then(res => {
             this.alertUtils.showLog(res);
             this.alertUtils.showLog('res ' + JSON.stringify(res));

             this.getAreas();

           }, error => {

           });
    } catch (e) {
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }
}
