import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Helper} from "../../lib/services/Helper";
import {GlobalVars} from "../../lib/services/GlobalVars";
import {User} from "../../lib/models/user/User";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Auth} from "../../lib/services/Auth";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
    providers: [User]
})
export class SettingsPage {

    img:any = "assets/img/placeholder.png";
    url:any = GlobalVars.BaseUrl;
    orders: any = [];
    inLoad: any = false;
    orderby: any = "id";
    desc: any = "asc";
    services: any = [];
    pager: any = 50;
    user:any;
    toggle:boolean=false;
    changePassForm: any = new FormGroup({
        "old_password": new FormControl('', [Validators.required]),
        'new_password': new FormControl('', Validators.compose([Validators.required])),
        'confirmedPassword': new FormControl(null, [Validators.required ])
         });

    constructor(public navCtrl: NavController , public helper:Helper , public globalVars:GlobalVars,public auth:Auth) {

        this.globalVars.getUser().then(user => {
            this.user = user;

        });

        this.globalVars.userUpdated.subscribe(user => {
            this.user = user;
        });
    }

    loadData() {
        this.inLoad = true;

    }
    changePass(){
            this.inLoad=true;

        if (this.changePassForm.valid && this.changePassForm.get('new_password').value === this.changePassForm.get('confirmedPassword').value) {

            this.inLoad = false;
            this.auth.ChangePass(this.changePassForm.value).then(result => {

                let res = this.helper.handleResponse(result);
                if (res) {

                    this.helper.showMessage("Your Password changed" , 'Your Password successfully changed ');
                }
                else{
                    this.helper.showMessage("Your Old Password is Wrong" , 'Try again');
                }
            });
        }
        else {
            this.helper.showMessage('Your Password is not match','try again');
        }

    }


    logOut(){
        this.helper.showLoading();
        this.auth.logOutRequest().then( data => this.helper.hideLoading());
    }
}
