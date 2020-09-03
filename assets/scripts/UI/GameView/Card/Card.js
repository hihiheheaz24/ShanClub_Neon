const UIManager = require('UIManager')

cc.Class({
    extends: cc.Component,
    properties: {
        imgBackground: {
            default: null,
            type: cc.Sprite
        },
        imgShan: {
            default: null,
            type: cc.Node,
        },
        imgValue: {
            default: null,
            type: cc.Sprite
        },
        imgSuitSmall: {
            default: null,
            type: cc.Sprite
        },
        imgSuitLarge: {
            default: null,
            type: cc.Sprite
        },
        borderCard: {
            default: null,
            type: cc.Sprite
        },
        effCard: {
            default: null,
            type: sp.Skeleton
        },

        code: 0,
        N: 0,
        S: 0,
        nameCard: "",
        isJoker: false,

        functionCallback: null,
        isChoose: false, //hien dung cai nay cho siku.hihi.
        isSelect: false,
        isTouch: true,
        isEat: false,
        isLock: false,
        isFire: false,
        iconLock: {
            default: null,
            type: cc.Sprite,
            visible: false
        },
        iconEat: {
            default: null,
            type: cc.Sprite,
            visible: false
        },
        bkgMask: {
            default: null,
            type: cc.Node
        },
        isCardRuning: false, //siku hien dung cai nay.
        countTurn: 0,
        card_border_green: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.moveAction = null;
    },

    start() {

    },

    // update (dt) {},

    setTextureWithCode(cod, isShan = false, isShowCorner = false) {
        this.code = cod;
        if (this.code === CODE_JOKER_RED || this.code === CODE_JOKER_BLACK) {
            this.decodeCard(this.code);
            this.imgValue.node.active = true;
            this.imgSuitSmall.node.active = false;
            this.imgSuitLarge.node.active = true;
            this.setJoker(true);

            this.imgBackground.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(ResDefine.card_background);
            this.imgValue.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(ResDefine.card_joker_text);

            this.imgSuitLarge.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(ResDefine.card_joker);

            if (this.code === CODE_JOKER_RED) {
                this.imgValue.node.color = cc.Color.RED;
            } else {
                this.imgValue.node.color = cc.Color.BLACK;
            }

            this.imgValue.node.height = 148;
            this.imgValue.node.width = 15;

            this.imgValue.type = cc.Sprite.Type.SIMPLE;
            this.imgValue.SizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.imgSuitSmall.type = cc.Sprite.Type.SIMPLE;
            this.imgSuitSmall.SizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.imgSuitLarge.type = cc.Sprite.Type.SIMPLE;
            this.imgSuitLarge.SizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.imgValue.node.setScale(1.0);
            this.imgSuitSmall.node.setScale(1.0);
            this.imgSuitLarge.node.setScale(1.0);
        }
        else if (this.code <= 0 || this.code > 52) {
            this.imgValue.node.active = false;
            this.imgSuitSmall.node.active = false;
            this.imgSuitLarge.node.active = false;

            this.imgBackground.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(ResDefine.card_back);
        }
        else {
            this.imgValue.node.active = true;
            this.imgSuitSmall.node.active = true;
            this.imgSuitLarge.node.active = true;

            this.decodeCard(this.code);
            this.imgBackground.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(ResDefine.card_background);

            var strSuit = this.getSuitInVN();

            this.imgValue.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(cc.js.formatStr(ResDefine.card_number_d, this.getValue()));
            this.imgSuitSmall.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(cc.js.formatStr(ResDefine.card_suit_small_s, strSuit));
            if (this.N >= 11 && this.N <= 13) {
                this.imgSuitLarge.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(cc.js.formatStr(ResDefine.card_suit_human_d_s, this.getValue(), strSuit));
            } else {
                this.imgSuitLarge.spriteFrame = UIManager.instance.listFrameCard.getSpriteFrame(cc.js.formatStr(ResDefine.card_suit_s, strSuit));
            }

            if (strSuit === 'tep' || strSuit === 'bich') {
                this.imgValue.node.color = cc.Color.BLACK;
            } else {
                this.imgValue.node.color = cc.Color.RED;
            }


            this.imgValue.type = cc.Sprite.Type.SIMPLE;
            this.imgValue.SizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.imgSuitSmall.type = cc.Sprite.Type.SIMPLE;
            this.imgSuitSmall.SizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.imgSuitLarge.type = cc.Sprite.Type.SIMPLE;
            this.imgSuitLarge.SizeMode = cc.Sprite.SizeMode.TRIMMED;

            this.imgValue.node.setScale(1.0);
            this.imgSuitSmall.node.setScale(1.0);
            this.imgSuitLarge.node.setScale(1.0);
        }
        if (isShan == true) {
            this.showShanCard()
            this.showShanCorner(isShowCorner)
        } else {
            this.imgShan.active = false;
        }
    },

    showShanCard() {
        let suitName = this.getSuitInVN();
        this.imgShan.active = true;
        this.imgShan.getComponent('CardShan').setInfo(this.S, this.N, suitName, this.imgSuitSmall.spriteFrame, this.imgValue.spriteFrame)
    },

    showShanCorner(isShow) {
        this.imgShan.getComponent('CardShan').showCorner(isShow)
    },

    exitShanCard() {
        this.imgShan.active = false;
    },

    setDark(isDark, _spriteFrame = null) {
        this.bkgMask.active = isDark;
    },

    setColorCard(color) {
        this.imgBackground.node.color = color;
    },

    setJoker(isJoker) {
        this.isJoker = isJoker;
    },

    setBorder(isBorder) {
        if (require("GameManager").getInstance().curGameId == GAME_ID.SHAN_PLUS
            || require("GameManager").getInstance().curGameId == GAME_ID.SHANKOEMEE) {
            this.borderCard.spriteFrame = this.card_border_green;
        }
        this.borderCard.node.active = isBorder;
    },

    setEffectCard(delay) {
        this.effCard.node.active = true;
        this.effCard.setAnimation(0, "animation", true);

        this.node.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(() => {
            this.effCard.node.active = false;
        })));
    },

    hideEffectCard() {
        this.effCard.node.active = false;
    },

    setCardOpacity(opacity) {
        this.imgBackground.node.opacity = opacity;
    },

    encodeCard() {
        // // mỗi game có 1 điều encode # nhau
        if (this.N === CODE_JOKER_RED || this.N === CODE_JOKER_BLACK)
            return this.N;
        if (require('GameManager').getInstance().curGameId === GAME_ID.SHAN_PLUS) return 13 * (this.S - 1) + this.N;
        return 13 * (this.S - 1) + this.N - 1;
    },
    decodeCard(cod) {
        this.code = cod;
        if (this.code === CODE_JOKER_RED || this.code === CODE_JOKER_BLACK) {
            this.S = this.code;
            this.N = this.code;
            return;
        }
        // // mỗi game có 1 điều decode # nhau
        this.S = (parseInt((cod - 1) / 13) + 1); //>=1 <=4
        this.N = (parseInt((cod - 1) % 13) + 2); // >=2 , <=14

        //if (GPManager -> curGameId == BOHN) {
        //    this -> S = (code - 1) / 13 + 1; //>=1 <=4
        //    this -> N = (code - 1) % 13 + 2; // >=2 , <=14
        //}

        // //    if (GamePlayManager::getInstance()->curGameId==TIENLEN || GamePlayManager::getInstance()->curGameId==SAM)
        // //    {
        // //        this->N = (code - 1) % 13 + 3; // >=3 , <=15
        // //    }


        if (require('GameManager').getInstance().curGameId === GAME_ID.SHAN_PLUS) this.N = (cod - 1) % 13 + 1;

        this.nameCard = this.N + this.getSuitInVN();
    },

    getValue() {
        if (this.N === CODE_JOKER_RED || this.N === CODE_JOKER_BLACK)
            return this.N;
        if (this.N > 13) {
            return (this.N - 13)
        }

        return this.N;
    },

    getSuitInVN() {
        if (require('GameManager').getInstance().curGameId === GAME_ID.BOOGYI
            || require('GameManager').getInstance().curGameId === GAME_ID.BOHN
            || require('GameManager').getInstance().curGameId === GAME_ID.SHAN_PLUS
            || require('GameManager').getInstance().curGameId === GAME_ID.SHANKOEMEE) {
            switch (this.S) {
                case 1:
                    return 'tep';
                case 2:
                    return 'ro';
                case 3:
                    return 'co';
                case 4:
                    return 'bich';
                default:
                    return 'joker';
            }
        } else {
            switch (this.S) {
                case 1:
                    return 'bich';
                case 2:
                    return 'tep';
                case 3:
                    return 'ro';
                case 4:
                    return 'co';
                default:
                    return 'joker';
            }
        }
    },

    getContentSize() {
        return this.imgBackground.node.getContentSize();
    },
    setFuncCallback(funcCall) {
        this.functionCallback = funcCall;
    },
    onClickCard() {
        if (this.functionCallback !== null && this.isTouch)
            this.functionCallback.call();
    },
    setIsLockCard(isLok, _spriteFrame = null) {
        this.isLock = isLok;
        if (this.isLock === false && _spriteFrame === null) return;
        if (this.iconLock === null) {
            let icLock = new cc.Node("Lock");
            this.node.addChild(icLock);
            this.iconLock = icLock.addComponent(cc.Sprite);
            this.iconLock.spriteFrame = _spriteFrame;
            this.iconLock.type = cc.Sprite.Type.SIMPLE;
            this.iconLock.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            this.iconLock.node.setPosition(cc.v2(-45, -38));
        }

        this.iconLock.node.active = this.isLock;
    },

    getIsLockCard() {
        return this.isLock;
    },

    setIsEat(isEt, _spriteFrame = null) {
        this.isEat = isEt;
        if (this.isEat === false && _spriteFrame === null) return;
        if (this.iconEat === null) {
            let icEat = new cc.Node("Eat");
            this.node.addChild(icEat);
            this.iconEat = icEat.addComponent(cc.Sprite);
            this.iconEat.spriteFrame = _spriteFrame;
            this.iconEat.type = cc.Sprite.Type.SIMPLE;
            this.iconEat.sizeMode = cc.Sprite.SizeMode.TRIMMED;
            this.iconEat.node.setPosition(cc.v2(-45, -38));
        }

        this.iconEat.node.active = this.isEat;
    },
    getIsEat() {
        return this.isEat;
    },


    unuse() {
        this.node.active = true;
        this.node.zIndex = 0;
        this.bkgMask.active = false;
        this.node.opacity = 255;
        this.node.stopAllActions();
        this.node.rotation = 0;
        this.node.setScale(1);
        this.node.setAnchorPoint(cc.v2(0.5, 0.5));
        this.effCard.node.active = false;
        this.node.skewY = 0;
        this.setColorCard(cc.Color.WHITE);
        this.setBorder(false);
        this.setJoker(false);
        this.isEat = false;
        this.isLock = false;
        this.isFire = false;
        this.countTurn = 0;
        if (this.iconLock !== null)
            this.iconLock.node.active = false;
        if (this.iconEat !== null)
            this.iconEat.node.active = false;
        this.imgValue.node.height = 50;
        this.imgValue.node.width = 34;

    },

    setIsFire(_isFire) {
        this.isFire = _isFire;
    },

    getIsFire() {
        return this.isFire;
    },

    moveCardNoBug(time, pos) {
        if (this.moveAction != null) {
            this.node.stopAction(this.moveAction);
        }
        this.moveAction = cc.moveTo(time, pos).easing(cc.easeCubicActionOut());
        this.node.runAction(this.moveAction);
    },
});