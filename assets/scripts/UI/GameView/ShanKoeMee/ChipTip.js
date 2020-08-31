
cc.Class({
    extends: cc.Component,

    properties: {

    },

    setInfo (index,des){
        this.node.position = this.getStartPosition(index);
        let act = cc.repeat(
            cc.sequence(
                cc.scaleTo(0.1,1,0.2),
                cc.scaleTo(0.1,1,1),
            ),4)      
        this.node.runAction(act);
        this.node.runAction(cc.sequence(
            cc.moveTo(1,des).easing(cc.easeCubicActionOut()),
            cc.callFunc(()=>{
                this.node.destroy();
            })
        ))
    },

    getStartPosition (index){
        switch (index) {
            case 0:
                return cc.v2(0,-175);
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
    },
});
