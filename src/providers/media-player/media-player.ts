import { Media, MediaObject } from '@ionic-native/media';
import { Injectable } from '@angular/core';
import {UtilsProvider} from "../utils/utils";

@Injectable()
export class MediaPlayerProvider {

  file: MediaObject;

  constructor(private media: Media,
              private alertUtils:UtilsProvider) {
    console.log('Hello MediaPlayerProvider Provider');

    //this.createPlayer();
  }

  createPlayer(){
    this.alertUtils.showLog('In >> createPlayer()');
    try {
      this.file = this.media.create('file://assets/sounds/ringtone.mp3');
      this.playPlayer();
    } catch (e) {
      this.alertUtils.showLog('error >> createPlayer()');
      this.alertUtils.showLog(e);
    }
  }

  playPlayer(){
    this.alertUtils.showLog('In >> playPlayer()');
    try {
      this.file.play();
    } catch (e) {
      this.alertUtils.showLog('error >> playPlayer()');
      this.alertUtils.showLog(e);
    }
  }

  pausePlayer(){
    this.alertUtils.showLog('In >> pausePlayer()');
    try {
      this.file.pause();
    } catch (e) {
      this.alertUtils.showLog('error >> pausePlayer()');
      this.alertUtils.showLog(e);
    }
  }

  stopPlayer(){
    this.alertUtils.showLog('In >> stopPlayer()');
    try {
      this.file.stop();
    } catch (e) {
      this.alertUtils.showLog('error >> stopPlayer()');
      this.alertUtils.showLog(e);
    }
  }

  releasePlayer(){
    try {
      this.file.release();
    } catch (e) {
      this.alertUtils.showLog('error >> releasePlayer()');
      this.alertUtils.showLog(e);
    }
  }

}
