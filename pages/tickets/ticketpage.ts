import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Helper} from "../../lib/services/Helper";
import {GlobalVars} from "../../lib/services/GlobalVars";
import {Ticket} from "../../lib/models/ticket/Ticket";

import {TicketShow} from "./ticketshow/ticketshow";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'page-tickets',
    templateUrl: 'ticketpage.html',
    providers: [Ticket]
})
export class TicketPage {

    url:any = GlobalVars.BaseUrl;
    ticketShow:any = TicketShow;
    tickets: any = [];
    curentTitle: string = "Tickets";
    inLoad: any = false;
    orderby: any = "created_at";
    desc: any = "desc";
    pager: any = 50;
    user:any;

    compose:boolean=false;
    ticketForm: any = new FormGroup({
        "subject": new FormControl('', [Validators.required]),
        'message': new FormControl('', Validators.compose([Validators.required])),
    });
    constructor(public navCtrl: NavController, public ticketModel: Ticket , public helper:Helper , public globalVars:GlobalVars) {
        this.loadData();
        this.globalVars.getUser().then(user => {
            this.user = user;

        });

        this.globalVars.userUpdated.subscribe(user => {
            this.user = user;
        });
    }

    loadData(refresher:any = null) {
        if(!refresher)
        {
            this.inLoad = true;
        }
        this.ticketModel.getAll({
            order: this.orderby,
            desc: this.desc,
            pager: this.pager
        }).then(data => {
            let res = this.helper.handleResponse(data);
            this.inLoad = false;
            if (res) {
                this.tickets = res.items;
                this.compose =false;
            }

            if(refresher)
            {
                refresher.complete();
            }
        });
    }

    sendTicket(){

       if(this.ticketForm.valid){
           this.helper.showLoading();

           var object = this.ticketForm.value;
           object.user_id = this.user.user.id;


           this.ticketModel.save(object).then(data => {
               this.helper.hideLoading().then( () => {
                   var res = this.helper.handleResponse(data);
                   if (res){
                       this.helper.showToast("Your Ticket is submitted");
                       this.navCtrl.setRoot(TicketPage);
                   }
               });

           });
       }
    }

    showTicket(ticket) {
        ticket.view = 1;
        this.helper.redirect(this.ticketShow, ticket);
    }

}
