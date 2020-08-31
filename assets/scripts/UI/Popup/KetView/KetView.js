// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const GameManager = require('GameManager')
const NetWorkManager = require('NetworkManager')
const UIManager = require('UIManager')
var KetView = cc.Class({
    extends: require('PopupEffect'),
    properties: {
        lbAg : {
            default : null,
            type : cc.Label
        },
        lbAgSafe : {
            default : null,
            type : cc.Label
        },
        node4Btn : {
            default : null,
            type : cc.Node
        },
        node2Btn : {
            default : null,
            type : cc.Node
        },
        edbInput : {
            default : null,
            type : cc.EditBox
        },
        nodeSafeView : {
            default : null,
            type : cc.Node
        },
        nodeHistory : {
            default : null,
            type : cc.Node
        },
        historyList: cc.ScrollView,
        itemHistory: cc.Prefab,
        btn_sendgift : cc.Button,
        btn_history : cc.Button,
        lb_title : cc.Label,
        isSendKet : false,
        moneyTotal: 0,
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },
    setInfo(){
        this.onPopOn();
        require('UIManager').instance.onShowLoad();
        //require("GameManager").getInstance().setCurView(CURRENT_VIEW.KET_VIEW);
        NetWorkManager.getInstance().getInfoSafe();
        this.lbAg.string = GameManager.getInstance().formatNumber(
            GameManager.getInstance().user.ag
          );
          this.node4Btn.active = true;
          this.node2Btn.active = false;
          this.edbInput.node.active = false;
          this.isSend = true;
          this.nodeSafeView.active = true;
          this.nodeHistory.active = false;
          this.lb_title.string = "SAFE";
          this.isSendKet = true;
          this.initWithConfig();
    },
    onclose(){
        this.onPopOff();
    },

    onClickSendGift(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowGift_%s", require('GameManager').getInstance().getCurrentSceneName()));
        UIManager.instance.onShowGift();
    },

    onClickSendSafe(){

        this.node4Btn.active = false;
        this.node2Btn.active = true;
        this.edbInput.node.active = true;
        this.edbInput.string = '';
        this.edbInput.setFocus();
        this.isSend = true;
        this.lb_title.string = "TRANSFER";
        this.isSendKet = true;
    },

    onClickPutOutSafe(){
        this.node4Btn.active = false;
        this.node2Btn.active = true;
        this.edbInput.node.active = true;
        this.edbInput.string = '';
        this.edbInput.setFocus();
        this.isSend = false;
        this.lb_title.string = "WITHDRAW";
        this.isSendKet = false;
    },

    onClickHistory(){
        NetWorkManager.getInstance().getHistoryKet();
        this.nodeSafeView.active = false,
        this.nodeHistory.active = true
        require('UIManager').instance.onShowLoad();
        this.lb_title.string = "HISTORY";
    },
    onClickBackHis(){
        this.nodeSafeView.active = true,
        this.nodeHistory.active = false
        for (let i = 0; i < this.historyList.content.children.length; i++) {
            this.historyList.content.children[i].active = false;
        }
        this.lb_title.string = "SAFE";
    },
    reloadHistory() {
        let data = require("GameManager").getInstance().list_data_history_safe;
        let item;
        let itemPool = require("UIManager").instance.historyGiftPool;
        for (let i = 0; i < this.historyList.content.children.length; i++) {
            this.historyList.content.children[i].active = false;
        }
        for (let i = 0; i < data.length; i++) {
            let dat = data[i];
            item = this.historyList.content.children[i];
            if (!item) {
                if (itemPool.size() < 1)
                    itemPool.put(cc.instantiate(this.itemHistory));
                item = itemPool.get();
                this.historyList.content.addChild(item);
            }
            item.active = true;
            item.getComponent("ItemHistoryGift").initData(dat.timeday, dat.timehour, dat.content, dat.chipchange)
        }
        require('UIManager').instance.onHideLoad();
    },

    onClickBack(){
        this.node4Btn.active = true;
        this.node2Btn.active = false;
        this.edbInput.node.active = false;
        this.lb_title.string = "SAFE";
    },

    onClickSend(){
        //let chip = this.edbInput.string Chạy trên Web thì bỏ cmt dòng này, cmt dòng dưới
        let chip = '' + this.moneyTotal;
        if(this.isSend) NetWorkManager.getInstance().sendGuiTien(chip);
        else  NetWorkManager.getInstance().sendRutTien(chip);
        this.edbInput.string = '';
        this.moneyTotal = 0;
    },
    initWithConfig(){
        let myVip = require("GameManager").getInstance().user.vip;
        let vChanpho = require("GameManager").getInstance().vchanpho;
        this.btn_sendgift.node.active = myVip >= vChanpho ? true : false;
        this.btn_history.node.active = myVip >= vChanpho ? true : false;
    },
    editBoxTextChanged: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.moneyTotal = parseInt(strTemp);
        cc.NGWlog("============> money la " + this.moneyTotal);
        if(this.moneyTotal < 0) this.moneyTotal = 0;
        let max_chip_can
        if(this.isSendKet)
        max_chip_can = GameManager.getInstance().user.ag;
        else
        max_chip_can = GameManager.getInstance().user.agSafe;
        if (this.moneyTotal > max_chip_can) this.moneyTotal =  parseInt(max_chip_can);
        //this.edbInput.string = this.moneyTotal; Chạy trên Web thì bỏ cmt dòng này, cmt dòng dưới
        this.edbInput.string = GameManager.getInstance().formatNumber(this.moneyTotal);
    },
});
module.exports = KetView;