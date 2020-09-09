cc.Class({
    extends: cc.Component,

    properties: {
        nodeCash: {
            default: null,
            type: cc.Node
        },
        nodeAgency: {
            default: null,
            type: cc.Node
        },
        nodeHistory: {
            default: null,
            type: cc.Node
        },

        icWing: {
            default: null,
            type: cc.Sprite,
        },
        icAgency: {
            default: null,
            type: cc.Sprite,
        },
        icHistory: {
            default: null,
            type: cc.Sprite,
        },

        lbMyChipCash: {
            default: null,
            type: cc.Label
        },
        lbChangeCash: {
            default: null,
            type: cc.Label
        },
        edIDCash: {
            default: null,
            type: cc.EditBox
        },
        edRetypeIDCash: {
            default: null,
            type: cc.EditBox
        },
        listViewCash: {
            default: null,
            type: cc.ScrollView
        },
        itemListCash: {
            default: null,
            type: cc.Prefab
        },

        lbWarningChip: {
            default: null,
            type: cc.Label
        },

        lbWarningWingID: {
            default: null,
            type: cc.Label
        },

        lbWarningRetypeWing: {
            default: null,
            type: cc.Label
        },

        listViewAgency: {
            default: null,
            type: cc.ScrollView
        },
        itemListAgency: {
            default: null,
            type: cc.Prefab
        },

        listViewHistory: {
            default: null,
            type: cc.ScrollView
        },
        itemListHistory: {
            default: null,
            type: cc.Prefab
        },
        valueChip: null,
        chipExc: null,
        btn_confirm: {
            default: null,
            type: cc.Button
        },
        countErr: 0
    },

    onClickWing(e,data) {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickWing_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.nodeCash.active = true;
        this.nodeAgency.active = false;
        this.nodeHistory.active = false;

        this.icWing.node.active = true;
        this.icAgency.node.active = false;
        this.icHistory.node.active = false;

        this.reloadListCashOut();
    },

    reloadListCashOut() {
        this.resetField();
        for (let i = 0; i < this.listViewCash.content.children.length; i++) {
            this.listViewCash.content.children[i].destroy();
        }

        // require("GameManager").getInstance().listAgDT = [
        //     {
        //         "ag": 100000,
        //         "m": 1
        //     },
        //     {
        //         "ag": 200000,
        //         "m": 2
        //     },
        //     {
        //         "ag": 500000,
        //         "m": 5
        //     },
        //     {
        //         "ag": 1000000,
        //         "m": 10
        //     },
        //     {
        //         "ag": 2000000,
        //         "m": 20
        //     },
        //     {
        //         "ag": 5000000,
        //         "m": 50
        //     },
        //     {
        //         "ag": 10000000,
        //         "m": 100
        //     }
        // ]

        let len = require("GameManager").getInstance().listAgDT.length;
        for (let i = 0; i < len; i++) {
            let itemInfo = require("GameManager").getInstance().listAgDT[i];
            let obj = cc.instantiate(this.itemListCash).getComponent('ItemCashOut');
            obj.updateItem(itemInfo, i);
            this.listViewCash.content.addChild(obj.node);
        }

        if (require("GameManager").getInstance().listAgDT.length > 0) {
            var item0 = require("GameManager").getInstance().listAgDT[0];
            this.onChooseCashOut(item0.ag, item0.m);
        }
    },

    onConfirmCashOut() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("onConfirmCashOut_%s", require('GameManager').getInstance().getCurrentSceneName()));
        let wingId = this.edIDCash.string;
        let userId = require('GameManager').getInstance().user.id;
        let value = this.chipExc;
        this.countErr = 0;

        if (this.lbChangeCash.string === '') {
            this.lbWarningChip.node.active = true;
            this.lbWarningChip.string = require('GameManager').getInstance().getTextConfig('error_empty');
            this.countErr++;
            //require("UIManager").instance.onShowConfirmDialog(require('GameManager').getInstance().getTextConfig('error_empty'));
        }

        if (wingId === '') {
            this.lbWarningWingID.node.active = true;
            this.lbWarningWingID.string = require('GameManager').getInstance().getTextConfig('error_empty');
            this.countErr++;
        }

        if (this.edRetypeIDCash.string === '') {
            this.lbWarningRetypeWing.node.active = true;
            this.lbWarningRetypeWing.string = require('GameManager').getInstance().getTextConfig('error_empty');
            this.countErr++;
        }

        if (wingId !== this.edRetypeIDCash.string) {

            this.lbWarningWingID.string = require('GameManager').getInstance().getTextConfig('txt_WingnotSame');
            this.lbWarningRetypeWing.string = require('GameManager').getInstance().getTextConfig('txt_WingnotSame');
            this.lbWarningWingID.node.active = true;
            this.lbWarningRetypeWing.node.active = true;
            this.countErr++;
        }

        if (this.countErr > 0) return;

        require('NetworkManager').getInstance().sendCashOut(userId, value, wingId);

        this.reloadListCashOut();
    },

    onChooseCashOut(value, m) {

        if (require('GameManager').getInstance().user.ag < value) {
            this.lbWarningChip.node.active = true;
            this.lbWarningChip.string = require('GameManager').getInstance().getTextConfig('txt_koduchip');
            this.btn_confirm.interactable = false;
        } else {
            this.btn_confirm.interactable = true;
            this.lbWarningChip.node.active = false;
        }

        this.chipExc = m;
        this.valueChip = value;
        this.lbChangeCash.string = require('GameManager').getInstance().formatNumber(value) + ' Chips = ' + m + '$';
    },

    start() {
        this.nodeCash.active = true;
        this.nodeAgency.active = false;
        this.nodeHistory.active = false;

        this.icWing.node.active = true;
        this.icAgency.node.active = false;
        this.icHistory.node.active = false;

        this.setInfo();
    },


    setInfo() {
        //init agency
        // init history

        this.updateChip();
        this.reloadListCashOut();
    },

    updateChip() {
        let ag = require('GameManager').getInstance().user.ag;
        this.lbMyChipCash.string = require('GameManager').getInstance().formatNumber(ag);
    },

    onClickAgency() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAgency_%s", require('GameManager').getInstance().getCurrentSceneName()));
        this.nodeAgency.active = true;
        this.nodeCash.active = false;
        this.nodeHistory.active = false;

        this.icWing.node.active = false;
        this.icAgency.node.active = true;
        this.icHistory.node.active = false;

        for (let i = 0; i < this.listViewAgency.content.children.length; i++) {
            this.listViewAgency.content.children[i].destroy();
        }

        this.listViewAgency.content.removeAllChildren();

        for (let i = 0; i < require('GameManager').getInstance().listAgency.length; i++) {
            let obj = cc.instantiate(this.itemListAgency).getComponent('ItemAgency');
            obj.updateItem(require('GameManager').getInstance().listAgency[i]);
            this.listViewAgency.content.addChild(obj.node);
        }
    },

    onClickHistory() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHistory_%s", require('GameManager').getInstance().getCurrentSceneName()));

        this.nodeHistory.active = true;
        this.nodeCash.active = false;
        this.nodeAgency.active = false;
        this.icWing.node.active = false;
        this.icAgency.node.active = false;
        this.icHistory.node.active = true;

        require('NetworkManager').getInstance().sendDTHistory(require('GameManager').getInstance().user.id);
    },

    updateHistory(listItem) {
        cc.NGWlog('Update History Cash Out!' + listItem.length);

        for (let i = 0; i < this.listViewHistory.content.children.length; i++) {
            this.listViewHistory.content.children[i].destroy();
        }

        this.listViewHistory.content.removeAllChildren();
    
        for (let i = 0; i < listItem.length; i++) {
            let obj = cc.instantiate(this.itemListHistory).getComponent('ItemHistoryCashout');
            this.listViewHistory.content.addChild(obj.node);
            obj.updateItem(listItem[i]);
        }
    },

    onClose() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("clickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
    },
    cashOutReturn(data) {

        if (data.status) {
            require('NetworkManager').getInstance().sendUAG();
            require("UIManager").instance.onShowConfirmDialog(data.data);
        } else {
            require("UIManager").instance.onShowConfirmDialog(data.data);
        }

    },
    resetField() {
        this.lbChangeCash.string = '';
        this.edIDCash.string = '';
        this.edRetypeIDCash.string = '';
        this.lbWarningChip.node.active = false;
        this.lbWarningRetypeWing.node.active = false;
        this.lbWarningWingID.node.active = false;
    },
});