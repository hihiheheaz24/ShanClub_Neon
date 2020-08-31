var TAB_TYPE = cc.Enum({
    SMS: 0,
    WAVE : 1,
    EASYPOINT : 2,
    IAP : 3,
    REDDOT: 4,
    MERCHANT:5
});
const GameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        lb_chip: {
            default: null,
            type: cc.Label
        },
        listSpriteFrameIconNet: {//0 - SMS, 1 - WAVE, 2-EASYPOINT, 3-IAP, 4-REDDOT
            default: [],
            type: [cc.SpriteFrame]
        },
        listSpriteFrameTabLef: {//0 - active, 1-deactive
            default: [],
            type: [cc.SpriteFrame]
        },
        listSpriteFrameTabRight: {//0 - active, 1-deactive
            default: [],
            type: [cc.SpriteFrame]
        },
        listButtonTabLeft: {
            default: [],
            type: [cc.Button],
            visible: false
        },
        listButtonTabRight: {//0-Smart, 1-CellCard
            default: [],
            type: [cc.Button]
        },

        listItemShop: {
            default: [],
            type: [require('ItemShop')]
        },

        prefabTabNet: {
            default: null,
            type: cc.Node
        },

        prefabItemShop: {
            default: null,
            type: cc.Node
        },

        listViewTabNet: {
            default: null,
            type: cc.ScrollView
        },
        listViewContent: {
            default: null,
            type: cc.ScrollView
        },
        ListAgencyScrollView: {
            default: null,
            type: cc.ScrollView
        },
        cur_tab_left: -1,
        cur_tab_right: -1,

        editPhoneNumber: {
            default: null,
            type: cc.EditBox
        },
        amountFortumo: 0,
        webView: cc.WebView,
        icon_ios: {
            default: null,
            type: cc.SpriteFrame
        },
        inputPhoneNumber:{
            default: null,
            type: cc.EditBox
        },
        _userVip:0,
        itemListAgency: {
            default: null,
            type: cc.Prefab
        },
        listBotListView: {
            default: [],
            type:[cc.Node],
        },
        node_view : {
            default: null,
            type : cc.Node
        }
    },

    start() {
        cc.NGWlog('ShopView: Chay vao start!');
        this.onClickTabRight(this.listButtonTabRight[0], 1);
        // this.init();
    },

    onEnable() {
        cc.NGWlog('ShopView: Chay vao onEnable!');
        this.list_net = ["SMS", "WAVEMONEY", "EASY POINT", "IAP", "REDDOT", "MERCHANT"],
        this._userVip = GameManager.getInstance().user.vip;
      //  this._userVip = 5;
        this.updateChip();
        this.cur_tab_left = -1;

        this.initTabLeft();
    },

    initTabLeft() {
        // cc.sys.os = cc.sys.OS_IOS;//duy test
        //0 - SMS, 1 - wave , 2-easy_point, 3-iap, 4-reddot
        if (this.listButtonTabLeft.length === 0) {
            for (let i = 0; i < this.listSpriteFrameIconNet.length; i++) {
                let obj = cc.instantiate(this.prefabTabNet).getComponent(cc.Button);
                obj.node.active = true;
                this.listViewTabNet.content.addChild(obj.node);
                this.listButtonTabLeft.push(obj);

                if(i === 3){
                    if (cc.sys.os === cc.sys.OS_IOS) {
                        obj.node.getChildByName('IconNet').getComponent(cc.Sprite).spriteFrame = this.icon_ios;
                        obj.node.getChildByName('IconNet').active = true;
                        obj.node.getChildByName('lbNet').active = false;
                    } else{
                        obj.node.getChildByName('lbNet').getComponent(cc.Label).string = this.list_net[i];
                    }
                }else{
                    obj.node.getChildByName('lbNet').getComponent(cc.Label).string = this.list_net[i];
                }

                var eventHandler = new cc.Component.EventHandler();
                eventHandler.target = this.node;
                eventHandler.component = "ShopView";
                eventHandler.handler = "onClickTab"
                eventHandler.customEventData = i;

                obj.clickEvents.push(eventHandler);
            }
        }


        if(this._userVip < GameManager.getInstance().request_vip_payment ){
            GameManager.getInstance().dcb_ceoda.state = false;
            GameManager.getInstance().wave.state = false;
            GameManager.getInstance().easy_point.state = false;
            GameManager.getInstance().reddot.state = false;
        }else{
            GameManager.getInstance().dcb_ceoda.state = GameManager.getInstance().dcb_ceoda_save.state;
            GameManager.getInstance().wave.state = GameManager.getInstance().wave_save.state;
            GameManager.getInstance().easy_point.state = GameManager.getInstance().easy_point_save.state;
            GameManager.getInstance().reddot.state = GameManager.getInstance().reddot_save.state;
        }
        
//////////////////////////////////FIX CUNG///////////////////////////////////
        // GameManager.getInstance().dcb_ceoda.state = false;
        // GameManager.getInstance().wave.state = false;
        // GameManager.getInstance().easy_point.state = false;
        // GameManager.getInstance().reddot.state = false;
        // GameManager.getInstance().is_agency_shop = false;
        //if(!cc.sys.isNative) GameManager.getInstance().iap_config = false;
        //GameManager.getInstance().is_agency_shop = false;
//////////////////////////////////FIX CUNG///////////////////////////////////


        




        let isClick = -1;

        for (let i = 0; i < this.listButtonTabLeft.length; i++) {
            if (i === TAB_TYPE.SMS) {// && !GameManager.getInstance().dcb_ceoda.state) {
                if (GameManager.getInstance().dcb_ceoda.v > this._userVip ) {
                    this.listButtonTabLeft[i].node.active = false;
                }else{
                    this.listButtonTabLeft[i].node.active = true;
                }
                    
            } else if (i === TAB_TYPE.WAVE) {
                if (GameManager.getInstance().wave.v > this._userVip) {
                    this.listButtonTabLeft[i].node.active = false;
                } else if (isClick === -1) {
                    isClick = i;
                }

                if(GameManager.getInstance().wave.v <= this._userVip) {
                    this.listButtonTabLeft[i].node.active = true;
                }

            } else if (i === TAB_TYPE.EASYPOINT) {
                if (GameManager.getInstance().easy_point.v > this._userVip) {
                    this.listButtonTabLeft[i].node.active = false;
                } else if (isClick === -1) {
                    isClick = i;
                }


                if(GameManager.getInstance().easy_point.v <= this._userVip) {
                    this.listButtonTabLeft[i].node.active = true;
                }
            } else if (i === TAB_TYPE.IAP) {// if (i == 3 && !GameManager.getInstance().wave) continue;
            if (GameManager.getInstance().iap_config.v > this._userVip)
                    this.listButtonTabLeft[i].node.active = false;
                else if (isClick === -1) {
                    isClick = i;
                }

                if(GameManager.getInstance().iap_config.v <= this._userVip) {
                    this.listButtonTabLeft[i].node.active = true;
                }
            } else if (i === TAB_TYPE.REDDOT) {
                if (GameManager.getInstance().reddot.v > this._userVip) {
                    this.listButtonTabLeft[i].node.active = false;
                } else if (isClick === -1) {
                    isClick = i;
                }

                if(GameManager.getInstance().reddot.v <= this._userVip) {
                    this.listButtonTabLeft[i].node.active = true;
                }
            }

        }


        isClick = -1;

        for (let i = 0; i < this.listButtonTabLeft.length; i++) {
            if (i === TAB_TYPE.SMS) {// && !GameManager.getInstance().dcb_ceoda.state) {
                if (GameManager.getInstance().dcb_ceoda.state === true) {
                    
                    let hi = false;
                    for (let j = 0; j < GameManager.getInstance().dcb_ceoda.p.length; j++) {
                        if (GameManager.getInstance().dcb_ceoda.p[j] === true) {
                            hi = true;
                            cc.NGWlog("chay vao ceoda=============");
                            break;
                        }
                    }
                    if (hi === false) {
                        cc.NGWlog("chay vao ceoda=============2");
                        this.listButtonTabLeft[i].node.active = false;
                    } else {
                        isClick = i;
                    }
                } else
                    this.listButtonTabLeft[i].node.active = false;
            } 

            else if (i === TAB_TYPE.WAVE) {
                if (!GameManager.getInstance().wave.state) {
                    this.listButtonTabLeft[i].node.active = false;
                } else if (isClick === -1) {
                    isClick = i;
                }
            } 

            else if (i === TAB_TYPE.EASYPOINT) {
                if (!GameManager.getInstance().easy_point.state) {
                    this.listButtonTabLeft[i].node.active = false;
                } else if (isClick === -1) {
                    isClick = i;
                }
            }

            else if (i === TAB_TYPE.IAP) {// if (i == 3 && !GameManager.getInstance().wave) continue;
                if (!GameManager.getInstance().iap_config)
                    this.listButtonTabLeft[i].node.active = false;
                else if (isClick === -1) {
                    isClick = i;
                }
            }

            else if (i === TAB_TYPE.REDDOT) {
                if (!GameManager.getInstance().reddot.state) {
                    this.listButtonTabLeft[i].node.active = false;
                } else if (isClick === -1) {
                    isClick = i;
                }
            }
          
        }

        let widgetCom = this.listViewContent.node.getComponent(cc.Widget);

        if (GameManager.getInstance().iap_config
            && !GameManager.getInstance().dcb_ceoda.state
            && !GameManager.getInstance().wave.state
            && !GameManager.getInstance().easy_point.state
            && !GameManager.getInstance().reddot.state
            && !GameManager.getInstance().is_agency_shop) {
            this.listButtonTabLeft[TAB_TYPE.IAP].node.active = false;
            //widgetCom.HorizontalCenter = true;
            widgetCom.left = false;
            widgetCom.right = false;
            widgetCom.top = true;
            widgetCom.bottom = true;
            widgetCom.top = 120;
            widgetCom.bottom = -70;

            widgetCom.updateAlignment();

            for (let i = 0; i < this.listBotListView.length; i++) {
                this.listBotListView[i].active = false;
            }
        }

        if (IS_RUN_INSTANT_FACEBOOK) {
            this.listViewTabNet.node.active = false;
            widgetCom.HorizontalCenter = true;
            widgetCom.left = false;
            widgetCom.right = false;
            widgetCom.updateAlignment();
        }

        if (!GameManager.getInstance().is_agency_shop) {
            this.listButtonTabLeft[TAB_TYPE.MERCHANT].node.active = false;
        }

       
        this.cur_tab_right = 0;
        let boo = false;
        let indR = -1;
        for (let i = 0; i < GameManager.getInstance().dcb_ceoda.p.length; i++) {
            if (i < this.listButtonTabRight.length) {
                if (GameManager.getInstance().dcb_ceoda.p[i] === 0) {
                    this.listButtonTabRight[i].node.active = false;
                } else {
                    this.listButtonTabRight[i].node.active = true;
                    if (indR === -1)
                        indR = i;
                    if (GameManager.getInstance().dcb_ceoda.p[i] === 1) 
                        GameManager.getInstance().listDCB[i].partner = "coda";
                }
            }
        }

        if (this.listButtonTabRight[0].node.active && this.listButtonTabRight[1].node.active) {
            this.listButtonTabRight[0].node.x = -this.listButtonTabRight[0].node.width * .5;
            this.listButtonTabRight[1].node.x = this.listButtonTabRight[0].node.width * .5;
        } else if (this.listButtonTabRight[0].node.active) {
            this.listButtonTabRight[0].node.x = 0;
        } else if (this.listButtonTabRight[1].node.active) {
            this.listButtonTabRight[1].node.x = 0;
        }

        if (!boo && indR !== -1) {
            this.onClickTabRight(this.listButtonTabRight[indR], 1);
        }

        
        cc.NGWlog('=-=-=-=-===   ', isClick);
        if (isClick !== -1 && isClick < this.listButtonTabLeft.length)
            this.onClickTab(this.listButtonTabLeft[isClick], null);
    },
    //Phan duoi nay se xoa het
    moveUp() {
        return;
        GameManager.getInstance().setCurView(CURRENT_VIEW.PAYMENT);
        this.node.position = cc.v2(0, 0);
        this.updateChip();

        //  this.reloadListview();
    },
    updateChip() {
        this.lb_chip.string = GameManager.getInstance().formatNumber(GameManager.getInstance().user.ag);
    },
    

    reloadListview() {
        if (IS_RUN_INSTANT_FACEBOOK) {
            cc.NGWlog('reload list view shop');
            this.listViewContent.node.height = cc.winSize.height * 0.8;
            let listDataIAP = require('GameManager').getInstance().listIAP;
            for (let i = 0; i < listDataIAP.length; i++) {
                let item = null;
                if (i < listDataIAP.length) {
                    item = listDataIAP[i];
                } else {
                    item = cc.instantiate(this.prefabItemShop).getComponent('ItemShop');
                    this.listViewContent.content.addChild(item.node);
                    this.listItemShop.push(item);

                }
                item.node.active = true;
                item.init(require('GameManager').getInstance().listIAP[i], cc.js.formatStr("com.pack.%d", require('GameManager').getInstance().listIAP[i].cost), "", "", this);
                cc.NGWlog('add item shop');
            }
            return;
        }
        var listData = [];
        var listNum = 0;
        let payType;
        let partner;

        var str_lik = GameManager.getInstance().u_p;
        cc.NGWlog('----> vao day 28989898989 ', this.cur_tab_left);
        switch (this.cur_tab_left) {//0 - SMS, 1 - WAVE, 2-easy, 3-iap, 4-REDDOT
            case TAB_TYPE.SMS://SMS
                this.inputPhoneNumber.node.getParent().getParent().active = false;
                //this.listButtonTabRight[0].node.getParent().active = true;
                this.listViewContent.node.height = cc.winSize.height * 0.73;//500
                this.listViewContent.getComponent(cc.Widget).top = 120;
                this.node_view.height = cc.winSize.height * 0.68;
                if (this.cur_tab_right < GameManager.getInstance().listDCB.length) {
                    listData = GameManager.getInstance().listDCB[this.cur_tab_right].items;
                    payType = GameManager.getInstance().listDCB[this.cur_tab_right].payType;
                    partner = GameManager.getInstance().listDCB[this.cur_tab_right].partner;

                    cc.NGWlog('----> vao day 1 ', partner);
                } 
                break;
            case TAB_TYPE.WAVE://WAVE
                this.inputPhoneNumber.node.getParent().getParent().active = false;
                this.listButtonTabRight[0].node.getParent().active = false;
                this.listViewContent.node.height = cc.winSize.height * 0.73;//580;
                this.node_view.height = cc.winSize.height * 0.68;
                this.listViewContent.getComponent(cc.Widget).top = 120;
                listData = GameManager.getInstance().listWave[0].items;
                payType = GameManager.getInstance().listWave[0].payType;
                partner = GameManager.getInstance().listWave[0].partner;

                break;
            case TAB_TYPE.EASYPOINT://cell card
                this.inputPhoneNumber.node.getParent().getParent().active = true;
                this.node_view.height = cc.winSize.height * 0.6;
                this.listButtonTabRight[0].node.getParent().active = false;
                this.listViewContent.node.height = cc.winSize.height * 0.73;//580;
                this.listViewContent.getComponent(cc.Widget).top = 200;
                listData = GameManager.getInstance().listEasyPoint;
                partner = 'easypoint';
                break;

            case TAB_TYPE.IAP://iap
                this.inputPhoneNumber.node.getParent().getParent().active = false;
                this.listViewContent.node.height = cc.winSize.height * 0.73;//580;
                this.listViewContent.getComponent(cc.Widget).top = 120;
                this.node_view.height = cc.winSize.height * 0.68;
                this.listButtonTabRight[0].node.getParent().active = false;
                listData = GameManager.getInstance().listIAP;
                partner = 'iap';
                break;
            case TAB_TYPE.REDDOT://REDDOT
                this.inputPhoneNumber.node.getParent().getParent().active = false;

                cc.NGWlog('----> vao day 4 ', partner);

                this.listButtonTabRight[0].node.getParent().active = false;
                this.node_view.height = cc.winSize.height * 0.68;
                this.listViewContent.node.height = cc.winSize.height * 0.73;//580;
                this.listViewContent.getComponent(cc.Widget).top = 120;
                listData = GameManager.getInstance().listReddot[0].items;
                payType = GameManager.getInstance().listReddot[0].payType;
                partner = GameManager.getInstance().listReddot[0].partner;

                break;
        }
        cc.NGWlog('-=-=-=-=====>   partner: ', partner);
        cc.NGWlog('-=-=-=-=====>   data: ', listData);
        if (partner === 'coda') {
            str_lik = GameManager.getInstance().u_p;
        }
        else if(partner === 'easypoint')
            str_lik = GameManager.getInstance().u_ep;

        if (listData.length < this.listItemShop.length) {
            for (let i = listData.length; i < this.listItemShop.length; i++) {
                this.listItemShop[i].node.active = false;
            }
        }
        let booCo = false;
        for (let i = 0; i < listData.length; i++) {
            let itemS = null;
            if (i < this.listItemShop.length) {
                itemS = this.listItemShop[i];
            } else {
                itemS = cc.instantiate(this.prefabItemShop).getComponent('ItemShop');
                // this.itemS;
                this.listViewContent.content.addChild(itemS.node);
                this.listItemShop.push(itemS);
                booCo = true;

            }
            itemS.node.setScale(0);
            itemS.node.active = true;
            itemS.init(listData[i], partner, str_lik, payType, this);
            itemS.node.stopAllActions();
            itemS.interactable = false;
            itemS.node.runAction(cc.sequence(cc.delayTime(i * 0.1), cc.scaleTo(.1, 1.0).easing(cc.easeBackOut()), cc.callFunc(() => {
                itemS.interactable = true;
            })));
            if (cc.sys.os === cc.sys.OS_IOS) {
                if(GameManager.getInstance().bundleID === "com.yogame.contractsniper"){
                    if((listData[i].cost == 50 || listData[i].cost == 100) && partner === 'iap'){
                        itemS.node.active = false;
                    }
                }else if(GameManager.getInstance().bundleID === "pe.csn.bcr"){
                    if((listData[i].cost == 20 || listData[i].cost == 50 || listData[i].cost == 100) && partner === 'iap'){
                        itemS.node.active = false;
                    }
                }
                
            } else {
                if (GameManager.getInstance().bundleID === "csn.shan.club.online") {
                    if (listData[i].cost == 2 && partner === 'iap') {
                        itemS.node.active = false;
                    }
                }
            }
        }
        if (booCo && this.listViewContent.node.active === false) {
            this.listViewContent.node.active = true;
        }

        this.listViewContent.scrollToTop(0.1);
    },

    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickClose_%s", GameManager.getInstance().getCurrentSceneName()));
        cc.NGWlog('ShopView:On Close!');
        require('SoundManager1').instance.playButton();
        if (GameManager.getInstance().gameView === null)
            GameManager.getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        else if (GameManager.getInstance().gameView !== null) 
            GameManager.getInstance().setCurView(GameManager.getInstance().curGameViewId);
           
        require('NetworkManager').getInstance().sendUAG();
        require('UIManager').instance.onHideView(this.node, true);
    },

    onClickTab(event, data) {
        cc.NGWlog('---------> onClickTab ', event, data);
        
        for (let i = 0; i < this.listButtonTabLeft.length; i++) {
            if (event.target === this.listButtonTabLeft[i].node) {
                cc.NGWlog('--------> co thang trung ', i);
                if (data == i) require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTab_%s_%s", data, GameManager.getInstance().getCurrentSceneName()));
                // listSpriteFrameTabLef
                if (this.cur_tab_left === i) return;
                cc.NGWlog('--------> co thang trung 2', i);
                this.listButtonTabLeft[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabLef[0];
                this.cur_tab_left = i;
                
            } else {
                cc.NGWlog('--------> ko trung ', i);
                this.listButtonTabLeft[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabLef[1];
            }
        }
        cc.NGWlog('-=-=-=-=   reloadListview');
        if (data == this.listButtonTabLeft.length - 1) {
            this.listViewContent.node.active = false;
            this.ListAgencyScrollView.node.active = true;
            this.reloadListAgency();
        }
        else {
            this.ListAgencyScrollView.node.active = false;
            this.listViewContent.node.active = true;
            this.reloadListview();
        }
        
    },

    onClickTabRight(event, data) {
        for (let i = 0; i < this.listButtonTabRight.length; i++) {
            if (event.target === this.listButtonTabRight[i].node) {
                cc.NGWlog('--------> co thang trung ', i);
                if(data == i)require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTab_%s_%s", event.target.name, GameManager.getInstance().getCurrentSceneName()));
                if (this.cur_tab_right === i) return;
                this.listButtonTabRight[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabRight[0];
                this.cur_tab_right = i;
            } else {
                cc.NGWlog('--------> ko trung ', i);
                this.listButtonTabRight[i].node.getComponent(cc.Sprite).spriteFrame = this.listSpriteFrameTabRight[1];
            }
        }
        if (data !== 1)
            this.reloadListview();
    },

    onInputPhone(amount) {
        this.amountFortumo = amount;
        cc.NGWlog("----->  onInputPhone();");
        this.editPhoneNumber.string = '';
        this.editPhoneNumber.node.getParent().getParent().getParent().getParent().active = true;
    },
    onClickSendFortumo(event, data) {
        cc.NGWlog("this.amount " + this.amountFortumo);
        //let str_lik = GameManager.getInstance().u_p_fortumo;
        let str_lik ="";
        let strPhone = this.editPhoneNumber.string;
        if (strPhone === '') return;
        str_lik = str_lik.replace("%uid%", GameManager.getInstance().user.id);
        str_lik = str_lik.replace("%price%", this.amountFortumo);
        str_lik = str_lik.replace("%phone%", strPhone);
        this.editPhoneNumber.string = '';
        this.editPhoneNumber.node.getParent().getParent().getParent().getParent().active = false;

        cc.sys.openURL(str_lik);
        // var win = window.open(str_lik, "_blank");
        // win.focus();
    },

    onClickCloseIputPhone() {
        this.editPhoneNumber.string = '';
        this.editPhoneNumber.node.getParent().getParent().getParent().getParent().active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseInput_%s", GameManager.getInstance().getCurrentSceneName()));
    },
    onClickSendPhoneNumber(){
        let str = '';
        str = this.inputPhoneNumber.string;
        if (str === '') return;
        let str_lik = require('GameManager').getInstance().u_ep;
        str_lik = str_lik.replace("%uid%", require('GameManager').getInstance().user.id);
        str_lik = str_lik.replace("%code%", str);
        this.inputPhoneNumber.string = '';

        var request = new XMLHttpRequest();
        request.open("GET", str_lik , true);
        request.setRequestHeader("Access-Control-Allow-Origin", "*");
        
        request.onloadend = function () {
            if (request.responseText.length == 0)
                require('GameManager').getInstance().onShowConfirmDialog("Fail!");
            else if (!JSON.parse(request.responseText)) {
                require('GameManager').getInstance().onShowConfirmDialog("Fail!");
            } else {
                var data = JSON.parse(request.responseText);
                let msg = data.msg;
                let status = data.status;
                cc.NGWlog("=>Shopee la: " + data.msg);
                cc.NGWlog("=>Shopee la: " + data.status);

                if (status == "00") {
                    require('NetworkManager').getInstance().sendUAG();
                    require('GameManager').getInstance().onShowConfirmDialog(msg);
                } else {
                    require('GameManager').getInstance().onShowConfirmDialog(msg);
                }
                cc.NGWlog("Thành Công");
            }
        };

        request.onerror = function () {
            require('GameManager').getInstance().onShowConfirmDialog("Error");
        };
        request.send();
        cc.NGWlog('Sent');
    },
    onClickVip() {
        return;
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_vip);
        this.node.addChild(item);
    },
    onPutBackPool() {
        return;
        for (let i = 0; i < this.listview.content.children.length; i++) {
            cc.NGWlog('Put back shop pool!');
            require('UIManager').instance.shopPool.put(this.listview.content.children[i]);
        }
    },
    scollEvent() {
        return;
        for (let i = 0; i < this.listview.content.children.length; i++) {
            let item = this.listview.content.children[i];
            let pos = this.listview.content.convertToWorldSpaceAR(item.position);
            pos = this.node.convertToNodeSpaceAR(pos);
            //getComponent('ItemShop').bkg
            item.active = true;
        }
    },
    openUrl(url) {
        //return;
        this.webView.node.active = true;
        this.webView.node.getParent().active = true;
        this.webView.url = url;
       //require("Util").onCallWebView(url);
    },
    turnOffWebView() {
        this.webView.node.getParent().active = false;
        this.webView.url = "";
        require('NetworkManager').getInstance().sendUAG();
    },
    contactAdmin() {
        cc.NGWlog('Contact admin!!!!');
        cc.sys.openURL(GameManager.getInstance().u_chat_fb);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowMessageFacebook_%s", GameManager.getInstance().getCurrentSceneName()));
    },
    reloadListAgency() {

        for (let i = 0; i < this.ListAgencyScrollView.content.children.length; i++) {
            this.ListAgencyScrollView.content.children[i].destroy();
        }

        this.ListAgencyScrollView.content.removeAllChildren();

        for (let i = 0; i < require('GameManager').getInstance().listAgency.length; i++) {
            let obj = cc.instantiate(this.itemListAgency).getComponent('ItemAgency');
            obj.updateItem(require('GameManager').getInstance().listAgency[i]);
            this.ListAgencyScrollView.content.addChild(obj.node);
        }
    }
});
