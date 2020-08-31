var EffectWinLose = cc.Class({
    extends: cc.Component,

    properties: {
        fontPlus: {
            default: null,
            type: cc.Font
        },

        fontSubtract: {
            default: null,
            type: cc.Font
        },
        labelMoney:cc.Label,
        aniWinText: {
            default: null,
            type: sp.Skeleton
        },

        aniDrawText: {
            default: null,
            type: sp.Skeleton
        },

        lose:cc.Node,
        labelPositionX : 0,
        labelPositionY: 0,
    },
    effectWinLose: function(money) {                      //Show animation win or lose
        this.labelMoney.string = "";
        if (money > 0) {
            this.aniWinText.node.active = true;
            this.aniWinText.setAnimation(0, "animation", false);
            this.labelMoney.font = this.fontPlus;
            this.labelMoney.string = "+" + require('GameManager').getInstance().formatMoney(money);
        } else if (money < 0) {
            this.labelMoney.font  = this.fontSubtract;
            this.lose.active = true;
            this.labelMoney.string = require('GameManager').getInstance().formatMoney(money);
        }
        else {
            this.aniDrawText.node.active = true;
            this.aniDrawText.setAnimation(0, "eng", true);
        }
    },
    textFly(isAction){
        if(this.labelPositionX == 0 && this.labelPositionY == 0){
            this.labelPositionX = this.labelMoney.node.x;
            this.labelPositionY = this.labelMoney.node.y;
        }
        this.labelMoney.node.active = true;
        if(isAction){
            this.labelMoney.node.runAction(cc.moveBy(1,cc.v2(0,15)));
        }
        this.scheduleOnce(()=>{
            this.labelMoney.node.active = false;
        }, 3)
        this.resetLabelPosition();
    },
    effectFlyMoney(money, fontSize = 50, moveTo = 50, posX = 0, posY = 0) { //add by si~
        if (typeof money !== 'number' || money == 0) { return; }
        //Set money more than 0
        var prefix = "";
        var font = null;
        if (money >= 0) {
            prefix = "+";
            font = this.fontPlus;
        } else {
            prefix = "-";
            font = this.fontSubtract;
        }
        //Create label
        var nodeText = new cc.Node('TextFly');
        var labelText = nodeText.addComponent(cc.Label);
        labelText.string = prefix + require('GameManager').getInstance().formatMoney(Math.abs(money));
        labelText.fontSize = fontSize;
        labelText.font = font;
        nodeText.position = cc.v2(posX, posY);
        this.node.addChild(nodeText);

        //Effect
        var moveUp = cc.moveBy(2, cc.v2(0, moveTo));
        var del = cc.delayTime(moveUp.getDuration() * 0.5);
        var fade = cc.fadeOut(moveUp.getDuration() - del.getDuration());
        var eff = cc.spawn(moveUp, cc.sequence(del, fade));
        var act = cc.sequence(eff, cc.callFunc(() => { if (labelText.node !== null) { labelText.node.destroy(); } }))
        labelText.node.runAction(act);
    },
    resetLabelPosition(){
        this.labelMoney.node.setPosition(this.labelPositionX,this.labelPositionY);
    },
    unuse(){
        this.aniWinText.node.active = false;
        this.lose.active = false;
        this.aniDrawText.node.active = false;
        this.labelMoney.node.active = false;
        this.labelMoney.node.opacity = 255;
        this.labelMoney.node.position = cc.v2(30,100);
    }
});
module.exports = EffectWinLose;