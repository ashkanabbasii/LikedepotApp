import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {Auth} from "../../../lib/services/Auth";
import {Helper} from "../../../lib/services/Helper";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {RegisterPage} from "../register/register";
import {HomePage} from "../../home/home";
import {ForgetPage} from "../forget/forget";
import {GlobalVars} from "../../../lib/services/GlobalVars";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class AuthenticatePage {

    registerPage: any = RegisterPage;
    forgetPage: any = ForgetPage;

    loginForm: any = new FormGroup({
        "username": new FormControl('', [Validators.required]),
        'password': new FormControl('', Validators.compose([Validators.required])),
    });

    constructor(public navCtrl: NavController, public auth: Auth, public helper: Helper,public globalvars:GlobalVars) {
    }

    ionViewDidEnter()
    {
        this.globalvars.inInHome.emit(true);
    }

    ionViewDidLeave(){
        this.globalvars.inInHome.emit(false);
    }

    login() {
        if (this.loginForm.valid) {
            this.helper.showLoading();
            this.auth.authRequest(this.loginForm.value).then(data => {
                this.helper.hideLoading().then(() => {
                    var res = this.helper.handleResponse(data);
                    if (res) {
                        this.auth.authenticate(res);
                        this.navCtrl.setRoot(HomePage);
                        this.navCtrl.popToRoot();
                    }
                });
            })
        }
    }
}
