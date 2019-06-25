Required Softwares for Ionic3 Project:
1. Nodejs  : 8.11.1
2. Npm     : 5.6.0
3. Ionic   : 3.20.0
4. Cordova : 7.1.0

Editors:
1. Webstrome
2. VsCode
3. Visuval Studio
4. Sublime

Note: All commands run in node.js command prompt

Instalation:
Ionic & Cordova:
1. npm install -g ionic@3.20.0
2. npm install -g cordova@7.1.0

Create Project:
ionic start <<PROJECT_NAME>> <<THEME>>
ionic start Project_Demo blank

Execute into Browser:
Goto Project inside project folder and run below command

d:\Project_Demo\ ionic serve

Execute into Android Mobile:
1. Connect your mobile via cable 
2. Goto Project inside project folder
3. Run below command

d:\Project_Demo\ ionic cordova run android

Services Instalation:
Goto Project inside project folder and run below commands

1.Http:
ionic cordova plugin add cordova-plugin-advanced-http
npm install @ionic-native/http


2.Toast:
ionic cordova plugin add cordova-plugin-x-toast
npm install @ionic-native/toast


3.Network:
ionic cordova plugin add cordova-plugin-network-information
npm install @ionic-native/network

4.Diagnostic:
ionic cordova plugin add cordova.plugins.diagnostic
npm install @ionic-native/diagnostic

5.Device:
ionic cordova plugin add cordova-plugin-device
npm install @ionic-native/device

6.Native Storage:
ionic cordova plugin add cordova-plugin-nativestorage
npm install @ionic-native/native-storage

7.Call Number:
ionic cordova plugin add call-number
npm install @ionic-native/call-number

8.Open Native Settings:
ionic cordova plugin add cordova-open-native-settings
npm install @ionic-native/open-native-settings


9.App Rate:
ionic cordova plugin add cordova-plugin-apprate
npm install @ionic-native/app-rate


10.Swipeble tabs:
npm i ionic2-super-tabs@4.1.4
more info
https://github.com/zyra/ionic2-super-tabs#installation

11. Momentum Date Library
npm install moment

12. Tranlator 
Use this
npm install @ngx-translate/core@9.1.1 --save
Instedof
npm install @ngx-translate/core --save
More Info : https://github.com/ngx-translate/core
: https://forum.ionicframework.com/t/multi-language-ngx-translate-ionic-3-object-is-not-a-function-at-translateservice-get-issue/128736

13. Geolocation
$ ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To locate you"
$ npm install --save @ionic-native/geolocation@4

14. Socket
npm install ng-socket-io --save

More Info : https://devdactic.com/ionic-realtime-socket-io/

15. Unique Device ID
ionic cordova plugin add cordova-plugin-uniquedeviceid
npm install --save @ionic-native/unique-device-id@4

More Info : https://ionicframework.com/docs/v3/native/unique-device-id/

16. Camera - to pick image from camera or gallery and upload to server
$ ionic cordova plugin add cordova-plugin-camera
$ npm install --save @ionic-native/camera@4
More Info : https://ionicframework.com/docs/native/camera/

17. Charts
npm install chart.js --save

18. Push Notifications
$ ionic cordova plugin add phonegap-plugin-push
$ npm install --save @ionic-native/push@4

More Info: https://ionicframework.com/docs/v3/native/push/

19. Native Storage
$ ionic cordova plugin add cordova-plugin-nativestorage
$ npm install --save @ionic-native/native-storage@4

20. App Version
$ ionic cordova plugin add cordova-plugin-app-version
$ npm install --save @ionic-native/app-version@4

More Info: https://ionicframework.com/docs/v3/native/app-version/


21. Network
$ ionic cordova plugin add cordova-plugin-network-information
$ npm install --save @ionic-native/network@4

22. Background Mode
ionic cordova plugin add cordova-plugin-background-mode
npm install --save @ionic-native/background-mode@4

23. Background Geolocation
$ ionic cordova plugin add cordova-plugin-mauron85-background-geolocation@2.2.5
$ npm uninstall --save @ionic-native/background-geolocation@3
