import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Orders} from "../../lib/models/orders/Orders";
import {Helper} from "../../lib/services/Helper";
import {GlobalVars} from "../../lib/services/GlobalVars";
import {Addwallet} from "./addwallet/addwallet";
import {Auth} from "../../lib/services/Auth";

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html',
    providers: [Orders]
})
export class WalletPage {

    img:any = "assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;
    addwallet:any = Addwallet;
    orders: any = [];
    inLoad: any = false;
    orderby: any = "id";
    desc: any = "asc";
    services: any = [];
    pager: any = 50;
    user:any;

    constructor(public navCtrl: NavController, public orderModels: Orders , public helper:Helper , public globalVars:GlobalVars, public auth:Auth) {


    }

    ionViewDidEnter()
    {
        this.inLoad = true;
        this.auth.getUser().then(data => {
            this.inLoad = false;
            let res = this.helper.handleResponse(data);
            if (res) {
                this.globalVars.getUser().then(user => {
                    user.user = res;
                    this.globalVars.setUser(user);
                });
            }

            this.globalVars.userUpdated.subscribe(user => {
                this.user = user;
            });
        });
    }


}
