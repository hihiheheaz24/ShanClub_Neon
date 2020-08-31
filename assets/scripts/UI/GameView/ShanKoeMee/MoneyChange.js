
cc.Class({
    extends: cc.Component,

    properties: {
        Value: {
            default: null,
            type: cc.Label,
        },

        winFont: {
            default: null,
            type: cc.Font,
        },

        loseFont: {
            default: null,
            type: cc.Font,
        }
    },

    // 1 = plus;    2 = minus;  3 = tip
    setInfo (type,value,index){
        let money = require('GameManager').getInstance().formatMoneyChip(value);
        if(type == 0){
            this.Value.font = this.winFont;
            this.Value.string = '+ ' + money;
        }else if(type == 1){
            this.Value.font = this.loseFont;
            this.Value.string = money;
        }else{
            this.Value.font = this.loseFont;
            this.Value.string = '- ' + money;
        }
        
        let pos = this.getPlayerPosition(index);
        this.node.position = pos;
        this.node.setScale = 2
        this.node.runAction(cc.moveTo(2,cc.v2(pos.x,pos.y + 80)).easing(cc.easeCubicActionOut()));
        this.node.runAction(cc.sequence(cc.scaleTo(0.2,0.9),cc.scaleTo(0.2,1).easing(cc.easeCubicActionOut())));
        setTimeout(()=>{
            if(this.node != null){
                this.node.destroy();
            }
        },2000)
    },

    getPlayerPosition (index){
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
    }


});
