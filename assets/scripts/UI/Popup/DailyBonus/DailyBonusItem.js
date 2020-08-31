cc.Class({
    extends: cc.Component,

    properties: {

        bg: {
            default: null,
            type: cc.Sprite
        },

        lbDay: {
            default: null,
            type: cc.Label
        },

        icAg: {
            default: null,
            type: cc.Sprite
        },

        lbAg: {
            default: null,
            type: cc.Label
        },

        btnReceive: {
            default: null,
            type: cc.Button
        },

        lbBtn: {
            default: null,
            type: cc.Label
        },
        animation: {
            default: null,
            type: sp.Skeleton
        },

        day: 0,
        ag: 0,

        itamAvaiable: false,
        itemActive: false,
    },

    start() {

    },

    initItem(day, ag, itamAvaiable, itemActive = false) {
        this.lbDay.string = require('GameManager').getInstance().getTextConfig("txt_day") + " " + day;

        var days = require('GameManager').getInstance().user.onlineDay;

        var resAg;
        var resBg;
        if (days <= day) {
            resAg = "popup/daily_bonus/%da";
            resBg = "popup/daily_bonus/item1";
        }
        else {
            resAg = "popup/daily_bonus/%db.p";
            resBg = "popup/daily_bonus/item2";
        }

        resAg = resAg.replace("%d", day);
        if (days === day) {
            this.animation.node.active = true;
        }
        if ((days === day) || (day === days + 1))
            var resBtn = "popup/daily_bonus/btn1";
        else
            var resBtn = "popup/daily_bonus/btn2";

        if (day === days + 1)
            this.lbBtn.string = require('GameManager').getInstance().getTextConfig("txt_tomorrow");
        else
            this.lbBtn.string = require('GameManager').getInstance().getTextConfig("receive");

        if (day !== days)
            this.btnReceive.interactable = false;

        require('GameManager').getInstance().loadTexture(this.bg, resBg);
        require('GameManager').getInstance().loadTexture(this.icAg, resAg);
        require('GameManager').getInstance().loadTexture(this.btnReceive, resBtn);

        //Ag
        this.lbAg.string = require('GameManager').getInstance().formatMoney(ag);

        this.day = day;
        this.ag = ag;

        this.itamAvaiable = itamAvaiable;
        this.itemActive = itemActive;
    },

    onClickReceive() {
        this.dailyCha.onClickReceive();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickReceiveDaily_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },
});