const GameManager = require('GameManager')
cc.Class({
    extends: cc.Component,
    properties: {
        lb_bet: [cc.Label],
        btn_bet: [cc.Button],
        btnMaxBet: {
            default: null,
            type: cc.Button
        },
        chip_table: 0,
        _listChipBet: [],
        vecRuleBet: []
    },

    onLoad() {
        this.chip_table = require("GameManager").getInstance().gameView.agTable;

        this.vecRuleBet = [
            1,
            2,
            5,
            10,
            20,
        ];

        for (let i = 0; i < this.vecRuleBet.length; i++) {
            var bet = this.vecRuleBet[i] * this.chip_table;
            this.lb_bet[i].getComponent(cc.Label).string = GameManager.getInstance().formatMoney(bet);
            this._listChipBet.push(bet);
        }
    },
    onHide() {
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