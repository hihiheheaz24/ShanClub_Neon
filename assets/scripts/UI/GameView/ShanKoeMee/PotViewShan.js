
cc.Class({
    extends: cc.Component,

    properties: {
        numbers:[cc.Label],
        seperators:[cc.Label],
    },

    showPot (value){
        this.initDefaultValue();
        let str = value.reverse();
        for(let i = 0; i < str.length; i ++){
            this.numbers[i].node.active = true;
            this.numbers[i].node.runAction(cc.sequence(cc.scaleTo(0.4,1.5),cc.scaleTo(0.2,1)));
            this.numbers[i].string = str[i];
        }
        if(value.length > 9){
            for(let i = 0; i < 3; i++){
                this.seperators[i].node.active = true;
            }
        }else if(value.length > 6){
            for(let i = 0; i < 2; i++){
                this.seperators[i].node.active = true;
            }
        }
        else if(value.length > 3){
            this.seperators[i].node.active = true;  
        }
    },

    initDefaultValue (){
        for(let i = 0; i < 3; i++){
            this.seperators[i].node.active = false;
        }
        for(let i = 0; i < 10; i++){
            this.numbers[i].node.active = false;
        }
    },

});
