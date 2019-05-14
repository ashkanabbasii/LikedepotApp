import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {Helper} from "../../lib/services/Helper";
import {AuthenticatePage} from "../authentication/login/login";
import {GlobalVars} from "../../lib/services/GlobalVars";
@Component({
    selector: 'page-intro',
    templateUrl: 'introPage.html'
})
export class IntroPage {
    @ViewChild(Slides) slides: Slides;
    constructor(public navCtrl: NavController,public helper:Helper,public globalvars:GlobalVars) {

    }

    ionViewDidLoad()
    {
        setTimeout( () => {
            this.slides.update();
        } , 300);
    }

    ionViewDidEnter()
    {
        this.globalvars.inInHome.emit(true);
    }

    ionViewDidLeave(){
        this.globalvars.inInHome.emit(false);
    }

    next() {
        this.slides.slideNext();
    }
    goToHome(){
        this.helper.redirect(AuthenticatePage , {} , true);
        this.helper.root();
    }

}