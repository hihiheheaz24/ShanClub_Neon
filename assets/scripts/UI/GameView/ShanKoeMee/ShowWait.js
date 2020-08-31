
cc.Class({
    extends: cc.Component,

    properties: {
        slap_ani: {
            default: null,
            type: sp.Skeleton,
        },

        slapRed_ani:{
            default: null,
            type: sp.Skeleton,
        }
    },

    setInfo (pos,type){
        this.node.position = pos;
        if(type == 0){
            this.slap_ani.node.active = true;
            this.slap_ani.setAnimation(0, "waiting", true);
        }else{
            this.slapRed_ani.node.active = true;
            this.slapRed_ani.setAnimation(0, "animation", true);
        }
    },




});
