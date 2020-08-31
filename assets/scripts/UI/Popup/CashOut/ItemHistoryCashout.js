
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
        lbDollar: {
            default: null,
            type: cc.Label
        },
        lbWingId: {
            default: null,
            type: cc.Label
        },
        lbStatusDone: {
            default: null,
            type: cc.Label
        },
        lbStatusCancel: {
            default: null,
            type: cc.Label
        },
        btnStatus: {
            default: null,
            type: cc.Button
        },
        _status: 0,
        _ID: 0
    },

    updateItem(itemData) {
        this._status = itemData.status;
        this._ID = itemData.id;

        cc.NGWlog('Gia tri status1 la: ' + this._status);

        var time_ = new Date(itemData.CreateTime);
        var _time = time_.getDate() + "/" + (time_.getMonth() + 1) + "/" + time_.getFullYear() + "\n" + time_.getHours() + ":" + time_.getMinutes();
        this.lbTime.string = _time;

        //this.lbTime.string = itemData.CreateTime;
        this.lbDollar.string = itemData.CashValueNew;
        this.lbWingId.string = itemData.WingId;


        if (itemData.status == 0) {
            this.lbStatusDone.node.active = false;
            this.lbStatusCancel.node.active = false;
            this.btnStatus.node.active = true;
        } else {
            if (itemData.status == 1) {
                this.lbStatusDone.node.active = true;
                this.lbStatusCancel.node.active = false;
                this.btnStatus.node.active = false;
            } else {
                this.lbStatusDone.node.active = false;
                this.lbStatusCancel.node.active = true;
                this.btnStatus.node.active = false;
            }
        }


        //this.lbStatusDone.enable = itemData.status ;// ? "Canceeld" : "Done";//0 - chua xu li, 1 - done
        
        let chiii = 0;
       
        for (let i = 0; i < require("GameManager").getInstance().listAgDT.length; i++) {
            let itt = require("GameManager").getInstance().listAgDT[i];
            
            if (itemData.CashValueNew == itt.m) {
                chiii = itt.ag;
                break;
            }
        }
        this.lbChip.string = chiii + "";
    },
    onClickCancel() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCancel_%s", require('GameManager').getInstance().getCurrentSceneName()));
        cc.NGWlog('Gia tri status2 la: ' + this._status);
        require('NetworkManager').getInstance().sendRejectCashout(this._status, this._ID);
    }
});
