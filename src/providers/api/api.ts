import {Injectable} from '@angular/core';
import {APP_TYPE, APP_USER_TYPE, IS_WEBSITE, UtilsProvider} from "../utils/utils";
import {Http, Headers, RequestOptions} from "@angular/http";
import {APP_VER_CODE} from "../network/network";
import "rxjs/add/operator/map";

@Injectable()
export class ApiProvider {

  private static DEVELOPMENT_URL  = "http://192.168.1.50:2250/";
  private static DEMO_URL         = "http://52.138.217.177:2250/";
  private static LOCALHOST_URL    = "http://localhost:2221/";
  private static TESTING_URL      = "http://104.211.247.42:2250/";
  private static PRODUCTION_URL   = "http://moya.online/";
  public static SOCKET_DEV_URL    = "http://192.168.1.50:1900";
  public static SOCKET_DEMO_URL   = "http://52.138.217.177:1900";

  private baseUrl: string;
  http: any;

  constructor(http: Http,
              private alertUtils: UtilsProvider) {
    this.baseUrl = ApiProvider.DEVELOPMENT_URL;
    this.http = http;
  }

  getReq(url) {
    this.alertUtils.showLog(url);
    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({'Content-Type': 'application/json'});
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "moyacustomer");
      headers.append("framework", "moyaioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);
    }

    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({headers: headers});
    return this.http.get(url, options).map(res => res.json()).toPromise();
  }

  getReqForMap(url) {
    this.alertUtils.showLog("/" + url);
    return this.http.get(url).map(res => res.json());
  }

  postReq(url: string, input) {

    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({'Content-Type': 'application/json'});
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "moyacustomer");
      headers.append("framework", "moyaioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);

    }
    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({headers: headers});
    this.alertUtils.showLog(url);
    this.alertUtils.showLog(input);
    return this.http.post(url, input, options).map(res => res.json()).toPromise();
  }

  putReq(url: string, input) {
    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({'Content-Type': 'application/json'});
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "moyacustomer");
      headers.append("framework", "moyaioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);

    }
    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({headers: headers});

    this.alertUtils.showLog(url);
    this.alertUtils.showLog(input);
    return this.http.put(url, input, options).map(res => res.json())
      .toPromise();
  }

  getImg() {
    return this.baseUrl+ "modules/uploads/"
  }


  login() {
    return this.baseUrl + "login";
  }

  distributors() {
    return this.baseUrl + "getdistributorbydealerid";
  }


  getSignInUrl() {
    return this.baseUrl + "login";
  }

  getSignUpUrl() {
    return this.baseUrl + "signup";
  }

    getForgotPwdUrl() {
    return this.baseUrl + "forgotpwd/" + APP_TYPE + "/";
  }

  getProductsByCustomerid() {
    return this.baseUrl + "getproductsbycustomerid/";
  }

  getProductsByOrderId() {
    return this.baseUrl + "getproductsbyorderid";
  }

  getProducts() {
    return this.baseUrl + "products/";
  }

  getProductsForSync() {
    return this.baseUrl + "productsforsync";
  }

  setProductStatus() {
    return this.baseUrl + "setproductstatus";
  }

  setProductQuantity() {
    return this.baseUrl + "addstock";
  }

  setmAddStock() {
    return this.baseUrl + "maddstock";
  }

  getSchedules() {
    //	getschedules/userid/apptype
    return this.baseUrl + "getschedules/";

  }

  getAllSchedules() {
    //	getallschedules/apptype/userid
    return this.baseUrl + "getallschedules";

  }

  createScheduler() {
    return this.baseUrl + "createscheduler";

  }

  getEntities() {
    return this.baseUrl + "entities";
  }


  updateScheduleOrder() {
    return this.baseUrl + "scheduler";

  }


  changeScheduleStatus() {
    return this.baseUrl + "changeschedulestatus";

  }

  createCategory() {
    return this.baseUrl + "createcategory";
  }

  getProductsByDistributerId() {
    return this.baseUrl + "getproductsbydistributerid/";
  }

  getProductsByCustomer() {
    return this.baseUrl + "getproductsbycustomerid/";
  }

  createProduct() {
    return this.baseUrl + "createproduct";
  }

  getProductCategory() {
    return this.baseUrl + "productcategory/";
  }

  getSuppliers() {
    return this.baseUrl + "supplierslist/";
  }

  getSuppliersForSync() {
    return this.baseUrl + "supplierslistforsync";
  }

  createSupplier() {
    return this.baseUrl + "createuser";
  }

  createSalesTeamMember() {
    return this.baseUrl + "createuser";
  }

  getSalesPersonsByDealerId() {
    return this.baseUrl + "getsalespersonsbydealerid";
  }

  getCustomers() {
    return this.baseUrl + "customers/";
  }

  getCustomersForSync() {
    return this.baseUrl + "customersforsync";
  }

  getDistributors() {
    return this.baseUrl + "getdistributorbydealerid";
  }

  getDistributorsForSync() {
    return this.baseUrl + "getdistributorbydealeridforsync";
  }

  getCustomersBySupplierID() {
    return this.baseUrl + "getcustomerbysupplierid/";
  }

  createCustomer() {
    return this.baseUrl + "createuser";
  }

  createMessageOnOrder() {
    return this.baseUrl + "createmessageonorder";
  }

  createDistributor() {
    return this.baseUrl + "createuser";
  }

  createOrder() {
    return this.baseUrl + "mcreateorder";
  }

  updateOrder() {
    return this.baseUrl + "updateorder";
  }

  assignOrder() {
    return this.baseUrl + "assignorder";
  }

  forwardOrder() {
    return this.baseUrl + "forwardorder";
  }

  assignBasket() {
    return this.baseUrl + "assignbasket";
  }

  orderByStatus() {
    return this.baseUrl + "orderlistbystatus";
  }

  imageDownload() {
    return this.baseUrl + "modules/uploads/";
  }

  orderDelivered() {
    return this.baseUrl + "deliveredorder";
  }

  changeOrderStatus() {
    return this.baseUrl + "changeorderstatus";
  }

  tracking() {
    return this.baseUrl + "tracking ";
  }

  getProfile() {
    return this.baseUrl + "user/user/";
  }

  updateProfile() {
    return this.baseUrl + "user";
  }

  mUpdateAvaliableCansForCustomer() {
    return this.baseUrl + "mupdateavaliablecansforcustomer";
  }

   getOrderDetails() {
   return this.baseUrl + "getorderbyid/"+APP_TYPE+"/";
 }

  setProductPrice() {
    return this.baseUrl + "setcustomer_wise_productprice";
  }

  assignStock() {
    return this.baseUrl + "massignproduct";
  }

  assignStockToSupplier() {
    return this.baseUrl + "massignproducttosupplier";
  }

  addArea() {
    return this.baseUrl + "addarea";
  }

  updateArea() {
    // updating area like subarea, mainarea, pincode by dealer
    return this.baseUrl + "updatearea";
  }

  addStock() {
    return this.baseUrl + "addstock";
  }

  addStockToDistriutor() {
    return this.baseUrl + "maddstocktodistributor";
  }

  stockRequestByDistributor() {
    return this.baseUrl + "mreqstockbydistributor";
  }

  addStockToStockPoint() {
    return this.baseUrl + "addstocktostockpoint";
  }

  imgUpload() {
    return this.baseUrl+ "uploadimg";
  }

  removeProduct() {
    return this.baseUrl + "removeproduct";
  }

  editProduct() {
    return this.baseUrl + "product";
  }

  editCategory() {
    return this.baseUrl + "updatecategory";
  }

  /*getAppVersion() {
  return this.baseUrl + "app/" + Utils.APP_TYPE + "/";
}*/

  changeAssociation() {
    return this.baseUrl + "changeassociation";
  }

  getAppFirstCall() {
    return this.baseUrl + "appfirstcall";
  }

  getPendingOrdersCount() {
    return this.baseUrl + "getcountofpendingordersbyuserid";
  }

  getAreasByPincode() {
    return this.baseUrl + "getareasbypincode/";
  }

  getAreasByPincodeForSync() {
    return this.baseUrl + "getareasbypincodeforsync";
  }

  //   getAppVersion() {
  // return this.baseUrl + "modules/uploads/apks/package.json";
  // }

  preOrderDeliveredBySupplier() {
    return this.baseUrl + "preordertodelivery";
  }

  getProductsByCategory() {
    return this.baseUrl + "getproductsbycategory";
  }

  cancelOrder() {
    return this.baseUrl + "cancelorder";
  }

  setGCMRegister() {
    return this.baseUrl + "setgcmdetails";
  }

  getSupplierLocation() {
    return this.baseUrl + "user_currentlocation/";
  }

  getFeedBack() {
    return this.baseUrl + "issue/";
  }

  createReplyToIssue() {
    return this.baseUrl + "createreplytoissue";
  }

  changeFeedbackStatus() {
    return this.baseUrl + "changeissuestatus";
  }

  setFeedBack() {
    return this.baseUrl + "issue";
  }

  removeCustomer() {
    return this.baseUrl + "changeuserstatus";
  }

  removeSupplier() {
    return this.baseUrl + "changeuserstatus";
  }

  getDealerFeedBack() {
    return this.baseUrl + "getfeed_back";
  }

  getDealerFeedBackForSync() {
    return this.baseUrl + "getfeed_backforsync";
  }

  /* getAreas() {
   return this.baseUrl + "getareasbydealerid/" + Utils.APP_TYPE + "/";
 }*/

  searchCustomer() {
    return this.baseUrl + "searchcustomer";
  }

  searchSupplier() {
    return this.baseUrl + "searchsuppliers";
  }

  getStockRequests() {
    return this.baseUrl + "getstockrequests";
  }

  searchOrders() {
    return this.baseUrl + "getorderlistbystatusfilters";
  }

  getStockHistory() {
    return this.baseUrl + "getstockhistory";
  }

  getSalesReport() {
    return this.baseUrl + "getsalesreport";
  }

  getCurrentSalesData() {
    return this.baseUrl + "getcurrentsalesdata";
  }

  getStockSalesByDistributor() {
    return this.baseUrl + "getstocksalesbydistributor";
  }

  addStockSale() {
    return this.baseUrl + "maddstocksale";
  }

  getPaymentDetails() {
    return this.baseUrl + "getpaymentdetails";
  }

  getPaymentDetailsByUserID() {
    return this.baseUrl + "getpaymentstbyuserid";
  }

  changeAllPaymentStatus() {
    return this.baseUrl + "changeallpaymentstatus";
  }

  getPaymentDetailsByDistributorID() {
    return this.baseUrl + "getpaymentsofdistributor_hist";
  }

  getCreditPaymentDetailsByUserID() {
    return this.baseUrl + "getbilldetailsofallcustomer";
  }

  getPaymentDetailsBySupplierID() {
    return this.baseUrl + "getpaymentsbyarea";
  }

  getSalesHistory() {
    return this.baseUrl + "getsaleshistory";
  }

  getPaymentsCollectedBySupplier() {
    return this.baseUrl + "getpaymentcollectionbysupplier";
  }

  getPaymentsByDistributorId() {
    return this.baseUrl + "getpaymentsbydistributorid";
  }

  makePaymentByCustomer() {
    return this.baseUrl + "makepayment";
  }

  makePaymentBySupplier() {
    return this.baseUrl + "makepaymentbysupplier";
  }

  makePaymentByDistributor() {
    return this.baseUrl + "makepaymentbydistributor";
  }

  getPaymentsOfAllDistributors() {
    return this.baseUrl + "getpaymentsofalldistributors";
  }

  changePaymentStatus() {
    return this.baseUrl + "changepaymentstatus";
  }

  changePaymentStatusByDistributor() {
    return this.baseUrl + "changepaymentstatusofdistributer";
  }

  changeStockStatusByDistributor() {
    return this.baseUrl + "changestockstatusbydistributor";
  }

  updateStockByDealer() {
    return this.baseUrl + "mupdatestock";
  }

  changeStockStatusBySupplier() {
    return this.baseUrl + "changestockstatusbysupplier";
  }

  changeStockRequestsStatus() {
    return this.baseUrl + "changestockrequeststatus";
  }

  changeStockRequestsStatusByDistributor() {
    return this.baseUrl + "mchangestockstatusbydistributor";
  }

  changePaymentStatusOfSupplier() {
    return this.baseUrl + "changepaymentstatusofsupplier";
  }

  getOrdersOfPaymentCycle() {
    return this.baseUrl + "getordersofpaymentcycle";
  }

  getShareInfo() {
    return this.baseUrl + "creategettemplates";
  }

  getBulKStatusUpdate() {
    return this.baseUrl + "bulkstatusupdate";
  }

  getNotificationResponse() {
    return this.baseUrl + "notificationresponse";
  }

  getDashboard() {
    return this.baseUrl + "dashboard";
  }

  getAdvanceAmount() {
    return this.baseUrl + "getadvanceamount";
  }

  getStockPointTransactions() {
    return this.baseUrl + "stockpoint";
  }

  getOffers() {
    return this.baseUrl + "offers";
  }

  getProductStockHistory() {
    return this.baseUrl + "getsaleshistoryfilters";
  }

  getSendSmsDistributor() {
    return this.baseUrl + "sendsmsdistributor";
  }

  getPolygon() {

    return this.baseUrl + "getpolygon";
  }

  createPolygon() {

    return this.baseUrl + "createpolygon";
  }

  getUserAvailability() {

    return this.baseUrl + "useravailability";
  }


  getPoints() {
    return this.baseUrl + "points";
  }

  getTracking() {

    return this.baseUrl + "tracking";
  }

  assignToSalesTeam() {

    return this.baseUrl + "changeassociation";
  }

}
