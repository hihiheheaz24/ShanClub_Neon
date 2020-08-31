
cc.Class({
    extends: cc.Component,

    properties: {
        btn_draw :{
            default: null,
            type: cc.Button,
        },

        btn_finish :{
            default: null,
            type: cc.Button,
        },
    },

    onLoad (){
        this.node.opacity = 0;
        this.node.zIndex = 1001;
        this.isDraw = false;
    },

    setInfo (isBanker,isShan){
        this.node.position = cc.v2(0,-280);
        this.node.runAction(cc.fadeIn(0.4));
        if(isBanker == true){
            this.btn_draw.node.active = false;
            this.btn_finish.node.active = false;
            // this.btn_finish.node.x = 0;
            setTimeout(()=>{
                this.deActivateButton();
                this.deActivateHide();
                let item = this.gameView.node.getChildByName('DrawCountDown');
                if(item != null){
                    item.destroy();
                }
                this.gameView.changeCardBackToNomal();
            },1000)
        }
    },

    onDrawClick (){
        this.isDraw = true;
        require('NetworkManager').getInstance().sendBocCard(1);
        this.btn_draw.node.active = false;
        this.btn_finish.node.active = false;
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.buttonAudio);
        
    },

    showFinishBtn (){
        this.btn_finish.node.active = true;
        let label = this.btn_finish.node.getChildByName('Label');
        label.getComponent(cc.Label).string = 'Finish';
        this.btn_finish.node.x = 0;
    },

    onFinishClick (){
        if(this.isDraw == false){
            require('NetworkManager').getInstance().sendBocCard(0);
        }
        this.deActivateHide();
        this.deActivateButton();
        this.gameView.changeCardBackToNomal();
        let item = this.gameView.node.getChildByName('DrawCountDown');
        if(item != null){
            item.destroy();
        }
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.buttonAudio);
    },

    deActivateButton (){
        if(this.node != null){
            this.btn_draw.node.active = false;
            this.btn_finish.node.active = false;
            this.node.runAction(cc.sequence(cc.fadeOut(0.4),cc.callFunc(()=>{
                if(this.node != null){
                    this.node.destroy();
                }
            })));
        }
    },

    deActivateHide (){
        if(this.node != null){
            let hide = this.gameView.node.getChildByName('Hide');
            if(hide != null){
                hide.destroy();
            }
            // hide.runAction(cc.sequence(cc.fadeOut(0.4),cc.callFunc(()=>{
            //     if(this.node != null){
            //         hide.destroy();
            //     }
            // })));
        }
    }

});

