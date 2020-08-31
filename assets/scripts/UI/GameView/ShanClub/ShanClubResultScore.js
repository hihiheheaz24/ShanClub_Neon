cc.Class({
    extends: cc.Component,

    properties: {
    
        bg_score: {
            default: null,
            type: cc.Sprite
        },

        lb_score: {
            default: null,
            type: cc.Label
        },
        bg_Shan: {
            default: null,
            type: cc.Sprite
        },

        listAniBork:[sp.SkeletonData],

        bg_bonus: {
            default: null,
            type: cc.Sprite
        },
        listImgBouns:[cc.SpriteFrame],
        listImgShan: [cc.SpriteFrame],
        
    },
    setResult( score, rate, numCard){
        if (rate > 1) {
            this.bg_bonus.node.active = true;
            if(rate == 2){
                this.bg_bonus.spriteFrame = this.listImgBouns[0];
            }else if(rate == 3) {
                this.bg_bonus.spriteFrame = this.listImgBouns[1];
            }else{
                this.bg_bonus.spriteFrame = this.listImgBouns[2];
            }
        } else {
            this.bg_bonus.node.active = false;
        }
        if (numCard === 2) {
            if (score === 8) {
                this.bg_Shan.node.active = true;
                this.bg_Shan.spriteFrame = this.listImgShan[0];
            }
            else if (score === 9) {
                this.bg_Shan.node.active = true;
                this.bg_Shan.spriteFrame = this.listImgShan[1];
            }
            else {
                this.bg_score.node.active = true;
                this.lb_score.string = score +" "+ require('GameManager').getInstance().getTextConfig('diem');
            }
        }
        else if (numCard === 3) {
            this.bg_score.node.active = true;
            this.bg_Shan.node.active = false;
            this.lb_score.string = score + " " + require('GameManager').getInstance().getTextConfig('diem');
            if (score === 11) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_sanh');
            if (score === 12) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_tpsanh');
            if (score === 13) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_3daunguoi');
            if (score === 14) this.lb_score.string = require('GameManager').getInstance().getTextConfig('txt_pok_xam');
        }
    
    },
    unuse(){
        this.bg_score.node.active = false;
        this.bg_Shan.node.active = false;
        this.bg_bonus.node.active = false;
    }

    

    // update (dt) {},
});
