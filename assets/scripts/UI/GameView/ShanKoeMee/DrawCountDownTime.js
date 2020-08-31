
cc.Class({
    extends: cc.Component,

    properties: {
        Time : {
            default: null,
            type: cc.Label,
        },
    },

    onLoad (){
        this.node.position = cc.v2(-550,-250);
        this.node.zIndex = 1001;
        this.backUpCode = 0;
        this.Time.node.position = cc.v2(0,0);
    },

    startCountDown (time){
        this.Time.string = time + 1;
        let loop = setInterval(() => {
            if(time >= 0 && this.node != null){
                this.Time.string = time;
                time --;
            }
            if(time == - 1 || this.node == null){
                clearInterval(loop);
                if(this.node != null){
                    this.gameView.drawTimeOut(this.backUpCode);
                    this.node.destroy();
                }
            }
        }, 1000);
    },

    insertBackUpCode (code){
        this.backUpCode = code;
    },

});