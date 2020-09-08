
cc.Class({
    extends: cc.Component,

    properties: {
        value: {
            default: null,
            type: cc.Label,
        },

        backGround: {
            default: null,
            type: cc.Sprite,
        },

        shan8: {
            default: null,
            type: cc.Sprite,
        },

        shan9: {
            default: null,
            type: cc.Sprite,
        },

        rate: {
            default: null,
            type: cc.Sprite,
        },

        anim_win: {
            default: null,
            type: sp.Skeleton,
        },

        anim_lose: {
            default: null,
            type: sp.Skeleton,
        },

        lose_img: {
            default: null,
            type: cc.Sprite,
        },

        specialCard: {
            default: null,
            type: cc.Label,
        },

        rateFrame: [cc.SpriteFrame],
    },

    setInfo (numberOfCard,point,position,rate){
        this.node.setScale = 1.4;
        this.node.runAction(cc.scaleTo(0.2,1).easing(cc.easeCubicActionOut()));
        if(numberOfCard > 2){
            this.value.string = point + ' point';
        }else if(numberOfCard == 2 && point < 8){
            this.value.string = point + ' point';
        }else if(numberOfCard == 2 && point >= 8){
            this.value.node.active = false;
            this.backGround.node.active = false;
            if(point == 8){
                this.shan8.node.active = true;
            }else{
                this.shan9.node.active = true;
            }
        }
        if(rate == 5){
            this.value.node.active = false;
            this.backGround.node.active = false;
            this.specialCard.node.active = true;
        }
        this.node.position = cc.v2(position.x,position.y-60);
        this.node.runAction(cc.sequence(cc.scaleTo(0.2,1.2),cc.scaleTo(0.2,1)))
        this.rate.node.position = cc.v2(55 + (numberOfCard - 2) * 28,103 - (numberOfCard - 2) * 17);
        if(rate < 2){
            this.rate.node.active = false;
        }else{
            this.showRate(rate)
        }
    },

    showRate (rate){
        let index;
        switch (rate){
            case 2:
                index = 0;
                break;
            case 3:
                index = 1;
                break;
            case 5:
                index = 2;
                break;
        }
        this.rate.getComponent(cc.Sprite).spriteFrame = this.rateFrame[index];
    },

    showResultAni (isWin){
        let pos = this.node.position;
        let aniposx;
        cc.log('dmdmdmdm xem pos  : ', pos);
        if(pos.x > 120){
            aniposx = 120;
        }else{
            aniposx = - 120;
        }
        if(isWin == 1){
            this.anim_win.node.active = true;
            this.anim_win.node.x = aniposx;
            this.anim_win.node.y = 60;
            this.anim_win.setAnimation(0, "animation", true);
            setTimeout(() => {
                if(this.node != null){
                    this.anim_win.setAnimation(0, "animation", false);
                }
            }, 2000);
        }else{
            this.anim_lose.node.active = true;
            this.anim_lose.node.x = aniposx;
            this.anim_lose.node.y = 60;
            this.anim_lose.setAnimation(0, "animation", true);
            setTimeout(() => {
                if(this.node != null){
                    if(this.node != null){
                        this.anim_lose.setAnimation(0, "animation", false);
                        this.anim_lose.node.active = false;
                    }
                }
            }, 3000);

            this.lose_img.node.active = true;
            this.lose_img.node.x = aniposx;
            this.lose_img.node.y = 60;
            this.lose_img.node.runAction(cc.sequence(
                cc.scaleTo(0.1,1.8),
                cc.scaleTo(0.4,1).easing(cc.easeCubicActionOut()),
            ))
        }
    },

});
