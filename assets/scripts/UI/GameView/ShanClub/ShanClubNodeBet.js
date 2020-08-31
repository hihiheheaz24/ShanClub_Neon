const GameManager = require('GameManager')
 cc.Class({
    extends: cc.Component,
    properties: {
        lb_bet: [cc.Label],
        btn_bet: [cc.Button],
        btnMaxBet:{
            default: null,
            type: cc.Button
        },
        chip_table: 0,
        _listChipBet:[],
        vecRuleBet:[]
    },
    onLoad() {
        this.scaleDefine_Width = cc.winSize.width / 1280;

        this.chip_table = require("GameManager").getInstance().gameView.agTable;

        this.vecRuleBet = [
            1,
            5,
            10,
            50,
            100,
            500,
            1000,
            5000,
            10000,
            50000,
            100000,
            500000,
            1000000,
            5000000,
            10000000,
            50000000,
            100000000,
            500000000
        ];

        let index = 0;
        let count_btn = 0;
        let cur_index = 0;
        for (let i = 1; i < this.vecRuleBet.length; i++) {
            if (this.chip_table < this.vecRuleBet[i]) {
                index = i - 1;
                break;
            }
        }

        for (let i = index; i < index + 5; i++) {
            cur_index = i;
            if (i >= this.vecRuleBet.length) cur_index = this.vecRuleBet.length - 1;

            this.lb_bet[count_btn].getComponent(cc.Label).string = GameManager.getInstance().formatMoney(this.vecRuleBet[cur_index]);
            this._listChipBet.push(this.vecRuleBet[cur_index]);
            count_btn++;
        }

        for (let i = 0; i < this.btn_bet.length; i++) {
            this.btn_bet[i].node.setContentSize(200 * this.scaleDefine_Width, 85);
            //this.btn_bet[i].node.position = cc.v2(this.btn_bet[i].node.width * 0.8 + (this.btn_bet[i].node.width * 1.082 * i) - cc.winSize.width / 2, 0);
            this.btn_bet[i].node.position = cc.v2(this.btn_bet[i].node.width / 2 + 20 + (this.btn_bet[i].node.width * 1.05 * i) - cc.winSize.width / 2, 0);
        }
    },
    onHide(){
        this.node.removeFromParent(false);
    },
    onClickBet(e, data) {
        let chip = 0;
        if (data <= 4) chip = require("GameManager").getInstance().user.ag < this._listChipBet[data] ? require("GameManager").getInstance().user.ag : this._listChipBet[data];
        else chip = require("GameManager").getInstance().user.ag < 200 * this.chip_table ? require("GameManager").getInstance().user.ag : 200 * this.chip_table;
        
        require('NetworkManager').getInstance().sendRaise(chip);
        this.onHide();
    }
});
