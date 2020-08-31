
cc.Class({

    extends: cc.Component,

    properties: {
        lb_bonus: {
            default: null,
            type: cc.Label
        },
        lb_chip: {
            default: null,
            type: cc.Label
        },
        lb_price: {
            default: null,
            type: cc.Label
        },
        lb_rate: {
            default: null,
            type: cc.Label
        },
        partner: "",
        url_l: "",
        amount: 0,
        payType: 0,
        shop: null,
        line: {
            default: null,
            type: cc.Sprite
        }
    },

    init (data, partner, url, payType, shop) {
        // cc.NGWlog('---> Data Item ', data);
        cc.NGWlog('----> State: ' + partner + ' Url: ' + url + " PayType: " + payType);
        // amount: 0.99
        // baseChip: 1000000
        // chip: 1800
        // gameCurency: "Chips"
        // localCurency: "$"
        // mDisplay: "1,800 Chips"
        // mDisplayAmount: "$0.99"
        // mDisplayBaseChip: "1,000,000 Chips"
        // percentBonus: 20
        this.shop = shop;
        this.partner = partner;
        this.url_l = url;
        this.payType = payType;
        if (this.partner === 'iap') {
            this.amount = data.cost;
        } else
            this.amount = data.amount;

        if (data.percentBonus > 0) {
            this.lb_bonus.string = "+" + data.percentBonus + "%";
            this.lb_bonus.node.active = true;
            this.lb_rate.node.active = true;
        } else {
            this.lb_bonus.node.active = false;
            this.lb_rate.node.active = false;
        }

        this.lb_chip.string = require('GameManager').getInstance().formatNumber(data.chip);
        this.lb_price.string = data.mDisplayAmount;
        this.lb_rate.string = require('GameManager').getInstance().formatNumber(data.baseChip);
        this.line.node.width = this.lb_rate.node.width + 4;
        this.line.node.position = cc.v2(this.line.node.width / 2 - 2, 3);
        this.lb_bonus.node.position = cc.v2(this.lb_chip.node.width,0);

    },

    onClickPrice() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickPrice_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        let otps = {};
        if (IS_RUN_INSTANT_FACEBOOK) {

            FBInstant.payments.onReady(function () {
                cc.NGWlog('Payments Ready!');
            });
            cc.NGWlog('----------------purchase id  ', this.partner);


            FBInstant.payments.purchaseAsync({
                productID: this.partner,
                developerPayload: 'lengbear',
            }).then(function (purchase) {
                cc.NGWlog('----------------Handling a purchase   ');
                cc.NGWlog(purchase);
                cc.NGWlog(purchase.signedRequest);
                FBInstant.payments.consumePurchaseAsync(purchase.purchaseToken).then(function () {
                    require('NetworkManager').getInstance().sendIAPFacebookInstant(JSON.stringify(purchase), purchase.signedRequest);
                }).catch(function (error) {
                    require('GameManager').getInstance().onShowConfirmDialog("Mua lỗi");
                });

                // { isConsumed: false, paymentID: "64000038701129", productID: "com.pack.1", purchaseTime: 1547777116, purchaseToken: "949171001941681", … }
                
                
            });
        } else {
            let str_lik = '';
            cc.NGWlog("partner: " + this.partner);
            if (this.partner === 'coda') {
                // this.shop.onInputPhone();
                // return;
                str_lik = require('GameManager').getInstance().u_p;
                // str_lik = str_lik.replace("%uid%", require('GameManager').getInstance().user.id);
                // str_lik = str_lik.replace("%price%", this.amount);
                // str_lik = str_lik.replace("%paytype%", this.payType);
                otps.isPrice = this.amount;
                otps.isPayType = this.payType;
            } else if (this.partner === 'wing') {
                str_lik = require('GameManager').getInstance().u_p_wing;
               // str_lik = str_lik.replace("%uid%", require('GameManager').getInstance().user.id);
                otps.isPrice = this.amount;
            }
            else if (this.partner === 'easypoint') {
                
                Global.ShopView.inputPhoneNumber.string = '';
                Global.ShopView.inputPhoneNumber.setFocus();
            }
             else if (this.partner === 'iap') {
                cc.NGWlog('---------> IAP:  ', (require('GameManager').getInstance().bundleID + "." + this.amount));
                require('Util').onBuyIap((require('GameManager').getInstance().bundleID + "." + this.amount));
                return;
            }
            cc.NGWlog("str_lik: " + str_lik);
            if (str_lik === '') return;
            require("UIManager").instance.OpenWebviewNapTien(str_lik , otps);
           
        }
    },
});

