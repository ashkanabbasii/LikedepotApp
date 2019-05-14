import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {Auth} from "../../../lib/services/Auth";
import {Helper} from "../../../lib/services/Helper";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {HomePage} from "../../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'register.html'
})
export class RegisterPage{

    registerForm: any = new FormGroup({
        "name": new FormControl('', [Validators.required]),
        "email": new FormControl('', [Validators.required]),
        "username": new FormControl('', [Validators.required]),
        "password": new FormControl('', [Validators.required])
    });
    constructor(public navCtrl: NavController ,public auth: Auth, public helper: Helper) {
    }

    register()
    {

        if(this.registerForm.valid)
        {
            this.helper.showLoading();
            this.auth.registerRequest(this.registerForm.value).then( data => {
                var res = this.helper.handleResponse(data);
                if(res)
                {
                    this.auth.authRequest({
                        "username" : this.registerForm.value.username,
                        "password" : this.registerForm.value.password})
                        .then( result => {
                            this.helper.hideLoading().then(() => {
                                var res = this.helper.handleResponse(result);
                                if (res) {
                                    this.auth.authenticate(res);
                                    this.navCtrl.setRoot(HomePage);
                                    this.navCtrl.popToRoot();
                                }
                            });
                        });
                }
                else{
                    this.helper.hideLoading();
                }
               console.log(data);
            });

        }
    }
}
