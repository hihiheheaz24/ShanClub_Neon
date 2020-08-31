

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.node.setContentSize(cc.winSize);
        let cp = this.getComponent(cc.Sprite);
        if(cp){
            cp.sizeMode = 0;
        }

     },


    // update (dt) {},
});
