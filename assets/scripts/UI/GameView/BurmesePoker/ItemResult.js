
var ItemResult = cc.Class({
    extends: cc.Component,

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },
        lbName: {
            default: null,
            type: cc.Label
        },
        listCard: {
            default: [],
            type: [require('Card')]
        },
        lbScore: {
            default: null,
            type: cc.Label
        },
        lbMoney: {
            default: null,
            type: cc.Label
        },
        border: {
            default: null,
            type: cc.Node
        },
        // fontAdd: {
        //     default: null,
        //     type: cc.BitmapFont
        // },
        // fontSub: {
        //     default: null,
        //     type: cc.BitmapFont
        // }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start() {

    // },

    // update (dt) {},

    setInfo(avatarSprite, name, listCardId, score, money, state) {
        // if (avaUrl === "") {
        //     require('GameManager').getInstance().loadTextureFromUrl(this.avatar, avaUrl);
        // }
        // else if (avaId > 0 && avaId < 100) {
        //     var url_ava = GameManager.getInstance().avatar_link.replace("%avaNO%", avaId);
        //     require('GameManager').getInstance().loadTextureFromUrl(this.avatar, url_ava);
        // }
        if (avatarSprite != null) {
            this.avatar.spriteFrame = avatarSprite.spriteFrame;
        }
        this.lbName.string = name;
        let indexRun = 0;
        // cc.NGWlog('-------000this.listCard.length ' + this.listCard.length);
        // cc.NGWlog('-------111listCardId.length ' + listCardId.length);
        for (let i = 0; i < listCardId.length; i++) {
            for (let j = 0; j < listCardId[i].length; j++) {
                if (indexRun < this.listCard.length) {
                    this.listCard[indexRun].setTextureWithCode(listCardId[i][j]);
                    this.listCard[indexRun].node.setScale(0.3);
                    this.listCard[indexRun].node.x = -250 + indexRun * this.listCard[indexRun].getContentSize().width * .5 * .5 + i * 20;
                    this.listCard[indexRun].node.zIndex = indexRun + GAME_ZORDER.Z_MENU_VIEW + 10;
                }
                indexRun++;
            }
        }

        this.lbScore.string = score + '';
        if (money < 0) {
            this.lbMoney.font = require('UIManager').instance.fontSub;
            this.border.active = false;
            this.lbMoney.string = require('GameManager').getInstance().formatMoney(money);
        } else {
            this.lbMoney.font = require('UIManager').instance.fontAdd;
            this.border.active = true;
            this.lbMoney.string = '+' + require('GameManager').getInstance().formatMoney(money);
        }
    }
});

module.export = ItemResult;