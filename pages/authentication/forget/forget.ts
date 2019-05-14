import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {Auth} from "../../../lib/services/Auth";
import {Helper} from "../../../lib/services/Helper";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Forgetpass} from "../../../lib/models/password/forgetpass";


@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
  providers : [Forgetpass]
})
export class ForgetPage {

    send:boolean = false;
    forgetForm: any = new FormGroup({
        "email": new FormControl('', [Validators.required]),
    });
    changePassForm: any = new FormGroup({
        'new_password': new FormControl('', Validators.compose([Validators.required])),
        'confirmedPassword': new FormControl(null, [Validators.required ])
    });

    reset:boolean=false;
    constructor(public navCtrl: NavController, public auth: Auth, public helper: Helper,public forgetPass:Forgetpass) {

    }

    resetPass(){

        if(this.forgetForm.valid){
            this.helper.showLoading();
            this.forgetPass.save(this.forgetForm.value).then(data=>{

                this.helper.handleResponse(data);
                this.helper.hideLoading();
                if(!data.hasError){

                     this.send= true;

                }

            });
        }
        else{
            this.helper.hideLoading();
            this.helper.showToast('Please Enter Correct type of Email');
        }

    }
}
