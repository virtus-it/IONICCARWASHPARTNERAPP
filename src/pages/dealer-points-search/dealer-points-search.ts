import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dealer-points-search',
  templateUrl: 'dealer-points-search.html',
})
export class DealerPointsSearchPage {

  input = {userType: 'all', filterBy: 'top100'};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerPointsSearchPage');
  }

  apply() {
    this.viewCtrl.dismiss(this.input);
  }

  update(s: string) {
    if (s) {
      if (s == 'top10')
        this.input.filterBy = 'top10';
      else if (s == 'top50')
        this.input.filterBy = 'top50';
      else if (s == 'top100')
        this.input.filterBy = 'top100';
      else if (s == 'least10')
        this.input.filterBy = 'least10';
      else if (s == 'least50')
        this.input.filterBy = 'least50';
      else if (s == 'least100')
        this.input.filterBy = 'least100';
    }
  }

}
