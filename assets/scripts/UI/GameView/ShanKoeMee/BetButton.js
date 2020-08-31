const GameManager = require('GameManager');
const ShanGameView = require('ShanGameView');
cc.Class({
    extends: cc.Component,

    properties: {
        lb_bets: [cc.Label],

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

        betValue:[],
    },

    onLoad (){
        this.potValue;
        this.playerMoney = 0;
        this.tableBaseBet = 10;
        this.buttonFather.opacity = 0
        this.buttonFather.runAction(cc.fadeIn(0.4).easing(cc.easeCubicActionOut()));
        this.backGround.node.opacity = 0;
        this.backGround.node.runAction(cc.fadeTo(0.4,200).easing(cc.easeCubicActionOut()));
        setTimeout(()=>{
            if(this.node != null){
                this.node.runAction(cc.sequence(cc.moveTo(0.5,cc.v2(0,-420)),cc.callFunc(()=>{this.node.destroy()})));
            }
        },7700)
    },

    setInfo (baseBet,pot,playerAg){
        this.potValue = pot;
        // if(baseBet == 0){
        //     this.node.destroy();
        // }
        this.tableBaseBet = baseBet;
        this.betValue = [baseBet, baseBet*5, baseBet*10, baseBet*50, baseBet*100];
        this.lb_bets[0].string = GameManager.getInstance().formatMoney(this.betValue[0]);
        this.lb_bets[1].string = GameManager.getInstance().formatMoney(this.betValue[1]);
        this.lb_bets[2].string = GameManager.getInstance().formatMoney(this.betValue[2]);
        this.lb_bets[3].string = GameManager.getInstance().formatMoney(this.betValue[3]);
        this.lb_bets[4].string = GameManager.getInstance().formatMoney(this.betValue[4]);
        this.playerMoney = playerAg;
        // for(let i = 0 ; i < 5 ; i++){
        //     if(this.betValue[i] >= total_chip ) {
        //         this.lb_bets[i].node.getParent().getComponent(cc.Button).interactable = false;
        //     }else{
        //         this.lb_bets[i].node.getParent().getComponent(cc.Button).interactable = true;
        //     }
        // }
    },

    onBtnBetClick(event,data) {
        let num = parseInt(data);
        let value = 0;
        switch(num){
            case 0:
                value =  this.betValue[0] ;
                break;
            case 1:
                value =  this.betValue[1] ;
                break;
            case 2:
                value =  this.betValue[2] ;
                break;
            case 3:
                value =  this.betValue[3] ;
                break;
            case 4:
                value =  this.betValue[4] ;
                break;
        }
        // require('NetworkManager').getInstance().sendReadyGame();
        cc.NGWlog('!> player ag ',this.playerMoney,'make bet ', value);
        if(value <= this.playerMoney){
            require('NetworkManager').getInstance().sendMakeBetShan2(value);
        }else{
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
        if(this.playerMoney > this.potValue){
            if(this.potValue < this.tableBaseBet * 200){
                require('NetworkManager').getInstance().sendMakeBetShan2(this.potValue);
            }else{
                require('NetworkManager').getInstance().sendMakeBetShan2(this.tableBaseBet * 200);
            }
        }else{
            require('NetworkManager').getInstance().sendMakeBetShan2(this.playerMoney);
        }
        // this.node.runAction(cc.sequence(cc.moveTo(0.5,cc.v2(0,-420)),cc.callFunc(()=>{this.node.destroy()})));
        
        // let timer = this.gameView.node.getChildByName('timer');
        // if(timer != null){
        //     timer.destroy();
        // }
    },

});
