
const GameManager = require('GameManager')

cc.Class({
    extends: cc.Component,

    properties: {
        key: "",
        isChange: true
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad() {

    // },
    onEnable() {
        var lb = this.getComponent(cc.Label);
        lb.font = require('UIManager').instance.font_zawi;

        if (lb === null) return;
        lb.string = GameManager.getInstance().getTextConfig(this.key);
        let list = GameManager.getInstance().listCCFS;
        if (!list.includes(this)) list.push(this);
    },
    start() {
        // var lb = this.getComponent(cc.Label);
        // if (lb === null) return;
        // lb.string = GameManager.getInstance().getTextConfig(this.key);
    },
    getText() {
        var lb = this.getComponent(cc.Label);
        lb.string = GameManager.getInstance().getTextConfig(this.key);
    },
    onDestroy() {
        let arr = GameManager.getInstance().listCCFS;
        let indexMe = arr.indexOf(this);
        if (indexMe > -1) {
            GameManager.getInstance().listCCFS.splice(indexMe, 1);
        }
    }
    // update(dt) {
    //     if (GameManager.getInstance().isChangeLanguage) {
    //         if (this.isChange) {
    //             this.isChange = false;
    //             var lb = this.getComponent(cc.Label);
    //             if (lb === null) return;
    //             lb.string = GameManager.getInstance().getTextConfig(this.key);
    //             cc.NGWlog('--------> SET LAI ', this.key);
    //             setTimeout(() => {
    //                 this.isChange = true;
    //                 GameManager.getInstance().isChangeLanguage = false;
    //             }, 3000);
    //         }
    //     }
    // }

});
