var NetworkManager = require("NetworkManager");
cc.Class({
    extends: cc.Component,

    properties: {
        //top lotp
        scr_top_loto : {
            default : null,
            type : cc.Layout
        },
        item_top_loto : {
            default : null,
            type : cc.Node
        },
        //
        //list bet
        scr_number : {
            default : null,
            type : cc.Layout
        },
        item_bet : {
            default : null,
            type : cc.Node
        },
        //
        edb_ag : {
            default : null,
            type : cc.EditBox
        },
        tab_1D : {
            default : null,
            type : cc.Node
        },
        tab_2D : {
            default : null,
            type : cc.Node
        },
        //tab ball
        list_spr_ball : {
            default : [],
            type : [cc.SpriteFrame]
        },
        list_ball : {
            default : [],
            type : cc.Node
        },
        //
        //result
        scr_result_1 : {
            default : null,
            type : cc.ScrollView
        },
        item_result_1 : {
            default : null,
            type : cc.Node
        },
        //2d
        scr_result_2 : {
            default : null,
            type : cc.ScrollView
        },
        item_result_2 : {
            default : null,
            type : cc.Node
        },
        lb_result : {
            default : [],
            type : [cc.Label]
        },
        edb_number_2 : {
            default : null,
            type : cc.EditBox
        },
        edb_ag_2 : {
            default : null,
            type : cc.EditBox
        },
        // historyyyy
        pre_history : {
            default : null,
            type : cc.Prefab
        },
        pre_help : {
            default : null,
            type : cc.Node
        },
        //
        main_result :{
            default : null,
            type : cc.Label
        },
        time_result : {
            default : null,
            type : cc.Label
        },
        lb_ag : {
            default : null,
            type : cc.Label
        },
        btn1_disable : cc.Node,
        btn2_disable : cc.Node,
        default_frame : cc.SpriteFrame,
    },

    setInfo(){
        this.isClick = true;
        //this.btn_origin = null;
        cc.log('chay vao loto voew');
        NetworkManager.getInstance().sendTopLoto();
        NetworkManager.getInstance().getResultLoto();
        this.onCLickTab1d();
        this.number = -1;
        this.isClick = true;
        this.currTab = '';
        this.pre_history.active = false;
        this.pre_help.active = false;
        this.lb_ag.string = require('GameManager').getInstance().
        formatNumber(require('GameManager').getInstance().user.ag);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.LOTOVIEW);
        require('UIManager').instance.alertView.setPosAlert();
    },

    onBack(){
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },
    loadListTopLoto(dataa){
       let data = JSON.parse(dataa);
        this.scr_top_loto.node.removeAllChildren();
        cc.log('chay vao log datatattatta ', data.length);
        for (let i = 0; i < data.length; i++) {
            const objData = data[i];
            let item = cc.instantiate(this.item_top_loto).getComponent('ItemTopLoto');
            this.scr_top_loto.node.addChild(item.node);
            item.init(objData, i+1);
            
        }
    },
    loadListBet(dataa){
        let data = JSON.parse(dataa);
        cc.log('chay vao load lisst bettttt');
        this.scr_number.node.removeAllChildren();
        for (let i = 0; i < data.length; i++) {
            const objData = data[i];
            let item = cc.instantiate(this.item_bet).getComponent('ItemBetLoto');
            this.scr_number.node.addChild(item.node);
            item.init(objData, i)
            
        }
    },

    loadListResult1d(dataa){
        let index = 0;
        if(this.currTab === '1d') cc.log('click tab 1d')
        else  cc.log('click tab 2d');
        let data = JSON.parse(dataa);
        this.scr_result_1.content.removeAllChildren();
        let listToday = data.today;
        let listOther = data.others;
        for (let i = 0; i < listToday.length; i++) {
            const objData = listToday[i];
            if(objData.CreateTime === 0) continue;
            index++;
            if(index === 1){
                this.main_result.string = objData.strNumber;
                var time_ = new Date(objData.CreateTime);
                let min = time_.getMinutes();
                let hou = time_.getHours();
                let _time1 = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min) + " " + (hou > 12 ? "pm" : "am") ;
                var _time = 'Updated: ' + time_.getFullYear() + '-' + (time_.getMonth() + 1) + '-' + time_.getDate() + ' ' +_time1;
        
                this.time_result.string = _time;
            }
            let item = cc.instantiate(this.item_result_1).getComponent('ItemResultLoto');
            this.scr_result_1.content.addChild(item.node);
            item.init(objData);
        }
        for (let j = 0; j < listOther.length; j++) {
            const objData = listOther[j];
            index++;
            if(index === 1){
                this.main_result.string = objData.strNumber;
                var time_ = new Date(objData.CreateTime);
                let min = time_.getMinutes();
                let hou = time_.getHours();
                let _time1 = (hou < 10 ? "0" + hou : hou) + ":" + (min < 10 ? "0" + min : min) + " " + (hou > 12 ? "pm" : "am") ;
                var _time = 'Updated: ' + time_.getFullYear() + '-' + (time_.getMonth() + 1) + '-' + time_.getDate() + ' ' +_time1;
        
                this.time_result.string = _time;
            }
            let item = cc.instantiate(this.item_result_1).getComponent('ItemResultLoto');
            this.scr_result_1.content.addChild(item.node);
            item.init(objData);
        }

    },
    loadListResult2d(dataa){
        let data = JSON.parse(dataa);
        this.scr_result_2.content.removeAllChildren();
        let listToday = data.today;
        let listOther = data.others;
        for (let i = listToday.length-1; i >= 0 ; i--) {
            const objData = listToday[i];
            if(objData.CreateTime === 0){
                this.lb_result[i].string = '...';
            }
            else{
                this.lb_result[i].string = objData.strNumber;
            }
        }
        for (let j = 0; j < listOther.length; j++) {
            const objData = listOther[j];
            let item = cc.instantiate(this.item_result_2).getComponent('ItemResultLoto');
            this.scr_result_2.content.addChild(item.node);
            item.init(objData);
        }

    },

    onClickNumber(event, data){
        this.number = JSON.parse(data);
        require('SoundManager1').instance.playButton();
        for (let i = 0; i < this.list_ball.length; i++) {
            const objBtn = this.list_ball[i];
            if(objBtn == event.target)
            objBtn.getComponent(cc.Sprite).spriteFrame = this.list_spr_ball[i];
            else
            objBtn.getComponent(cc.Sprite).spriteFrame = this.default_frame;
            
        }
    },
    onClickSendBet1D(){
        require('SoundManager1').instance.playButton();
        if(this.number < 0){
            require('GameManager').getInstance().onShowConfirmDialog('Please select a number');
            return;
        }
        if(this.edb_ag.string === ''){
            require('GameManager').getInstance().onShowConfirmDialog('Must bet with chip bigger than 1000');
            return;
        }
        let ag = this.edb_ag.string;
        NetworkManager.getInstance().sendBetLoto(1,this.number,ag);
        this.edb_ag.string = '';
        NetworkManager.getInstance().getMyNumber(1);
    },

    onClickSendBet2D(){
        require('SoundManager1').instance.playButton();
        if(this.edb_number_2.string === '') {
            require('GameManager').getInstance().onShowConfirmDialog('Please enter the number');
            return;
        }
        if(this.edb_ag_2.string === ''){
            require('GameManager').getInstance().onShowConfirmDialog('Must bet with chip bigger than 1000');
            return;
        }
        NetworkManager.getInstance().sendBetLoto(2,this.edb_number_2.string,this.edb_ag_2.string);
        this.edb_ag_2.string = '';
        this.edb_number_2.string = '';
        NetworkManager.getInstance().getMyNumber(2);
    },

    onCLickTab1d (event, data){
       // if(event.target == this.btn_origin) return;
        if(!this.isClick){
            return;
        } 
        setTimeout(() => {
            this.isClick  = true;
        }, 1500);
        this.currTab =  '1d';
        this.scr_number.node.removeAllChildren();
        this.tab_1D.active = true;
        this.tab_2D.active = false;
        ////
        this.btn1_disable.active = false;
        this.btn2_disable.active = true;
        ///
        NetworkManager.getInstance().getMyNumber(1);
        this.onClickNumber(0, -1);
        this.scr_result_1.scrollToTop(0.1);
        //this.btn_origin = event.target;
        this.isClick = false;
    },
    onClickTab2d (event, data){
       // if(event.target == this.btn_origin) return;
        if(!this.isClick){
            return;
        } 
        setTimeout(() => {
            this.isClick  = true;
        }, 1500);
        this.scr_number.node.removeAllChildren();
        this.currTab =  '2d';
        this.tab_1D.active = false;
        this.tab_2D.active = true;
        NetworkManager.getInstance().getMyNumber(2);
        this.isClick = false;
        ////
        this.btn1_disable.active = true;
        this.btn2_disable.active = false;
        ///
        this.scr_result_2.scrollToTop(0.1);
       // this.btn_origin = event.target;
    },
    onClickHis(){
        require('UIManager').instance.onShowLoad();
        NetworkManager.getInstance().getHistoryLoto();
        Global.HistoryLoto.scr_history.content.removeAllChildren();
      if(Global.HistoryLoto.node.getParent() === null){
           this.node.addChild(Global.HistoryLoto.node);
       }
       Global.HistoryLoto.setInfo();
    },
    onClickHelp(){
        this.pre_help.active = true;
        ///
        this.pre_help.scale = 0.8;
        this.pre_help.opacity = 200;
        let acScaleOut = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        let acFadeOut = cc.fadeTo(0.1, 255);
        this.pre_help.stopAllActions();
        this.pre_help.runAction(cc.spawn(acScaleOut, acFadeOut));

    },
    onCloseHelp(){
        let acScaleOut = cc.scaleTo(0.1, 0.8).easing(cc.easeBackIn());
        let acFadeOut = cc.fadeTo(0.1, 120).easing(cc.easeCircleActionIn());
        this.pre_help.stopAllActions();
        this.pre_help.runAction(cc.spawn(acScaleOut, acFadeOut));
        this.scheduleOnce(() => {
            this.pre_help.active = false;
        }, 0.1)
    },
    onClickShop(){
        require('SoundManager1').instance.playButton();
        require("UIManager").instance.onShowShop();
    },
    editBoxTextChanged_ag2: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.edb_ag_2.string = parseInt(strTemp);
    },
    editBoxTextChanged_nb2: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.edb_number_2.string = strTemp;
    },
    editBoxTextChanged_ag1: function (sender, text) {
        let strTemp = "";
        for (let i = 0; i < text.string.length; i++) {
            if (text.string.charAt(i) >= 0 && text.string.charAt(i) <= 9) {
                strTemp += text.string.charAt(i)
            }
        }
        if (strTemp == "") return;
        this.edb_ag.string = parseInt(strTemp);
    },

    // update (dt) {},
});
