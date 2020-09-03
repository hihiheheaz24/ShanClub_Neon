const GameManager = require('GameManager');
const ShanGameView = require('ShanGameView');
cc.Class({
    extends: cc.Component,

    properties: {
        lb_bets: [cc.Label],
        lb_sliderbets: [cc.Label],
        btn_maxBet: {
            default: null,
            type: cc.Button
        },

        backGround: {
            default: null,
            type: cc.Sprite,
        },

        buttonFather: {
            default: null,
            type: cc.Node,
        },
        lbChipSlider: {
            default: null,
            type: cc.Label,
        },
        betValue: [],
        sliderBet: {
            default: null,
            type: cc.Slider
        },
        pull_Slider: {
            default: null,
            type: cc.Sprite
        },
        valueSend: 0,
        valueCanBet: 0,
        baseBet: 0,
    },

    onLoad() {
        this.potValue;
        this.playerMoney = 0;
        this.tableBaseBet = 10;
        this.buttonFather.opacity = 0
        this.buttonFather.runAction(cc.fadeIn(0.4).easing(cc.easeCubicActionOut()));
        this.backGround.node.opacity = 0;
        this.backGround.node.runAction(cc.fadeTo(0.4, 200).easing(cc.easeCubicActionOut()));
        setTimeout(() => {
            if (this.node != null) {
                this.node.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0, -420)), cc.callFunc(() => { this.node.destroy() })));
            }
        }, 7700)
    },

    setInfo(baseBet, pot, playerAg) {
        this.potValue = pot;
        // if(baseBet == 0){
        //     this.node.destroy();
        // }

        this.tableBaseBet = baseBet;
        this.valueSend = baseBet;
        this.betValue = [baseBet, baseBet * 2, baseBet * 5, baseBet * 10, baseBet * 20];
        this.lb_bets[0].string = GameManager.getInstance().formatMoney(this.betValue[0]);
        this.lb_bets[1].string = GameManager.getInstance().formatMoney(this.betValue[1]);
        this.lb_bets[2].string = GameManager.getInstance().formatMoney(this.betValue[2]);
        this.lb_bets[3].string = GameManager.getInstance().formatMoney(this.betValue[3]);
        this.lb_bets[4].string = GameManager.getInstance().formatMoney(this.betValue[4]);
        this.playerMoney = playerAg;
        this.setInfoSlider();
        this.lbChipSlider.string = GameManager.getInstance().formatMoneyAg(Math.floor(this.valueSend));
        // for(let i = 0 ; i < 5 ; i++){
        //     if(this.betValue[i] >= total_chip ) {
        //         this.lb_bets[i].node.getParent().getComponent(cc.Button).interactable = false;
        //     }else{
        //         this.lb_bets[i].node.getParent().getComponent(cc.Button).interactable = true;
        //     }
        // }
    },
    setInfoSlider() {
        let per = 1;
        if (this.potValue <= this.playerMoney) {
            this.valueCanBet = this.potValue;
            for (let index_lb = 0; index_lb < this.lb_sliderbets.length - 1; index_lb++) {
                this.lb_sliderbets[index_lb].string = GameManager.getInstance().formatMoneyAg(Math.floor(this.potValue * per));
                per = per - 0.25;
            }
        } else {
            this.valueCanBet = this.playerMoney;
            for (let index_lb = 0; index_lb < this.lb_sliderbets.length - 1; index_lb++) {
                this.lb_sliderbets[index_lb].string = GameManager.getInstance().formatMoneyAg(Math.floor(this.playerMoney * per));

                per = per - 0.25;
            }
        }
        this.lb_sliderbets[this.lb_sliderbets.length - 1].string = this.tableBaseBet;
    },

    onBtnBetClick(event, data) {
        let num = parseInt(data);
        let value = 0;
        switch (num) {
            case 0:
                value = this.betValue[0];
                break;
            case 1:
                value = this.betValue[1];
                break;
            case 2:
                value = this.betValue[2];
                break;
            case 3:
                value = this.betValue[3];
                break;
            case 4:
                value = this.betValue[4];
                break;
        }
        // require('NetworkManager').getInstance().sendReadyGame();
        cc.NGWlog('!> player ag ', this.playerMoney, 'make bet ', value);
        if (value <= this.playerMoney) {
            require('NetworkManager').getInstance().sendMakeBetShan2(value);
        } else {
            require('NetworkManager').getInstance().sendMakeBetShan2(this.playerMoney);
        }
        // this.node.runAction(cc.sequence(cc.moveTo(0.5,cc.v2(0,-420)),cc.callFunc(()=>{this.node.destroy()})));

        // let timer = this.gameView.node.getChildByName('timer');
        // if(timer != null){
        //     timer.destroy();
        // }
    },

    onBtnMaxBetClick() {
        // require('NetworkManager').getInstance().sendReadyGame();
        if (this.playerMoney > this.potValue) {
            if (this.potValue < this.tableBaseBet * 200) {
                require('NetworkManager').getInstance().sendMakeBetShan2(this.potValue);
            } else {
                require('NetworkManager').getInstance().sendMakeBetShan2(this.tableBaseBet * 200);
            }
        } else {
            require('NetworkManager').getInstance().sendMakeBetShan2(this.playerMoney);
        }
        // this.node.runAction(cc.sequence(cc.moveTo(0.5,cc.v2(0,-420)),cc.callFunc(()=>{this.node.destroy()})));

        // let timer = this.gameView.node.getChildByName('timer');
        // if(timer != null){
        //     timer.destroy();
        // }
    },
    onClickBet() {
        this.sliderBet.node.active = true;
    },
    pullSlider() {
        let value = this.valueCanBet * this.sliderBet.progress;
        if (value <= this.tableBaseBet) {
            value = this.tableBaseBet;
        }
        this.lbChipSlider.string = GameManager.getInstance().formatMoneyAg(Math.floor(value));
        this.pull_Slider.fillRange = this.sliderBet.progress;
        this.valueSend = value;
    },
    onClickComfirm() {

        if (this.playerMoney > this.valueSend) {
            require('NetworkManager').getInstance().sendMakeBetShan2(parseInt(this.valueSend));
        } else {
            require('NetworkManager').getInstance().sendMakeBetShan2(this.playerMoney);
        }
        this.sliderBet.node.active = false;

    }

});
