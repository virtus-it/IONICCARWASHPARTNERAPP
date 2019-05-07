import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  baseImgUrl: string;
  extensionPng: string = '.png';
  showProgress = true;
  type: string = 'all';
  filterBy: string = 'filterby';
  startDate = '';
  endDate = '';
  private response: any = [];
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private platform: Platform,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchList(false, false, true, '', '');

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchList(false, false, true, '', '');

          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  ionViewDidLoad() {
     }


  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {

        "root": {
          "userid": this.USER_ID,
          "dealerid": UtilsProvider.USER_DEALER_ID,
          "usertype": this.USER_TYPE,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };


      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.apiService.postReq(this.apiService.getDealerFeedBack(), data).then(res => {
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> FEEDBACKS: " + JSON.stringify(res));
        //this.response = res.data;

        let tempRes =[];

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          for (let i = 0; i < res.data.length; i++) {
            if (!(res.data[i].issuetype == null))
              tempRes.push(res.data[i]);
          }

          this.response = tempRes;

        } else {
          if (!isPaging)
            this.noRecords = true;
        }
        this.ref.detectChanges();
      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> FEEDBACKS: " + error);
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      })

    } catch (e) {
      this.alertUtils.hideLoading();
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    }
  }

  doRefresh(refresher) {
    this.fetchList(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      if (this.response.length > 0)
        this.fetchList(true, false, false, paging, "");
      else
        paging.complete();
    } else {
      paging.complete();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    })
  }

  hideProgress(isFirst, isRefresh, isPaging, paging, refresher) {
    if (isFirst) {
      this.showProgress = false;
    }
    if (isPaging) {
      paging.complete();
    }
    if (isRefresh) {
      refresher.complete();
    }
  }

  showPromptForCreateIssue(event, feedback) {
    let prompt = this.alertCtrl.create({
      title: 'REPLY',
      message: 'Please write your reply',
      inputs: [
        {
          label: 'Replay',
          name: 'replay',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'SEND',
          handler: data => {

            this.alertUtils.showLog(data.replay);

            if (this.alertUtils.validateText(data.replay, 'Reply', 2, 200)) {
              this.callCreateReplyToIssue(feedback, data.replay);
            } else
              this.alertUtils.showToast('message required');
          }
        }
      ]
    });
    prompt.present();
  }

  callCreateReplyToIssue(feedback: any, mes: string) {

    try {

      let input = {

        "root": {
          "issueid": feedback.issueid,
          "issuetype": feedback.issuetype,
          "message": mes,
          "userid": feedback.createdby.userid,
          "loginid": this.USER_ID,
          "dealerid": UtilsProvider.USER_DEALER_ID,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };


      let data = JSON.stringify(input);
      this.alertUtils.showLog(data);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.createReplyToIssue(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog("POST (SUCCESS)=> FEEDBACKS: " + JSON.stringify(res));

        this.fetchList(false, false, false, '', '');

      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> FEEDBACKS: " + error);
      })

    } catch (e) {
      this.alertUtils.hideLoading();
    }

  }


  changeIssueStatus(event, feedback, status) {

    try {

      let input = {

        "root": {
          "issueid": feedback.issueid,
          "issuetype": feedback.issuetype,
          "status": status,
          "userid": feedback.createdby.userid,
          "loginid": this.USER_ID,
          "dealerid": UtilsProvider.USER_DEALER_ID,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };


      let data = JSON.stringify(input);
      this.alertUtils.showLog(data);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.changeFeedbackStatus(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog("POST (SUCCESS)=> FEEDBACKS: " + JSON.stringify(res));

        if(res.result == this.alertUtils.RESULT_SUCCESS)
          this.alertUtils.showToast("Issue State Changed");

        this.fetchList(false, false, false, '', '');

      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> FEEDBACKS: " + error);
      })

    } catch (e) {
      this.alertUtils.hideLoading();
    }

  }
}
