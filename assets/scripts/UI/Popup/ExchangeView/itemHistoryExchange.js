
cc.Class({
    extends: cc.Component,

    properties: {
        lbTime: {
            default: null,
            type: cc.Label
        },
        lbChip: {
            default: null,
            type: cc.Label
        },
        lbStatus : {
            default : null,
            type : cc.Label
        },
        lbNet : {
            default : null,
            type : cc.Label
        },
        lbValue : {
            default : null,
            type : cc.Label
        },
        btnGetCard : {
            default : null,
            type : cc.Button
        },
        btnCancel : {
            default : null,
            type : cc.Button
        },
        btnGetchip : {
            default : null,
            type : cc.Button
        },
        _status: 0,
        _ID: 0,
        _value : 0
    },

    updateItem(itemData) {

        //define telco: id nhà mạng (0: "" ,1: "MPT", 2: Telenor, 3: Ooredoo, 4: Mytel, 5: Wave)
        let listNet = ["" ,"MPT","Telenor","Ooredoo","Mytel", "Wave"];

        this._status = itemData.status;
        this._ID = itemData.id;
        this._value = itemData.cashValue;

        cc.NGWlog('Gia tri status1 la: ' + this._status);

        switch (this._status)
        {
            case 0:
                this.lbStatus.string = "Pending";
                this.lbStatus.node.color = new cc.Color(255,255,0);
               if (itemData.tecol !==5)
                    this.btnCancel.node.active = true;
                break;
            case 1:
                this.lbStatus.string = "Canceled";
                this.lbStatus.node.color = new cc.Color(255,0,0);
                break;
            case 2:
                this.lbStatus.string = "Reject";
                this.lbStatus.node.color = new cc.Color(255,0,0);
                break;
            case 3:
                this.lbStatus.string = "Done";
                this.lbStatus.node.color = new cc.Color(255, 255, 255);
                if (itemData.tecol !== 5) {
                    this.lbStatus.string = "Accepted";
                    this.btnGetCard.node.active = true;
                    this.btnGetchip.node.active = true;
                    this.lbStatus.node.color = new cc.Color(0, 255, 0);
                }
                break;
            case 4:
                this.lbStatus.string = "Done";
                this.lbStatus.node.color = new cc.Color(66, 70, 89);
                break;
            case 5:
                this.lbStatus.string = "Done";
                this.lbStatus.node.color = new cc.Color(255, 255, 255);
                break;
            default:
            }

        var time_ = new Date(itemData.time);
        var _time = time_.getFullYear() + "-" + (time_.getMonth() + 1) + "-" + time_.getDate()+ " " + time_.getHours() + ":" + time_.getMinutes()+ ":" + time_.getSeconds();
        this.lbTime.string = _time;

        this.lbChip.string = require('GameManager').getInstance().formatNumber(itemData.chip);
        this.lbValue.string = require('GameManager').getInstance().formatNumber(itemData.cashValue);
        this.lbNet.string = listNet[itemData.tecol];

    },
    onClickCancel() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCancel_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog('Gia tri status2 la: ' + this._status);

        require('GameManager').getInstance().onShowWarningDialog(
            require('GameManager').getInstance().getTextConfig("txt_cancel_cashout"),
            DIALOG_TYPE.TWO_BTN, require('GameManager').getInstance().getTextConfig("txt_yes"),
            () => {
                require('NetworkManager').getInstance().sendRejectCashout(this._status, this._ID);
            },
            require('GameManager').getInstance().getTextConfig("label_cancel")
        );
    },
    onClickGetCard(){

        require('GameManager').getInstance().onShowWarningDialog(
            require('GameManager').getInstance().getTextConfig("txt_getcard_cashout"),
            DIALOG_TYPE.TWO_BTN, require('GameManager').getInstance().getTextConfig("txt_yes"),
            () => {
                require('NetworkManager').getInstance().sendRejectItem(this._value, this._ID, 4);
            },
            require('GameManager').getInstance().getTextConfig("label_cancel")
        );
    },
    onClickGetChip(){

        require('GameManager').getInstance().onShowWarningDialog(
            require('GameManager').getInstance().getTextConfig("txt_getchip_cashout"),
            DIALOG_TYPE.TWO_BTN, require('GameManager').getInstance().getTextConfig("txt_yes"),
            () => {
                require('NetworkManager').getInstance().sendRejectItem(this._value, this._ID, 5);
            },
            require('GameManager').getInstance().getTextConfig("label_cancel")
        );
    },

});
