
cc.Class({
    extends: cc.Component,

    properties: {
        BackGround: {
            default: null,
            type: cc.Sprite,
        },

        Time: {
            default: null,
            type: cc.Label,
        },

        Label: {
            default: null,
            type: cc.Label,
        },

        anim_start: {
            default: null,
            type: sp.Skeleton,
        },
    },

    onLoad (){
        this.node.position = cc.v2(0,400);
        this.node.runAction(cc.moveTo(0.4,cc.v2(0,60)).easing(cc.easeCubicActionOut()));
    },

    // 0 = time to start
    // 1 = bet time
    // 2 = players turn
    // 3 = dealer turn

    startCountDown (time,type){
        this.Time.string = time;
        switch (type){
            case 0:
                this.Label.string = require('GameManager').getInstance().getTextConfig('shan2_starttime');
                break;
            case 1:
                this.Label.string = require('GameManager').getInstance().getTextConfig('shan2_bettime');
                break;
            case 2:
                this.Label.string = require('GameManager').getInstance().getTextConfig('shan2_player_takecard');
                break;
            case 3:
                this.Label.string = require('GameManager').getInstance().getTextConfig('shan2_bankertime');
                break;
        }
        let loop = setInterval(() => {
            if(time >= 0 && this.node != null){
                time --;
                this.Time.string = time;
                if(time <= 5 && type != 0){
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.clock_hurry);
                }
            }
            if(time == 0 || this.node == null){
                clearInterval(loop);
                if(this.node != null){
                    if(type == 0){
                        this.showStartAni();
                        this.BackGround.node.opacity = 0;
                        this.Label.node.opacity = 0;
                        this.Time.node.opacity = 0;
                    }else{
                        this.node.destroy();
                    }
                }
            }
        }, 1000);
    },

    showStartAni (){
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_start);
        this.anim_start.node.position = cc.v2(0,-70);
        this.anim_start.node.active = true;
        this.anim_start.setAnimation(0, "animation", false);
        setTimeout(()=>{
            if(this.node != null){
                this.anim_start.node.active = false;
                this.node.destroy();
            }
        },2000)
    },

});
