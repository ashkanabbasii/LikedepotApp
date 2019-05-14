import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Orders} from "../../../lib/models/orders/Orders";
import {Helper} from "../../../lib/services/Helper";
import {GlobalVars} from "../../../lib/services/GlobalVars";
import {OrdersPage} from "../orders";
import { Clipboard } from '@ionic-native/clipboard';
import {Transaction} from "../../../lib/models/transaction/Transaction";

@Component({
    selector: 'page-orders-details',
    templateUrl: 'ordersdetails.html',
    providers: [Orders,Transaction]
})
export class Ordersdetails {

    img:any = "assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;
    curentTitle: string = "Orders";
    inLoad: any = false;
    desc: any = "asc";
    selectedOrder: any = [];

    pager: any = 50;

    constructor(public navCtrl: NavController, public params:NavParams,  public orderModels: Orders , public helper:Helper,private clipboard: Clipboard,public globalvars :GlobalVars) {
        this.selectedOrder = this.params.data;

        this.orderModels.get(this.selectedOrder.id).then((order) => {
            this.globalvars.changeNumber.emit()
        });

    }

    copyOrderId(text){

        this.clipboard.copy(text);
        this.helper.showToast("copied to clipboard")
    }

    cancelOrder(){

        this.inLoad = true;
        this.orderModels.cancelOrder(this.selectedOrder.id).then(data=>{
            this.inLoad = false;
            var res = this.helper.handleResponse(data);

            if(res){

                this.helper.showToast("You Canceled Your Order");
                this.helper.redirect(OrdersPage,[],true);

            }
        });

    }





}
