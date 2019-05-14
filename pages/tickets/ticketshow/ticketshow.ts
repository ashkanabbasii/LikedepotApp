import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Helper} from "../../../lib/services/Helper";
import {GlobalVars} from "../../../lib/services/GlobalVars";
import {Ticket} from "../../../lib/models/ticket/Ticket";
import {Reply} from "../../../lib/models/reply/Reply";

@Component({
    selector: 'page-tickets-show',
    templateUrl: 'ticketshow.html',
    providers: [Ticket,Reply]
})
export class TicketShow {

    url:any = GlobalVars.BaseUrl;
    curentTitle: string = "Ticket";
    inLoad: any = false;
    desc: any = "asc";
    selectedTcket: any = [];
    user:any;
    pager: any = 50;
    replyText:any;

    constructor(public navCtrl: NavController, public params:NavParams,  public ticketModel: Ticket,public replyModel:Reply, public helper:Helper,public globalVars:GlobalVars) {
        this.selectedTcket = this.params.data;
        this.loadReplays();
        this.globalVars.getUser().then(user => {
            this.user = user;

        });

        this.globalVars.userUpdated.subscribe(user => {
            this.user = user;
        });
    }

    loadReplays(refresher = null) {
        this.inLoad = true;
        this.ticketModel.get(this.selectedTcket.id).then(result => {
            this.inLoad = false;

            this.globalVars.changeNumber.emit();


            let res = this.helper.handleResponse(result);
            if (res) {
                this.selectedTcket = res;
            }

            if (refresher) {
                refresher.complete();
            }

        });
    }

    saveReply()
    {
       this.helper.showLoading();
       this.replyModel.save({
           reply:this.replyText,
           ticket_id:this.selectedTcket.id,
       }).then( reply => {
           this.helper.hideLoading().then( () => {
               let res = this.helper.handleResponse(reply);
               this.selectedTcket.replies.push(res);
           });
       });
    }

}
