import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Select} from 'ionic-angular';
import {Orders} from "../../../lib/models/orders/Orders";
import {Helper} from "../../../lib/services/Helper";
import {GlobalVars} from "../../../lib/services/GlobalVars";
import {Clipboard} from "@ionic-native/clipboard";
import {Transaction} from "../../../lib/models/transaction/Transaction";
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

@Component({
    selector: 'page-add-wallet',
    templateUrl: 'addwallet.html',
    providers: [Orders , Clipboard,Transaction]
})
export class Addwallet {
    url:any = GlobalVars.BaseUrl;
    curentTitle: string = "Wallet";
    inLoad: any = false;
    desc: any = "asc";
    user: any;
    pager: any = 50;
    amount  :string= "0";
    method :any=null;
    priceSelection :any=[];
    priceNumbers :any=0;

    @ViewChild('myselect') myselect: Select;


    constructor(public navCtrl: NavController, public params:NavParams , public helper:Helper,public globalVars :GlobalVars,public transactionModel:Transaction,private payPal: PayPal) {

        this.globalVars.getUser().then(user => {
            this.user = user;

        });

        this.globalVars.userUpdated.subscribe(user => {
            this.user = user;
        });

        if(this.priceNumbers == 0){

            this.priceSelection = [5,10,20,50,100];
        }


    }



    buyProduct()
    {

        this.payPal.init({
            PayPalEnvironmentProduction: 'AfuuRucMjHKY-ipQbP4N5cKZRvR-wRrYWkXJpa5oWVxSBXbx9a7oT1XDnu5VqBy4OjNtYgf3B23GpsQr',
            PayPalEnvironmentSandbox: 'ASVZvRA0L3_a9iZ0KPDIAq5JpfJVsATOL-qvkganTHrw2Ssdwye6WeB2pVg7_VBvjvHpG-wb0DkFVH-g'
        }).then(() => {

            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
                // Only needed if you get an "Internal Service Error" after PayPal login!
                //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            })).then(() => {
                let payment = new PayPalPayment(this.amount, 'USD', 'Description', 'sale');
                this.payPal.renderSinglePaymentUI(payment).then((success) => {
                    console.log(success);
                    // Successfully paid

                    this.transactionModel.save({
                        "type" : "PayPal",
                        "ref_id" : success.response.id,
                        "amount" : this.amount
                    }).then( data =>{
                        this.helper.hideLoading().then( () => {
                            let res = this.helper.handleResponse(data);
                            if(res)
                            {
                                this.helper.showToast("Your wallet charged successfully .");
                                this.helper.back();
                            }
                        });
                    });
                    // Example sandbox response
                    //
                    // {
                    //   "client": {
                    //     "environment": "sandbox",
                    //     "product_name": "PayPal iOS SDK",
                    //     "paypal_sdk_version": "2.16.0",
                    //     "platform": "iOS"
                    //   },
                    //   "response_type": "payment",
                    //   "response": {
                    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                    //     "state": "approved",
                    //     "create_time": "2016-10-03T13:33:33Z",
                    //     "intent": "sale"
                    //   }
                    // }
                }, () => {
                    this.helper.showToast("payment failed")
                    // Error or render dialog closed without being successful
                });
            }, () => {
                this.helper.showToast("payment failed")
                // Error in configuration
            });
        }, () => {
            this.helper.showToast("payment failed")
            // Error in initialization, maybe PayPal isn't supported or something else
        });

    }




    set changeOptions(optionValue: boolean) {

        if(optionValue)
        {
            this.priceSelection=[];
            for (let i = 5 ; i <= 100; i = i + 5){
                this.priceSelection.push(i.toString());
            }
        }
        else{
            this.priceSelection = [5,10,20,50,100];
        }

        this.amount = '';
        this.myselect.value = '';
        setTimeout(() =>{
            this.amount = '';
            this.myselect.value = '';
            this.myselect.getNativeElement().click();
        } , 700);
    }

    ionViewWillLeave()
    {
        this.myselect && this.myselect.close();
    }
}
