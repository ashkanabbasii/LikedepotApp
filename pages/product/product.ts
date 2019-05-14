import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Select} from 'ionic-angular';
import {Source} from "../../lib/models/source/Source";
import {Helper} from "../../lib/services/Helper";
import {Product} from "../../lib/models/product/Product";
import {GlobalVars} from "../../lib/services/GlobalVars";
import {Orders} from "../../lib/models/orders/Orders";

@Component({
    selector: 'page-product',
    templateUrl: 'product.html',
    providers: [Product, Source , Orders]
})
export class ProductPage {

    img: any = "assets/img/placeholder.png";
    url: any = GlobalVars.BaseUrl;
    @ViewChild('myselect1') myselect1: Select;
    @ViewChild('myselect2') myselect2: Select;
    @ViewChild('myselect3') myselect3: Select;

    products: any = [];
    inLoad: any = false;
    title: string = "New Order";
    selectedSource: any;
    source: any;
    categories: any = [];
    categoriesItems: any = [];
    services: any = [];
    servicesItems: any = [];
    category: any = "";
    service: any = "";
    quantity: any = "";
    quantities: any = [];
    selectedProduct :any;
    step: number = 1;
    photo_url:any;
    constructor(public navCtrl: NavController, public sourceModel: Source, public ordersModel: Orders, public productModel: Product, public helper: Helper, public params: NavParams) {
        this.selectedSource = this.params.data;
        this.loadData();
    }

    loadData() {
        this.productModel.getAll({
            order: 'id',
            desc: 'asc',
            pager: 1000,
            source_id: this.selectedSource.id
        }).then(result => {
            let res = this.helper.handleResponse(result);
            if (res) {

                this.products = res.items;
                this.prepareData();

            }
        })

    }

    prepareData() {
        this.quantities = [];
        this.categories = [];
        this.services = [];
        this.categoriesItems = [];
        this.servicesItems = [];

        this.products.forEach(product => {

            if (!this.category || (this.category && product.cat_id == this.category)) {
                if (this.services.indexOf(product.service_id) == -1) {
                    this.services.push(product.service_id);
                    this.servicesItems.push(product.service);
                }
            }

            if (this.categories.indexOf(product.cat_id) == -1) {
                this.categories.push(product.cat_id);
                this.categoriesItems.push(product.category);
            }


            if (this.service && this.category && (product.service_id == this.service) && (product.cat_id == this.category)) {
                this.quantities.push({
                    q: product.quantity,
                    p: product.price,
                    s: product.service.name,
                    c: product.category.name
                });

            }

            if ((product.service_id == this.service) && (product.cat_id == this.category) && (product.quantity == this.quantity)) {
                this.selectedProduct = product;

            }

        });

    }

    nextStep() {
        this.prepareData();
        this.step = 2;
    }

    buyProduct()
    {
        if(this.selectedProduct && this.photo_url)
        {
            this.helper.showLoading();
            this.ordersModel.checkOrderAvailable(this.selectedProduct.id).then( result => {
                var res = this.helper.handleResponse(result);
                if(res)
                {
                    this.ordersModel.save({
                        "product_id" : this.selectedProduct.id,
                        "link" : this.photo_url
                    }).then( result =>{
                        this.helper.hideLoading().then( () => {
                            let res = this.helper.handleResponse(result);

                            if(res)
                            {
                                this.helper.showToast("Order registered success");
                                this.step = 3;
                            }
                        });
                    })
                }
                else{
                    this.helper.hideLoading();
                }

            });
        }
        else {
            this.helper.showToast("Please enter product and photo url");
        }
    }
    backing()
    {
        if(this.step == 1 || this.step == 3)
        {
            this.helper.back();
        }
        else{
            this.step = 1;
        }
    }

    reset()
    {
        this.service = '';
        this.quantity = '';
    }
    ionViewWillLeave()
    {
        this.myselect1 && this.myselect1.close();
        this.myselect2 && this.myselect2.close();
        this.myselect3 && this.myselect3.close();
    }
}
