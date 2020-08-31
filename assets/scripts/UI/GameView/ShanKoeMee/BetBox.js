
cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Sprite,
        },

        chip_view: {
            default: null,
            type: cc.Sprite,
        },

        chip_amount: {
            default: null,
            type: cc.Label,
        }
    },

    onLoad (){
        this.chip_amount.node.opacity = 0;
        this.background.node.opacity = 0;
    },

    setInfo (index,playerBet,position){
        this.node.position = this.getStartPosition(index);
        let money = require('GameManager').getInstance().formatMoney(playerBet);
        this.chip_amount.string = money;
        this.node.runAction(cc.moveTo(0.4,position).easing(cc.easeCubicActionOut()));
        this.chip_amount.node.runAction(cc.sequence(cc.delayTime(0.4),cc.fadeIn(0.4)));
        this.background.node.runAction(cc.sequence(cc.delayTime(0.4),cc.fadeIn(0.4)));
        this.node.runAction(cc.sequence(cc.scaleTo(0.2,1.3),cc.scaleTo(0.2,1)));
    },

    showExistingBet (playerBet,position){
        this.node.position = position;
        let money = require('GameManager').getInstance().formatMoney(playerBet);
        this.chip_amount.string = money;
        this.chip_amount.node.runAction(cc.fadeIn(0.4));
        this.background.node.runAction(cc.fadeIn(0.4));
    },

    betLose (){
        if(this.node != null){
            let offSet = Math.floor(10 * Math.random()) + 20;
            this.chip_amount.node.runAction(cc.fadeOut(0.2));
            this.background.node.runAction(cc.fadeOut(0.2));
            this.node.runAction(cc.sequence(cc.delayTime(0.2),cc.moveTo(0.6,cc.v2(5 + offSet,118)).easing(cc.easeCubicActionOut()),cc.callFunc(()=>{this.node.destroy()})))
            this.node.runAction(cc.sequence(cc.delayTime(0.2),cc.scaleTo(0.6,0.8).easing(cc.easeCubicActionOut())));
        }
    },

    betWin (index){
        if(this.node != null){
            this.chip_amount.node.runAction(cc.fadeOut(0.2));
            this.background.node.runAction(cc.fadeOut(0.2));
            let pos = this.getStartPosition(index);
            this.node.runAction(cc.sequence(cc.delayTime(1.2),cc.moveTo(0.6,cc.v2(pos.x + 30,pos.y)).easing(cc.easeCubicActionOut()),cc.callFunc(()=>{this.node.destroy()})))
            this.node.runAction(cc.sequence(cc.delayTime(1.2),cc.scaleTo(0.6,0.8).easing(cc.easeCubicActionOut())));
        }
    },

    doBetReward (index, pos, offSet){
        let finalPos = this.getStartPosition(index)
        this.node.position = cc.v2(10,118);
        this.node.runAction(cc.sequence(
            cc.moveTo(0.6,cc.v2(pos.x + offSet,pos.y)).easing(cc.easeCubicActionOut()),
            cc.delayTime(0.5),
            cc.moveTo(0.6,cc.v2(finalPos.x + 30, finalPos.y)).easing(cc.easeCubicActionOut()),
            cc.callFunc(()=>{
                this.node.destroy();
            })
        ));
        this.node.runAction(cc.sequence(cc.delayTime(1.6),cc.scaleTo(0.6,0.8).easing(cc.easeCubicActionOut())));

    },

    getStartPosition (index){
        switch (index) {
            case 0:
                return cc.v2(-100,-175);
            case 1:
                return cc.v2(-400,-175);
            case 2:
                return cc.v2(-500,25);
            case 3:
                return cc.v2(-325,200);
            case 4:
                return cc.v2(325,200);
            case 5:
                return cc.v2(500,25);
            case 6:
                return cc.v2(400,-175);
        }
    },


});
