
cc.Class({
    extends: cc.Component,

    properties: {
        BackGround: {   
            default: null,
            type: cc.Sprite,
        },

        Label: {
            default: null,
            type: cc.Label,
        }
    },

    showNoti (type,value){
        let str;
        this.node.setScale = 0;
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.2,1.2),
            cc.scaleTo(0.4,1).easing(cc.easeCubicActionOut()),
        ))
        this.node.runAction(cc.fadeIn(0.2))
        
        if(type == 0){
            switch (value){
                case 0:
                    str = require('GameManager').getInstance().getTextConfig('gamescene_msg_vtable');
                    break;
                case 1:
                    str = 'Compare first round';
                    break;
                case 2:
                    str = 'Compare secound round';
                    break;
                case 3:
                    str = require('GameManager').getInstance().getTextConfig('txt_pot_not_enough_chip');
                    break;
            }
        }
        if(type == 1){
            str = " Banker gets pot's money after " + value + " more round";
        }
        if(type == 2){
            str = "Congratulation Banker for winning " + value + " chips";
        }
        if(type == 3){
            str = value;
        }

        this.Label.string = str;
        this.Label.font = require('UIManager').instance.font_zawi;
        this.Label.fontSize = 25;
        this.Label.lineHeight = 40;
        this.BackGround.node.width = 16.5 * str.length;

        setTimeout(()=>{
            if(this.node != null){
                this.node.runAction(cc.sequence(
                    cc.fadeOut(0.8).easing(cc.easeCubicActionOut()),
                    cc.callFunc(()=>{
                        this.node.destroy();
                    })
                ))
            }
        },2000)
    },
});
