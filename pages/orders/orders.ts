import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Orders} from "../../lib/models/orders/Orders";
import {Helper} from "../../lib/services/Helper";
import {GlobalVars} from "../../lib/services/GlobalVars";
import {Ordersdetails} from "./ordersDetails/ordersdetails";

@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html',
    providers: [Orders]
})
export class OrdersPage {

    img:any = "assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;
    orderDetails:any = Ordersdetails;
    orders: any = [];
    curentTitle: string = "Orders";
    inLoad: any = false;
    orderby: any = "created_at";
    desc: any = "desc";
    services: any = [];
    pager: any = 50;
    user:any;

    constructor(public navCtrl: NavController, public orderModels: Orders , public helper:Helper , public globalVars:GlobalVars) {
        this.loadData();
    }

    loadData() {
        this.inLoad = true;
        this.orderModels.getAll({
            order: this.orderby,
            desc: this.desc,
            pager: this.pager
        }).then(data => {
            var res = this.helper.handleResponse(data);
            this.inLoad = false;
            if (res) {
                this.orders = res.items;
                console.log(this.orders);
            }
        });
    }

    orderView(order) {
        order.view = 1;
        this.helper.redirect(this.orderDetails, order);
    }

}
