
cc.Class({
    extends: cc.Component,

    properties: {
       //item card
       lbNet : {
        default : null,
        type : cc.Label
        },
        lbValue : {
            default : null,
            type : cc.Label
        },
        lbChip : {
            default : null,
            type : cc.Label
        },
        agCashOut : 0,
        chipExchange : 0,
        isType : 0,
    },

    start () {

    },
    init(net,value, ag, type){
        this.agCashOut = ag;
        this.chipExchange = value;
        this.isType = type;
        //this.lbNet.string = require('GameManager').getInstance().formatNumber(net);
        this.lbNet.string = net;
        this.lbValue.string = require('GameManager').getInstance().formatNumber(value) + ' Ks';
        this.lbChip.string = require('GameManager').getInstance().formatNumber(ag) + ' chips';
    },
    onClickExchange(){
        if(this.agCashOut > require('GameManager').getInstance().user.ag){
            require('GameManager').getInstance().onShowConfirmDialog(require('GameManager').getInstance().getTextConfig("txt_koduchip_cashout"));
        }
        else{
            if(this.isType == 4){
                require('GameManager').getInstance().onShowWarningDialog(
                    require('GameManager').getInstance().getTextConfig("txt_comfirm_cashout"),
                    DIALOG_TYPE.TWO_BTN, require('GameManager').getInstance().getTextConfig("txt_yes"),
                    () => {
                        //show 1 cai gi do o day
                        this.onClickConfirm();
                    },
                    require('GameManager').getInstance().getTextConfig("label_cancel")
                );
            }
            else{
                require('GameManager').getInstance().onShowWarningDialog(
                    require('GameManager').getInstance().getTextConfig("txt_comfirm_cashout"),
                    DIALOG_TYPE.TWO_BTN, require('GameManager').getInstance().getTextConfig("txt_yes"),
                    () => {
                        require('NetworkManager').getInstance().sendDt(this.chipExchange,this.isType + 1);
                    },
                    require('GameManager').getInstance().getTextConfig("label_cancel")
                );
            }
           
        }
        
    },
    onClickConfirm(){
        //this.node.addChild(Global.ExchangeView.prefabInputWave.node);
        let obj = cc.instantiate(Global.ExchangeView.prefabInputWave).getComponent('InputWaveId');
            Global.ExchangeView.node.addChild(obj.node);
            obj.onShow();
        Global.ExchangeView.prov = this.chipExchange;
        cc.NGWlog("====================> chipexchange la" + Global.ExchangeView.prov);

    },

});
