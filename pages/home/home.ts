import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Source} from "../../lib/models/source/Source";
import {Helper} from "../../lib/services/Helper";
import {GlobalVars} from "../../lib/services/GlobalVars";
import {ProductPage} from "../product/product";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [Source]
})
export class HomePage {

    img:any = "assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;
    productPage:any = ProductPage;
    sources: any = [];
    curentTitle: string = "Choose Your Target App :";
    inLoad: any = false;
    orderby: any = "name";
    desc: any = "asc";
    services: any = [];
    pager: any = 50;

    constructor(public navCtrl: NavController, public sourceModel: Source , public helper:Helper , public globalvars:GlobalVars) {
        this.loadData();
    }

    ionViewDidEnter()
    {
        this.globalvars.inInHome.emit(true);
    }

    ionViewDidLeave(){
        this.globalvars.inInHome.emit(false);
    }

    loadData() {
        this.inLoad = true;
        this.sourceModel.getAll({
            order: this.orderby,
            desc: this.desc,
            pager: this.pager
        }).then(data => {
            var res = this.helper.handleResponse(data);
            this.inLoad = false;
            if (res) {
                this.sources = res.items;
                this.sources.forEach(row => row.d = new Date().getTime().toString());
            }
        });
    }

}
