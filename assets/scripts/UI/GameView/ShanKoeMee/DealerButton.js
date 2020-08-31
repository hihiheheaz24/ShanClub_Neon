
cc.Class({
    extends: cc.Component,

    properties: {
        btn_draw: {
            default: null,
            type: cc.Button,
        },

        btn_compare: {
            default: null,
            type: cc.Button,
        },

        btn_finish: {
            default: null,
            type: cc.Button,
        },
    },

    setInfo (data){
        this.node.position = cc.v2(0,-100);
        if(data.optTransfers[0].isDisable == true){
            this.btn_compare.node.active = false;
        }
        if(data.optTransfers[1].isDisable == true){
            this.btn_draw.node.active = false;
        }
        if(data.optTransfers[2].isDisable == true){
            this.btn_finish.node.active = false;
        }
        this.node.runAction(cc.fadeIn(0.4));
        this.node.runAction(cc.moveTo(0.4,cc.v2(0,0)).easing(cc.easeCubicActionOut()));
    },

    onDealerDrawClick (){
        let timer = this.node.getChildByName('timer');
        if(timer != null){
            timer.destroy();
        }
        require('NetworkManager').getInstance().sendBanherOpt(2);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.buttonAudio);
        this.OnExit();
    },

    onDealerCompareClick (){
        let timer = this.node.getChildByName('timer');
        if(timer != null){
            timer.destroy();
        }
        require('NetworkManager').getInstance().sendBanherOpt(1);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.buttonAudio);
        this.OnExit();
    },

    onDealerFinishClick (){
        let timer = this.node.getChildByName('timer');
        if(timer != null){
            timer.destroy();
        }
        require('NetworkManager').getInstance().sendBanherOpt(3);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.buttonAudio);
        this.OnExit();
    },

    OnExit (){
        this.node.runAction(cc.moveTo(0.4,cc.v2(0,-100)).easing(cc.easeCubicActionOut()));
        this.node.runAction(cc.sequence(cc.fadeOut(0.4),cc.callFunc(()=>{this.node.destroy()})));
    }


});
