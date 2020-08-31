var BoxGroup = cc.Class({
    extends: cc.Component,

    properties: {
        bkg: {
            default: null,
            type: cc.Sprite
        },
        btnAdd: {
            default: null,
            type: cc.Button
        },
        listSpriteFrame: {//0-red, 1-yellow, 2-green
            default: [],
            type: cc.SpriteFrame
        },
        vtCard: {
            default: [],
            type: [require('Card')]
        },
        indexGroup: 0,
        typeCard: TYPE_CARD_RUMMY.NONE,
        funcCallback: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    // onClickAdd() {
    // if (this.funcCallback !== null) {
    // this.funcCallback.call(this.indexGroup);
    //     this.funcCallback(this.indexGroup);
    // }
    // },

    setVisibleButtonAdd(isVisible) {
        this.btnAdd.node.active = isVisible;
    },

    setInfoTypeCard(vtC, isInvalid) {
        this.typeCard = require('LogicManager').getTypeCardRummy(vtC);

        switch (this.typeCard) {
            // case TYPE_CARD_RUMMY.NONE:
            //     this.bkg.spriteFrame = listSpriteFrame[0];
            //     break;
            case TYPE_CARD_RUMMY.TCR_PURE:
            case TYPE_CARD_RUMMY.IMPURE:
                this.bkg.spriteFrame = this.listSpriteFrame[2];
                break;
            case TYPE_CARD_RUMMY.JOKER:
            case TYPE_CARD_RUMMY.SET:
                if (isInvalid) {
                    this.bkg.spriteFrame = this.listSpriteFrame[2];
                } else {
                    this.bkg.spriteFrame = this.listSpriteFrame[1];
                }
                break;
            default:
                this.bkg.spriteFrame = this.listSpriteFrame[0];
                break;
        }
    },
    getTypeCardRummy() {
        return this.typeCard;
    },

    setBkgContentSize(size) {
        this.bkg.node.setContentSize(size);
        // this.setContentSize(size);
    },

    getBkgContentSize() {
        return this.bkg.node.getContentSize();
    },
    setListenerBtnAdd(func) {
        this.funcCallback = func;
    },

    setVectorCard(vtC) {
        // vtCard.clear();
        this.vtCard = vtC;
    }
});

module.export = BoxGroup;