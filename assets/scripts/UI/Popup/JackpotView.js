var JackpotView = cc.Class({
    extends: require('PopupEffect'),

    properties: {
        toggleHistory: {
            default: null,
            type: cc.Toggle
        },
        toggleRule: {
            default: null,
            type: cc.Toggle
        },
        scrJackPot: cc.ScrollView,
        itemJP: cc.Node,
        listHistory: cc.ScrollView,
        tabRule: cc.Node,
        tabHistory: cc.Node,
        tab_select: 0,

    },
    // start () {
    // },
    onLoad() {
        let listMark = require("GameManager").getInstance().binhJPListMark;
        let listChip = require("GameManager").getInstance().binhJPListChip;
        for (let i = 0; i < listMark.length; i++) {
            let item = this.scrJackPot.content.children[i];
            if (!item) {
                item = cc.instantiate(this.itemJP);
                this.scrJackPot.content.addChild(item);
            }
            if (i % 2 == 0) item.getComponent(cc.Sprite).enabled = true;
            else item.getComponent(cc.Sprite).enabled = false;
            item.getChildByName("lbBet").getComponent(cc.Label).string = require("GameManager").getInstance().formatMoney(listMark[i]);
            item.getChildByName("lbWin").getComponent(cc.Label).string = require("GameManager").getInstance().formatMoney(listChip[i]);
        }
        
        this.onPopOn();
    },
    setInfo() {
        
        this.onClickRule();
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.JACKPOT_VIEW);

    },
    onClose() {
        this.onPopOff();
        require('SoundManager1').instance.playButton();
        this.toggleHistory.isChecked = false;
        this.toggleRule.isChecked = true;
        require("GameManager").getInstance().setCurView(require("GameManager").getInstance().curGameViewId);
    },
    updateHistory() {
        let data = require("GameManager").getInstance().list_data_jackpot_history;
        let item;
        let itemPool = require("UIManager").instance.historyJackPotPool;
        for (let i = 0; i < this.listHistory.content.children.length; i++) {
            this.listHistory.content.children[i].active = false;
        }
        for (let i = 0; i < data.length; i++) {
            let dataHis = data[i];
            item = this.listHistory.content.children[i];
            if (!item) {
                if (itemPool.size() < 1)
                    itemPool.put(cc.instantiate(Global.ItemHistoryJackPot.node));
                item = itemPool.get();
                this.listHistory.content.addChild(item);
            }
            item.active = true;
            var time_ = new Date(dataHis.timeWin);
            var _time = time_.getDate() + "." + (time_.getMonth() + 1) + "." + time_.getFullYear()
                + "\n" + time_.getHours() + ":" + time_.getMinutes() + ":" + time_.getSeconds();
            item.getComponent("ItemHistoryJackPot").setInfo(_time, dataHis.userName, dataHis.reward, i);
        }
    },
    onClickRule() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabGuide_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.tabRule.active = true;
        this.tabHistory.active = false;

    },
    onClickHistory() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabHistory_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.updateHistory();
        this.tabRule.active = false;
        this.tabHistory.active = true;
    },


});
module.exports = JackpotView;
