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
