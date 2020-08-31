var GameView = require('GameView2')
var GameManager = require('GameManager')
const { ccclass, property } = cc._decorator;
var SCALE_CARD = .8
var TAG_BAI_DANH = 9090
var TAG_GROUP_CARD = 9191

// var PlayerWin = {
//     name: '',
//     vector<vector< int >> vtCard;
// int score;
// long long money;
// long long total_money;
// string state;
// string avt_url;
// };

// struct ConstrainDiscards{
//     int cardID;
//     int idPlayerDiscard;
//     int idPlayerTakecard;
//     bool justTakePlace;//false: vua an xong khong duoc danh
//     bool required;//true khong duoc danh nua
// };

var ComparisionTalaForN = function (x, y) {
    var xN = x.N;
    var yN = y.N;
    if (xN < yN || (xN == yN && x.S < y.S))
        return 1;
    else
        return -1;
}

var BurmesePokerView = cc.Class({
    extends: GameView,

    properties: {
        spGroupNoc: {
            default: null,
            type: cc.Node
        },
        spCardNoc: {
            default: null,
            type: cc.Node
        },
        spCardView: {
            default: null,
            type: cc.Node
        },
        btnNewCard: {
            default: null,
            type: cc.Button
        },
        btnFaceUp: {
            default: null,
            type: cc.Button
        },
        btnDrop: {
            default: null,
            type: cc.Button
        },
        btnDeclare: {
            default: null,
            type: cc.Button
        },
        btnFinish: {
            default: null,
            type: cc.Button
        },
        btnGroup: {
            default: null,
            type: cc.Button
        },
        btnAddCard: {
            default: null,
            type: cc.Button
        },
        btnDiscard: {
            default: null,
            type: cc.Button
        },
        btnEatCard: {
            default: null,
            type: cc.Button
        },
        lbNumCardNoc: {
            default: null,
            type: cc.Label
        },
        lbMoneyDrop: {
            default: null,
            type: cc.Label
        },
        lbDeclare: {
            default: null,
            type: cc.Label
        },
        lbWait: {
            default: null,
            type: cc.Label
        },
        numCardNoc: {
            default: 0,
            visible: false,
        },
        thisArrayCard: {
            default: [],
            visible: false,
            type: [cc.Integer]
        },
        sizeWin: {
            default: cc.view.getVisibleSize(),
            visible: false,
        },
        turnName: {
            default: "",
            visible: false,
        },
        turnNameFire: {
            default: "",
            visible: false,
        },
        vtCardDanh: {
            default: [],
            visible: false,
            type: [require('Card')]
        },

        vtCardDeclare: {
            default: [],
            visible: false
        },
        vtBoxGroups: {
            default: [],
            visible: false,
            type: [require('BoxGroup')]
        },
        vtPlayerWin: {
            default: [],
            visible: false,
            //     type: [require('PlayerWin')]
        },
        namePlayerEatCardMe: {
            default: "",
            visible: false,
        },
        numCardSelect: {
            default: 0,
            visible: false,
        },
        isDeclare: {
            default: false,
            visible: false,
        },
        isMyDeclare: {
            default: false,
            visible: false,
        },
        numCardNoc: {
            default: 0,
            visible: false,
        },

        isDeclareNotTouchCard: {
            default: false,
            visible: false,
        },
        timeDeclare: {
            default: 15,
            visible: false,
        },
        countCardEat: {
            default: 0,
            visible: false,
        },

        posDefaultCardDrag: cc.v2(0, 0),
        posTouchBegan: cc.v2(0, 0),
        thisCards: {
            default: [],
            visible: false,
            type: [require('Card')]
        },
        cardCode: {
            default: [],
            visible: false,
            type: [require('Card')]
        },
        zOrderCard: {
            default: 0,
            visible: false,
        },

        isWaitDone: {
            default: false,
            visible: false,
        },
        POS_CARD_X: {
            default: 705,
            visible: false,
        },
        POS_CARD_Y: {
            default: 100,
            visible: false,
        },

        boxGroupPrefab: {
            default: null,
            type: cc.Prefab
        },

        chipPrefab: {
            default: null,
            type: cc.Prefab
        },
        chipBet: {
            default: [],
            type: [require('Chip')]
        },
        indexNumber: 0,
        anim_win: {
            default: null,
            type: sp.Skeleton
        },
        isTouchOnNode: false,
        listConstrainDiscards: [],
        bkgResult: {
            default: null,
            type: cc.Node
        },
        listItemResult: {
            default: [],
            type: [require('ItemResult')]
        },

        spriteFrameLock: {
            default: null,
            type: cc.SpriteFrame
        },

        spriteFrameEat: {
            default: null,
            type: cc.SpriteFrame
        },
        cardRunning: false
    },
    statics: {
        isInvalid: false,
    },
    onLoad() {
        this._super();
        this.sizeWin = cc.view.getVisibleSize();
        this.POS_CARD_X = 20;
        this.node.on(cc.Node.EventType.TOUCH_START, (touch) => {
            // touch.bubbles = false; // Handled event don't let it propogate!
            cc.NGWlog("-=-=-=-> Touch Began");
            if (this.thisPlayer === null) return;
            if (this.thisPlayer.isFold || this.isDeclareNotTouchCard) return;

            this.posTouchBegan = cc.v2(touch.getLocation()); //touch.getLocation();
            
            for (let i = this.vtCardDeclare.length - 1; i >= 0; i--) {
                for (let j = this.vtCardDeclare[i].length - 1; j >= 0; j--) {
                    var card = this.vtCardDeclare[i][j];

                    if (card.node.getBoundingBoxToWorld().contains(this.posTouchBegan) && card.isTouch) {
                        this.cardCode = card;
                        this.posDefaultCardDrag = card.node.position;
                        this.zOrderCard = card.node.zIndex;
                        this.isTouchOnNode = true;
                        return true;
                    }
                }
            }
            this.isTouchOnNode = false;
            return false;
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
            cc.NGWlog("-=-=-=-> Touch Move");
            if (this.isTouchOnNode === false) return;
            if (this.thisPlayer === null || this.cardCode === null) return;
            if (this.thisPlayer.isFold || this.isDeclareNotTouchCard) return;
            var indexI = 0;
            var indexJ = 0;
            var indexITemp = 0;

            this.thisCards = [];
            for (var i = 0; i < this.vtCardDeclare.length; i++) {
                if (this.vtCardDeclare[i].length <= 0) {
                    // this.vtCardDeclare.erase(this.vtCardDeclare.begin() + i);
                    this.vtCardDeclare.splice(i, 1);
                    i--;
                } else {
                    for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                        this.thisCards.push(this.vtCardDeclare[i][j]);
                    }
                }
            }
            for (var i = 0; i < this.vtCardDeclare.length; i++) {
                for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                    // var card = this.vtCardDeclare[i][j];
                    if (this.vtCardDeclare[i][j] === this.cardCode) {
                        indexI = i;
                        indexJ = j;
                        break;
                    }
                }
            }

            // cc.NGWlog('----- indexI ' + indexI);
            // cc.NGWlog('----- indexJ ' + indexJ);

            var siC = this.thisCards.length;
            for (var i = 0; i < siC; i++) {
                if (this.thisCards[i] === this.cardCode) {
                    break;
                }
                indexITemp++;
            }

            // cc.NGWlog('----- indexITemp ' + indexITemp);
            if (indexITemp > siC) return;
            var touchPos = touch.getLocation();
            var cardSelect = this.vtCardDeclare[indexI][indexJ];
            var w = cardSelect.getContentSize().width;

            var posXMin = this.POS_CARD_X + (-1 - siC / 2 + (siC % 2 == 0 ? .5 : 0)) * w * SCALE_CARD * .5;
            var posXMax = this.POS_CARD_X + (siC - siC / 2 + (siC % 2 == 0 ? .5 : 0)) * w * SCALE_CARD * .5;
            var posYMin = this.POS_CARD_Y;

            var posX = this.posDefaultCardDrag.x + touchPos.x - this.posTouchBegan.x;

            if (posX > posXMax) {
                posX = posXMax;
            }
            if (posX < posXMin) {
                posX = posXMin;
            }

            var pos = cc.v2(posX, posYMin);
            cardSelect.node.setPosition(pos);
            if (this.posTouchBegan.sub(touchPos).mag() > cardSelect.getContentSize().width * .25) {
                cardSelect.node.zIndex = GAME_ZORDER.Z_CARD + 20;
                cardSelect.node.opacity = 200;
            }

            var disCard = w * SCALE_CARD * .5;

            var indexJTemp = indexITemp + 1;
            if (indexJTemp < this.thisCards.length) {
                var cardTemp = this.thisCards[indexJTemp];
                var ii = 0;
                var jj = 0;
                for (var i = 0; i < this.vtCardDeclare.length; i++) {
                    for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                        var card = this.vtCardDeclare[i][j];
                        if (card === cardTemp) {
                            ii = i;
                            jj = j;
                            break;
                        }
                    }
                }

                if (cardTemp.node.position.x < pos.x) {
                    // var pNewX = cardTemp.node.position.x - disCard;
                    // cardTemp.node.setPosition(cc.v2(pNewX, pos.y));

                    var pNewX = cardTemp.node.x - disCard;
                    // cardTemp.node.setPosition(cc.v2(pNewX, pos.y));
                    cardTemp.node.x = pNewX;
                    if (indexI === ii) {
                        // this.vtCardDeclare[ii].swap(indexJ, jj);
                        var tt = this.vtCardDeclare[ii][indexJ];
                        this.vtCardDeclare[ii][indexJ] = this.vtCardDeclare[ii][jj];
                        this.vtCardDeclare[ii][jj] = tt;
                    } else {
                        // this.vtCardDeclare[ii].insert(jj + 1, cardSelect);
                        // this.vtCardDeclare[indexI].eraseObject(cardSelect);
                        // if (this.vtCardDeclare[indexI].length <= 0)
                        //     this.vtCardDeclare.erase(this.vtCardDeclare.begin() + indexI);

                        this.vtCardDeclare[ii].splice(jj + 1, 0, cardSelect);
                        this.vtCardDeclare[indexI].splice(indexJ, 1);
                        if (this.vtCardDeclare[indexI].length <= 0)
                            this.vtCardDeclare.splice(indexI, 1);
                        this.showEffectGroup2();
                    }
                }
            }
            indexJTemp = indexITemp - 1;
            if (indexJTemp >= 0) {
                var cardTemp = this.thisCards[indexJTemp];
                var ii = 0;
                var jj = 0;
                for (var i = 0; i < this.vtCardDeclare.length; i++) {
                    for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                        var card = this.vtCardDeclare[i][j];
                        if (card === cardTemp) {
                            ii = i;
                            jj = j;
                            break;
                        }
                    }
                }

                if (cardTemp.node.position.x > pos.x) {
                    var pNewX = cardTemp.node.x + disCard;
                    // cardTemp.node.setPosition(cc.v2(pNewX, pos.y));
                    cardTemp.node.x = pNewX;
                    if (indexI === ii) {
                        // this.vtCardDeclare.at(ii).swap(indexJ, jj);
                        var tt = this.vtCardDeclare[ii][indexJ];
                        this.vtCardDeclare[ii][indexJ] = this.vtCardDeclare[ii][jj];
                        this.vtCardDeclare[ii][jj] = tt;
                    } else {
                        this.vtCardDeclare[ii].splice(jj, 0, cardSelect);
                        this.vtCardDeclare[indexI].splice(indexJ, 1);
                        if (this.vtCardDeclare[indexI].length <= 0)
                            this.vtCardDeclare.splice(indexI, 1);
                        this.showEffectGroup2();
                    }
                }
            }
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            cc.NGWlog("-=-=-=-> Touch End");
            if (this.isTouchOnNode === false) return;
            if (this.thisPlayer === null) return;
            if (this.thisPlayer.isFold || this.isDeclareNotTouchCard || this.cardCode === null) return;
            var touchPos = touch.getLocation();
            if (this.posTouchBegan.sub(touchPos).mag() <= this.cardCode.getContentSize().width * .25) {
                if (this.cardCode.isSelect) {
                    var siz = this.thisPlayer.vectorCard.length;
                    var indexCardSelect = this.cardCode.node.zIndex - GAME_ZORDER.Z_CARD;
                    // cc.NGWlog("====No nam thu: " + indexCardSelect);
                    if (indexCardSelect >= 0 && indexCardSelect < siz) {
                        var posX = this.POS_CARD_X + (indexCardSelect - parseInt(siz / 2)) * this.cardCode.getContentSize().width * .5 * SCALE_CARD;

                        this.cardCode.node.runAction(cc.moveTo(.1, cc.v2(posX, this.POS_CARD_Y)));
                    } else {
                        this.cardCode.node.runAction(cc.moveTo(.1, cc.v2(this.posDefaultCardDrag.x, this.POS_CARD_Y)));
                    }

                    this.cardCode.isSelect = false;

                    this.numCardSelect--;
                    if (this.numCardSelect <= 0) this.numCardSelect = 0;
                } else {
                    this.cardCode.node.runAction(cc.moveTo(.1, cc.v2(this.posDefaultCardDrag.x, this.POS_CARD_Y + 30)));
                    this.cardCode.isSelect = true;

                    var siz = this.thisPlayer.vectorCard.length;
                    this.numCardSelect++;
                    if (this.numCardSelect >= siz) this.numCardSelect = siz;
                }

                this.cardCode.node.opacity = 255;
                this.cardCode.node.zIndex = this.zOrderCard;
                this.checkShowButton();
                return;
            }

            this.sortViewCard(false, () => {
                this.showEffectGroup2();
            });

            this.cardCode = null;
        }, this);


        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touch) => {
            cc.NGWlog("-=-=-=-> Touch Cancel");
            if (this.isTouchOnNode === false) return;
            if (this.thisPlayer === null) return;
            if (this.thisPlayer.isFold || this.isDeclareNotTouchCard || this.cardCode === null) return;
            var touchPos = touch.getLocation();
            if (this.posTouchBegan.sub(touchPos).mag() <= this.cardCode.getContentSize().width * .25) {
                if (this.cardCode.isSelect) {
                    var siz = this.thisPlayer.vectorCard.length;
                    var indexCardSelect = this.cardCode.node.zIndex - GAME_ZORDER.Z_CARD;
                    // cc.NGWlog("====No nam thu: " + indexCardSelect);
                    if (indexCardSelect >= 0 && indexCardSelect < siz) {
                        var posX = this.POS_CARD_X + (indexCardSelect - parseInt(siz / 2)) * this.cardCode.getContentSize().width * .5 * SCALE_CARD;

                        this.cardCode.node.runAction(cc.moveTo(.1, cc.v2(posX, this.POS_CARD_Y)));
                    } else {
                        this.cardCode.node.runAction(cc.moveTo(.1, cc.v2(this.posDefaultCardDrag.x, this.POS_CARD_Y)));
                    }

                    this.cardCode.isSelect = false;

                    this.numCardSelect--;
                    if (this.numCardSelect <= 0) this.numCardSelect = 0;
                } else {
                    this.cardCode.node.runAction(cc.moveTo(.1, cc.v2(this.posDefaultCardDrag.x, this.POS_CARD_Y + 30)));
                    this.cardCode.isSelect = true;

                    var siz = this.thisPlayer.vectorCard.length;
                    this.numCardSelect++;
                    if (this.numCardSelect >= siz) this.numCardSelect = siz;
                }

                this.cardCode.node.opacity = 255;
                this.cardCode.node.zIndex = this.zOrderCard;
                this.checkShowButton();
                return;
            }

            this.sortViewCard(false, () => {
                this.showEffectGroup2();
            });

            this.cardCode = null;
        }, this);

        this.btnAddCard.node.setScale(SCALE_CARD);
        this.btnEatCard.node.setScale(SCALE_CARD);
        this.spCardNoc.setScale(SCALE_CARD);
        this.spCardView.setScale(SCALE_CARD);

    },

    // start() {
    //     //this._super();
    //     this.btnAddCard.node.setScale(SCALE_CARD);
    //     this.btnEatCard.node.setScale(SCALE_CARD);
    //     this.spCardNoc.setScale(SCALE_CARD);
    //     this.spCardView.setScale(SCALE_CARD);
    //     // this.spGroupNoc.active = false;

    //     // for (let i = 0; i < require('HandleParseDataBurmesePoker').listEvt.length; i++) {
    //     //     require('HandleParseDataBurmesePoker')._handleParseDataGame(require('HandleParseDataBurmesePoker').listEvt[i]);
    //     // }

    //     // require('HandleParseDataBurmesePoker').listEvt = [];
    // },

    chiabai(data) {
        // { "evt": "lc", "arr": [30, 42, 2, 7, 4, 36, 17, 3, 18, 43, 32, 31, 24], "nextTurn": "sondt123789", "deckCount": 69 }
        this.resetGame();
        var arr = data.arr;
        this.turnName = data.nextTurn;
        this.numCardNoc = data.deckCount;
        this.stateGame = STATE_GAME.PLAYING;
        for (let i = 0; i < this.players.length; i++) {
            this.players[i]._playerView.setDark(false);
        }
        this.node.runAction(cc.sequence(cc.delayTime(1.0), cc.callFunc(() => {
            this.spGroupNoc.active = true;
            this.lbMoneyDrop.string = GameManager.getInstance().formatMoney(20 * this.agTable);
            this.setCardNoc();
            this.btnAddCard.node.active = true;
            this.btnEatCard.node.active = true;

            this.thisArrayCard = [];
            var siC = arr.length;

            for (var i = 0; i < siC; i++) {
                this.thisArrayCard.push(arr[i]);
                var card = this.getCard();
                card.setTextureWithCode(arr[i]);
                card.node.setScale(SCALE_CARD);
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD + i);
                card.node.setPosition(this.btnAddCard.node.x, this.btnAddCard.node.y);
                this.thisPlayer.vectorCard.push(card);

                var posX = this.POS_CARD_X + (i - parseInt(siC / 2)) * card.getContentSize().width * .5 * SCALE_CARD;
                this.POS_CARD_Y = card.getContentSize().height * .5 * SCALE_CARD - this.sizeWin.height / 2;

                if (i >= siC - 1) {
                    card.node.runAction(cc.sequence(cc.delayTime(i * 0.05), cc.moveTo(.2, cc.v2(posX, this.POS_CARD_Y)), cc.callFunc(() => {
                        this.sortCardStart();

                        // cc.NGWlog('------------> 2  ' + this.turnName);
                        this.onTurn();
                    })));
                } else {
                    card.node.runAction(cc.sequence(cc.delayTime(i * 0.05), cc.moveTo(.2, cc.v2(posX, this.POS_CARD_Y))));
                }
            }
        }, this)));
    },
    danhBai(namePlayer, vtIdCard, turName, time = 20) {
        // { "N": "mya_mhuu", "C": [44], "evt": "dc", "NN": "fb.140872170086612" }
        this.turnName = turName;
        this.turnNameFire = namePlayer;
        for (var i = 0; i < vtIdCard.length; i++) {
            if (vtIdCard[i] < 0) continue;
            this.danhBai1(namePlayer, vtIdCard[i], i, i >= vtIdCard.length - 1);
        }

        if (namePlayer !== this.turnName && this.turnName !== "")
            this.onTurn(null, time);
    },
    layBai(namePlayer, idCard, isBoc) {
        var player = this.getPlayer(namePlayer);
        if (player === null) return;
        // cc.NGWlog('------------------------LayBAI ' + idCard);
        // cc.NGWlog(player);

        //         //    if(thisPlayer->isFold || isDrag || isDeclareNotTouchCard) return;
        var card = null;

        if (isBoc) {
            card = this.getCard();
            this.node.addChild(card.node, GAME_ZORDER.Z_CARD);

            this.numCardNoc--;
            this.setCardNoc();
        } else {
            if (this.vtCardDanh.length > 0) {
                card = this.vtCardDanh[this.vtCardDanh.length - 1];
                // this.vtCardDanh.eraseObject(card);
                this.vtCardDanh.pop();
            } else {
                // card = Card_India:: create();
                // this -> addChild(card, Z_CARD);

                card = this.getCard();
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD);
            }
        }

        card.node.stopAllActions();
        card.isTouch = false;
        card.node.setScale(SCALE_CARD);
        card.setTextureWithCode(idCard);
        card.node.setPosition(isBoc ? this.btnAddCard.node.position : this.btnEatCard.node.position);

        if (namePlayer === this.thisPlayer.pname) {
            this.btnEatCard.node.active = false;
            this.btnAddCard.node.active = false;
            this.btnNewCard.node.active = false;
            this.btnFaceUp.node.active = false;
            // var posLast = this.thisPlayer.vectorCard.length <= 0 ? cc.Vec2.ZERO : this.thisPlayer.vectorCard[this.thisPlayer.vectorCard.length - 1].node.position;
            if (card.N === CODE_JOKER_BLACK || card.N === CODE_JOKER_RED) {
                card.setJoker(true);
            }

            let pl = this.getPlayer(this.namePlayerEatCardMe);
            if (pl !== null) {
                cc.NGWlog('-=-= Burmeses Poker -=-=-> co thang an tao roi!    ' + card.N);
                let isEat = false;
                for (let oio = 0; oio < pl.vectorCardP1.length; oio++) {
                    if ((card.N === pl.vectorCardP1[oio].N || (card.isJoker && pl.vectorCardP1[oio].isJoker)) && (pl.vectorCardP1[oio].getIsFire() === false)) {
                        card.setIsLockCard(true, this.spriteFrameLock);
                        isEat = true;
                        break;
                    }
                }
                if (isEat === false) {
                    cc.NGWlog("-=-= Burmeses Poker -=-=->   Tim them lan nua!!!");
                    for (let ijk = 0; ijk < this.vtCardDeclare.length; ijk++) {
                        for (let jk = 0; jk < this.vtCardDeclare[ijk].length; jk++) {
                            if ((card.N === this.vtCardDeclare[ijk][jk].N || (card.isJoker && this.vtCardDeclare[ijk][jk].isJoker)) /*&& this.vtCardDeclare[ijk][jk].getIsLockCard()*/) {
                                if (this.vtCardDeclare[ijk][jk].getIsLockCard()) {
                                    isEat = true;
                                    card.setIsLockCard(true, this.spriteFrameLock);
                                    break;
                                }
                            }
                        }
                        if (isEat) break;
                    }
                }
                if (isEat === false) {
                    cc.NGWlog("-=-= Burmeses Poker -=-=->   Khong co a oi!!!");
                }
            }

            player.vectorCard.push(card);
            let indexI = this.vtCardDeclare.length;
            if (indexI > 0) {
                this.vtCardDeclare[indexI - 1].push(card);
            } else {
                this.vtCardDeclare.push([card]);
            }

            this.lbMoneyDrop.string = GameManager.getInstance().formatMoney(40 * this.agTable);// -> setString(StringUtil:: formatMoneyNumber(40 * agTable).c_str());
            this.sortViewCard(true, () => {
                this.showEffectGroup2();
                this.checkShowButton();

                // if (!isBoc)
                //     card.setIsEat(true, this.spriteFrameEat);
            }, card);
            if (!isBoc)
                card.setIsEat(true, this.spriteFrameEat);

            if (!isBoc) this.countCardEat++;
        } else {//ko p mh
            if (!isBoc) {
                var si = player.vectorCardP1.length;
                var rate = 1;
                player.vectorCardP1.push(card);
                if (player._playerView.node.x > 0) {
                    rate = -1;
                }
                var posTo = player._playerView.node.position;
                posTo.x += rate * (player._playerView.imgAvatar.node.width * .5 + card.getContentSize().width * .15) + rate * si * (card.getContentSize().width * .15 + 2);

                card.node.zIndex = GAME_ZORDER.Z_CARD + 5 + rate * si;
                card.node.setScale(.4);
                card.node.runAction(cc.moveTo(.2, posTo));

                if (this.turnNameFire === this.thisPlayer.pname) {
                    this.namePlayerEatCardMe = namePlayer;
                    for (var ijk = 0; ijk < this.vtCardDeclare.length; ijk++) {
                        for (var jk = 0; jk < this.vtCardDeclare[ijk].length; jk++) {
                            if (card.N === this.vtCardDeclare[ijk][jk].N || (card.isJoker && this.vtCardDeclare[ijk][jk].isJoker)) {
                                cc.NGWlog("-=-= Burmeses Poker -=-=-> Bị ăn card %d, bộ bài có con %d nên bị khoá!", card.N,card.N);
                                this.vtCardDeclare[ijk][jk].setIsLockCard(true, this.spriteFrameLock);
                            } else {
                                cc.NGWlog("-=-= Burmeses Poker -=-=-> Bị ăn card này nhưng bộ bài k có! " + card.N);
                            }
                        }
                    }
                }
            } else {
                card.zIndex = GAME_ZORDER.Z_CARD;
                card.node.runAction(cc.sequence(cc.moveTo(0.2, player._playerView.node.position), cc.delayTime(.1), cc.removeSelf()));
            }
        }
    },
    upbai(name, turnName, totalAG, agBet, time) {
        this.turnName = turnName;
        var player = this.getPlayer(name);
        if (player !== null) {
            player.isFold = true;
            player._playerView.setDark(true);
            player.setTurn(false);
            if (player === this.thisPlayer) {
                this.setVisibleButton();

                this.btnDrop.node.active = false;

                this.btnEatCard.node.active = false;
                this.btnAddCard.node.active = false;
                this.btnNewCard.node.active = false;
                this.btnFaceUp.node.active = false;

                GameManager.getInstance().user.ag = totalAG;
                cc.NGWlog('-----------------UP BAI');
                player.clearAllCard();
                this.vtCardDeclare = [];
                //                 for (auto gp : vtBoxGroups)
                // gp -> setVisible(false);
                for (var i = 0; i < this.vtBoxGroups.length; i++) {
                    this.vtBoxGroups[i].node.active = false;
                }
                this.isMyDeclare = false;

                this.thisPlayer._playerView.setScore(-1);
                // SoundManager:: playSFX(ResDefine:: sound_remove.c_str());
                this.stateGame = STATE_GAME.WAITING;
            }

            this.flyChip(player, agBet);
            player.ag = totalAG;
            player.updateMoney();
        }

        this.showWaittingInfo("");
        if (name === turnName)
            this.onTurn(nullptr, time);
    },
    showMsgDeclare(name) {
        this.setTurn(name);
        if (name === GameManager.getInstance().user.uname) {
            this.setVisibleButton();

            this.isMyDeclare = true;
            this.timeDeclare = 15;
            this.showButtonDeclare();
        } else {
            // if (name.length() > 12) {
            // name = name.substr(0, 10) + "..";
            // }

            this.setVisibleButton();
            this.btnEatCard.node.active = false;
            this.btnAddCard.node.active = false;
            this.btnNewCard.node.active = false;
            this.btnFaceUp.node.active = false;
            this.btnDrop.node.active = false;

            this.showWaittingInfo(cc.js.formatStr(GameManager.getInstance().getTextConfig("rummy_player_declare"), name), 20);
        }
    },
    showDeclare(pname, score) {
        let player = this.getPlayer(pname);
        if (player === null) return;

        cc.NGWlog('-------------->  showDeclare    ' + pname + "   Score:   " + score);
        this.isDeclare = true;
        //    btnDrop->setVisible(false);
        // if (pname === this.thisPlayer.pname) {

        if (pname === GameManager.getInstance().user.uname) {
            this.setVisibleButton();

            // this.setVisibleButton();
            // this.btnEatCard.node.active = false;
            // this.btnAddCard.node.active = false;
            // this.btnNewCard.node.active = false;
            // this.btnFaceUp.node.active = false;
            // this.btnDrop.node.active = false;

            this.isDeclareNotTouchCard = true;
        } else {

        }

        player._playerView.setDeclare(score);
    },
    winner(namep) {
        var player = this.getPlayer(namep);
        //    if(!player) return;
        this.setVisibleButton();

        if (namep === this.thisPlayer.pname) {
            this.isDeclareNotTouchCard = true;
            this.lbDeclare.node.stopAllActions();
            // SoundManager:: playSFX(ResDefine:: sound_finished.c_str());

            this.thisPlayer._playerView.setScore(-1);
        } else {
            this.isDeclare = true;
            this.isMyDeclare = true;
            this.showButtonDeclare();
        }

        if (player) {
            player.setTurn(false);
            this.anim_win.node.zIndex = GAME_ZORDER.Z_MENU_VIEW;
            this.anim_win.node.active = true;
            this.anim_win.node.setPosition(cc.v2(player._playerView.node.x, player._playerView.node.y));
            this.anim_win.setAnimation(0, "animation", true);
        }
        this.spGroupNoc.active = false;
        for (var i = 0; i < this.vtCardDanh.length; i++) {
            this.vtCardDanh[i].node.destroy();
        }
        this.vtCardDanh = [];
        this.sortViewCard(true, () => {
            this.showEffectGroup2();
        });
    },
    finishGame(strData) {//hhhh
        // if (require('GameManager').getInstance().user.vip == 0) {
        //     if (this.stateGame === STATE_GAME.PLAYING) {
        //         var count_played = Math.round(cc.sys.localStorage.getItem('count_game_played'), 0) + 1;
        //         cc.NGWlog("count played: " + count_played);
        //         cc.sys.localStorage.setItem('count_game_played', count_played);

        //         if (require('GameManager').getInstance().count_game_played > 1) {
        //             require('NetworkManager').getInstance().sendUpVip();
        //         }
        //     }
        // }

        this.isWaitDone = false;

        this.node.runAction(cc.sequence(cc.delayTime(.75), cc.callFunc(() => {
            this.showWaittingInfo("");
            this.setVisibleButton();
            this.btnEatCard.node.active = false;
            this.btnAddCard.node.active = false;
            this.btnNewCard.node.active = false;
            this.btnFaceUp.node.active = false;
            this.btnDrop.node.active = false;


            var data = JSON.parse(strData);
            this.vtPlayerWin = [];

            for (var i = 0; i < data.length; i++) {
                var pname = data[i].N;
                var ag = data[i].AG;
                var score = data[i].diem;
                var money = data[i].M;

                cc.NGWlog('====name====' + pname);
                var playerData = {
                    name: "PlayerData"
                };
                playerData.pname = pname;
                playerData.money = money;
                playerData.total_money = ag;
                playerData.score = score;
                playerData.state = money > 0 ? 1 : -1;//money > 0 ? GameManager.getInstance().getTextConfig("txt_win") : GameManager.getInstance().getTextConfig("txt_lost");
                playerData.vtCard = data[i].arrCard;

                if (pname === require('GameManager').getInstance().user.uname) {
                    this.vtPlayerWin.splice(0, 0, playerData);
                    require('GameManager').getInstance().user.ag = ag;
                } else {
                    this.vtPlayerWin.push(playerData);
                }

                var player = this.getPlayer(pname);
                if (!player) continue;

                if (player.isFold) playerData.state = 0;//GameManager.getInstance().getTextConfig("rummy_drop");
            }

            this.resultMoney();
        }, this)));
    },
    showWaittingInfo(msg, time = 0) {
        let timeOther = time;
        if (msg === '') {
            this.lbWait.node.stopAllActions();
            this.lbWait.node.getParent().active = false;
            timeOther = 0;
            return;
        } else {
            this.lbWait.string = timeOther <= 0 ? msg : cc.js.formatStr('%s (%d)', msg, timeOther);
            this.lbWait.node.getParent().active = true;
            this.lbWait.node.getParent().zIndex = 9999;

            this.lbWait.node.stopAllActions();
            this.lbWait.node.setPosition(0, 0);

            this.lbWait.node.runAction(cc.repeat(
                cc.sequence(cc.moveBy(.25, cc.v2(0, 5)), cc.moveBy(0.5, cc.v2(0, -10)), cc.moveBy(.25, cc.v2(0, 5)), cc.callFunc(() => {
                    timeOther--;
                    this.lbWait.string = timeOther <= 0 ? msg : cc.js.formatStr('%s (%d)', msg, timeOther);
                    if (timeOther <= 0) {
                        this.lbWait.node.stopAllActions();
                        this.lbWait.node.getParent().active = false;
                    }
                })),timeOther + 1)
            );

            // this.lbWait.node.runAction(cc.repeat(cc.spawn(
            //     cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            //         timeOther--;
            //         this.lbWait.string = timeOther <= 0 ? msg : cc.js.formatStr('%s (%d)', msg, timeOther);
            //         if (timeOther <= 0) {
            //             this.lbWait.node.stopAllActions();
            //             this.lbWait.node.getParent().active = false;
            //         }
            //     })),
            //     cc.sequence(cc.moveBy(.5, cc.v2(0, 5)), cc.moveBy(1.0, cc.v2(0, -10)), cc.moveBy(.5, cc.v2(0, 5)))
            // ), timeOther));
        }
    },

    onTurn(aFunc = null, time = 20) {
        this.btnEatCard.node.active = false;
        this.btnAddCard.node.active = false;
        this.btnNewCard.node.active = false;
        this.btnFaceUp.node.active = false;
        this.btnDrop.node.active = false;

        if (this.turnName === '') return;

        this.setTurn(this.turnName);

        if (this.turnName === GameManager.getInstance().user.uname) {
            if (this.thisPlayer.vectorCard.length > 0 && this.thisArrayCard.length > 0) {
                if (((this.thisPlayer.vectorCard[0].code <= 0 || this.thisPlayer.vectorCard[0].code > 52)
                    && this.thisPlayer.vectorCard[0].code != CODE_JOKER_BLACK
                    && this.thisPlayer.vectorCard[0].code != CODE_JOKER_RED)
                    && ((this.thisArrayCard[0] <= 0 || this.thisArrayCard[0] > 52)
                        && this.thisArrayCard[0] != CODE_JOKER_BLACK
                        && this.thisArrayCard[0] != CODE_JOKER_RED)) {
                    for (var i = 0; i < this.thisPlayer.vectorCard.length && i < this.thisArrayCard.length; i++) {
                        this.thisPlayer.vectorCard[i].setTextureWithCode(thisArrayCard[i]);
                    }
                    this.sortCardStart();
                }
            }

            for (var i = 0; i < this.vtCardDeclare.length; i++) {
                for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                    this.vtCardDeclare[i][j].countTurn++;
                }
            }

            if (this.thisPlayer.isFold === false && this.isMyDeclare === false) {//son
                this.btnEatCard.node.active = true;
                this.btnAddCard.node.active = true;
                if (this.thisPlayer.vectorCard.length <= 13) {
                    this.btnNewCard.node.active = true;
                    this.btnFaceUp.node.active = true;
                }
                if (this.vtCardDanh.length <= 0) {
                    this.btnFaceUp.node.active = false;
                }

                this.btnDrop.node.active = true;
            }

            if (this.bkgResult.active) {
                this.bkgResult.active = false;
            }
        }
    },
    onDeclareMsgThisPlayer(namePlayer, turnName) {
        this.setVisibleButton();
        this.btnEatCard.node.active = false;
        this.btnAddCard.node.active = false;
        this.btnNewCard.node.active = false;
        this.btnFaceUp.node.active = false;
        this.btnDrop.node.active = false;

        if (turnName === '') {
            if (namePlayer === GameManager.getInstance().user.uname) {
                GameManager.getInstance().onShowWarningDialogHasDelayTime(GameManager.getInstance().getTextConfig('msg_warning_declare'), DIALOG_TYPE.TWO_BTN,
                    GameManager.getInstance().getTextConfig('rummy_declare'), () => {
                        require('NetworkManager').getInstance().sendFinish_Rummy(-1);
                    }, GameManager.getInstance().getTextConfig('label_cancel'), () => {
                        require('NetworkManager').getInstance().sendCancelDeclare_Rummy();
                    });

            } else {
                // CCLOG("=====> CO thang dang DECLARE");
            }
        } else {
            // CCLOG("=====> onDeclareMsgThisPlayer Turn name:  %s", turnName.c_str());
            this.turnName = turnName;
            this.onTurn();
        }
    },

    danhBai1(namePlayer, idCard, index, isLast) {
        var player = this.getPlayer(namePlayer);
        if (player !== null) {
            var posCard = this.btnEatCard.node.position;
            var siD = this.vtCardDanh.length;
            if (player === this.thisPlayer) {
                var card = null;
                for (var i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                    if (idCard === this.thisPlayer.vectorCard[i].code) {
                        card = this.thisPlayer.vectorCard[i];
                        if (this.thisPlayer.vectorCard[i].tag === TAG_BAI_DANH) {
                            break;
                        }
                    }
                }
                if (card !== null) {
                    card.isTouch = false;
                    card.setIsLockCard(false, this.spriteFrameLock);
                    card.setIsEat(false, this.spriteFrameEat);

                    var isBreak = false;
                    for (var i = 0; i < this.vtCardDeclare.length; i++) {
                        for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                            if (card === this.vtCardDeclare[i][j]) {
                                // this.vtCardDeclare.at(i).eraseObject(card);
                                this.vtCardDeclare[i].splice(j, 1);
                                card.tag = 0;
                                isBreak = true;
                                break;
                            }
                        }
                        if (this.vtCardDeclare[i].length <= 0) {
                            // vtCardDeclare.erase(vtCardDeclare.begin() + i);
                            this.vtCardDeclare.splice(i, 1);
                            break;
                        }
                        if (isBreak) break;
                    }

                    // this.thisPlayer.vectorCard.eraseObject(card);
                    this.thisPlayer.vectorCard.splice(this.thisPlayer.vectorCard.indexOf(card), 1);
                    this.vtCardDanh.push(card);

                    card.node.zIndex = GAME_ZORDER.Z_CARD + siD;
                    card.setTextureWithCode(idCard);
                    if (card.N === CODE_JOKER_BLACK || card.N === CODE_JOKER_RED) {
                        card.setJoker(true);
                    }
                    //             // SoundManager:: playSFX(ResDefine:: sound_card_flip_1.c_str());//son thu

                    card.node.runAction(cc.sequence(
                        cc.callFunc(() => {
                            if (isLast) {
                                this.sortViewCard(true, () => {
                                    this.showEffectGroup(0);
                                });
                            }
                        }),
                        cc.delayTime(index * .4),
                        cc.spawn(cc.moveTo(0.2, posCard), cc.scaleTo(.2, SCALE_CARD)),
                        cc.sequence(cc.scaleTo(.1, SCALE_CARD + .2), cc.scaleTo(.1, SCALE_CARD), cc.callFunc(() => {
                            card.node.setPosition(posCard);
                        }))));
                } else {
                    card = this.getCard();
                    this.node.addChild(card.node, GAME_ZORDER.Z_CARD + siD);
                    card.setTextureWithCode(idCard);
                    if (card.N === CODE_JOKER_BLACK || card.N === CODE_JOKER_RED) {
                        card.setJoker(true);
                    }
                    card.node.setScale(SCALE_CARD);
                    card.node.setPosition(posCard);
                    this.vtCardDanh.push(card);
                }
                if (isLast) {
                    this.checkShowButton();

                    this.btnEatCard.node.active = false;
                    this.btnAddCard.node.active = false;
                    this.btnNewCard.node.active = false;
                    this.btnFaceUp.node.active = false;
                }
            } else {
                var card = this.getCard();
                this.node.addChild(card.node, GAME_ZORDER.Z_CARD + siD);
                card.setTextureWithCode(idCard);
                if (card.N === CODE_JOKER_BLACK || card.N === CODE_JOKER_RED) {
                    card.setJoker(true);
                }
                card.node.setPosition(player._playerView.node.position);
                this.vtCardDanh.push(card);

                card.node.runAction(cc.sequence(cc.delayTime(index * .4), cc.spawn(cc.moveTo(0.2, posCard), cc.scaleTo(.2, SCALE_CARD)), cc.sequence(cc.scaleTo(.1, SCALE_CARD + .2), cc.scaleTo(.1, SCALE_CARD))));

                if (namePlayer === this.namePlayerEatCardMe && isLast === true) {
                    for (var ijk = 0; ijk < this.vtCardDeclare.length; ijk++) {
                        for (var jk = 0; jk < this.vtCardDeclare[ijk].length; jk++) {
                            if (card.N === this.vtCardDeclare[ijk][jk].N) {
                                this.vtCardDeclare[ijk][jk].setIsLockCard(false, this.spriteFrameLock);
                            }
                        }
                    }
                    for (var ijk = 0; ijk < player.vectorCardP1.length; ijk++) {
                        if (card.N === player.vectorCardP1[ijk].N) {
                            player.vectorCardP1[ijk].setIsFire(true);
                        }
                    }
                }
            }
            if (isLast) {
                player.setTurn(false);
            }
        }
    },

    onClickDanhBai(event, data) {
        var listTemp = [];
        var listCards = [];

        for (var i = 0; i < this.vtCardDeclare.length; i++) {
            var tmp = [];
            for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                var c = this.vtCardDeclare[i][j];
                if (c.isSelect) {
                    c.tag = TAG_BAI_DANH;
                    listCards.push(c);
                } else {
                    tmp.push(c);
                }
            }
            if (tmp.length > 0) {
                listTemp.push(tmp);
            }
        }
        cc.NGWlog(listCards);
        if (listCards.length <= 0) {
            cc.NGWlog("Chưa chọn bài mà má!");
        } else if (listCards.length > 2) {
            cc.NGWlog("Chỉ được đánh tối đa 2 con thôi má!");
        } else {
            if (listCards.length == 2) {
                if ((listCards[0].getIsEat() && listCards[0].countTurn === 0) || (listCards[1].getIsEat() && listCards[1].countTurn === 0)) {
                    // GameManager.getInstance().onShowToast(GameManager.getInstance().getTextConfig("msg_warning_card_eat"));
                    GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig("msg_warning_card_eat"));
                } else {
                    if (listCards[0].code == listCards[1].code) {
                        require('NetworkManager').getInstance().sendDanhBai_Rummy([listCards[0].code, listCards[1].code]);
                    } else {
                        //chi dc danh 2 con trung nhau
                        // GameManager.getInstance().onShowToast(GameManager.getInstance().getTextConfig("msg_warning_card_sample"));
                        GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig("msg_warning_card_sample"));

                    }
                }
            } else if (listCards.length == 1) {
                if (listCards[0].getIsEat() && listCards[0].countTurn === 0) {
                    // GameManager.getInstance().onShowToast(GameManager.getInstance().getTextConfig("msg_warning_card_eat"));

                    GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig("msg_warning_card_eat"));
                } else {
                    var score = require('LogicManager').checkListGetScore(listTemp, 5 - this.players.length);
                    if (BurmesePokerView.isInvalid && score === 0) {
                        GameManager.getInstance().onShowWarningDialog(GameManager.getInstance().getTextConfig("msg_warning_discard"), DIALOG_TYPE.TWO_BTN
                            , GameManager.getInstance().getTextConfig("ok"), () => {
                                require('NetworkManager').getInstance().sendDanhBai_Rummy([listCards[0].code]);
                            }
                            , GameManager.getInstance().getTextConfig("huy"));
                    } else {
                        require('NetworkManager').getInstance().sendDanhBai_Rummy([listCards[0].code]);
                    }
                }
            }
        }
    },
    onClickBocBai(event, data) {
        require('NetworkManager').getInstance().sendBocBai();
    },
    onClickAnBai(event, data) {
        if (this.vtCardDanh.length <= 0) return;

        if (this.countCardEat >= 3) {
            // GameManager.getInstance().onShowToast(GameManager.getInstance().getTextConfig("msg_warning_card_eat_count_3"));
            GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig("msg_warning_card_eat_count_3"));
            return;
        }
        require('NetworkManager').getInstance().sendAnBai_TaLa(this.vtCardDanh[this.vtCardDanh.length - 1].code);
    },
    onClickGroupCard(event, data) {
        if (this.thisPlayer.isFold || this.isDeclareNotTouchCard) return;

        this.btnGroup.node.active = false;
        var vtCardGroup = [];
        for (let k = 0; k < this.vtCardDeclare.length; k++) {
            for (let j = 0; j < this.vtCardDeclare[k].length; j++) {
                let ca = this.vtCardDeclare[k][j];
                if (ca.isSelect) {
                    // ca.tag = 0;
                    // cc.NGWlog('---------->   ' + ca.N);
                    vtCardGroup.push(ca);
                    this.vtCardDeclare[k].splice(j, 1);
                    j--;
                }
            }

            if (this.vtCardDeclare[k].length <= 0) {
                this.vtCardDeclare.splice(k, 1);
                k--;
            }
        }
        this.vtCardDeclare.splice(0, 0, vtCardGroup);
        this.sortViewCard(true, () => {
            this.showEffectGroup2();
        });
    },
    onClickFinish(event, data) {
        var cards = [];
        for (var i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            if (this.thisPlayer.vectorCard[i].isSelect) {
                this.thisPlayer.vectorCard[i].tag = TAG_BAI_DANH;
                cards.push(this.thisPlayer.vectorCard[i].code);
            }
        }

        if (cards.length <= 0) {
            CCLOG("Chưa chọn bài mà má!");
        } else if (cards.length > 1) {
            CCLOG("Chỉ được đánh 1 con thôi má!");
        } else {
            require('NetworkManager').getInstance().sendFinish_Rummy(cards[0]);
        }
    },
    onClickDeclare(event, data) {
        var vtDeclare = [];
        for (var i = 0; i < this.vtCardDeclare.length; i++) {
            var c = this.vtCardDeclare[i];
            var vtTemp = [];
            for (var j = 0; j < c.length; j++) {
                vtTemp.push(c[j].code);
            }
            vtDeclare.push(vtTemp);
        }

        require('NetworkManager').getInstance().sendDeclare_Rummy(vtDeclare);

        this.lbDeclare.node.stopAllActions();
        this.timeDeclare = 15;
    },
    onClickAddGroup(event, data) {
        var index = parseInt(data);
        if (this.thisPlayer.isFold || this.isDeclareNotTouchCard) return;
        if (index < 0 || index > this.vtCardDeclare.length - 1) return;
        var si = this.vtCardDeclare[index].length;
        if (si <= 0) return;
        this.hideBtnAddInGroup();
        var vtGroup = [];

        for (var i = 0; i < this.thisPlayer.vectorCard.length; i++) {
            if (this.thisPlayer.vectorCard[i].isSelect) {
                vtGroup.push(this.thisPlayer.vectorCard[i]);
                // this.thisPlayer.vectorCard.eraseObject(thisPlayer -> vectorCard.at(i));

                this.thisPlayer.vectorCard.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < vtGroup.length; i++) {
            for (var k = 0; k < this.vtCardDeclare.length; k++) {
                for (var j = 0; j < this.vtCardDeclare[k].length; j++) {
                    if (vtGroup[i] === this.vtCardDeclare[k][j]) {
                        // vtCardDeclare[k].eraseObject(vtGroup[i]);
                        this.vtCardDeclare[k].splice(j, 1);
                        j--;
                    }
                }
            }
        }
        si = this.vtCardDeclare[index].length;

        var indexThis = si > 0 ? this.thisPlayer.vectorCard.indexOf(this.vtCardDeclare[index][si - 1]) : 0;
        if (indexThis < 0) {
            indexThis = si - 1;
        }

        for (var i = 0; i < vtGroup.length; i++) {
            this.thisPlayer.vectorCard.splice(indexThis + i, 0, vtGroup[i]);//insert
            this.vtCardDeclare[index].push(vtGroup[i]);
        }

        for (var k = 0; k < this.vtCardDeclare.length; k++) {
            if (this.vtCardDeclare[k].length <= 0) {
                this.vtCardDeclare.splice(k, 1);
                k--;
            }
        }
        this.btnGroup.node.active = false;
        this.isOne = true;
        this.sortViewCard(true, () => {
            this.showEffectGroup2();
        });
    },

    onClickDrop(event, data) {
        require('NetworkManager').getInstance().sendFold();
    },

    onClickHistory(event, data) {
        this.bkgResult.zIndex = GAME_ZORDER.Z_MENU_VIEW;
        this.bkgResult.stopAllActions();
        this.bkgResult.active = true;
        this.bkgResult.setScale(0);
        this.bkgResult.runAction(cc.sequence(cc.scaleTo(.2, 1.0).easing(cc.easeBackOut()), cc.delayTime(2.0), cc.callFunc(() => {
            this.bkgResult.runAction(cc.sequence(cc.scaleTo(.2, 0, 0).easing(cc.easeBackIn()), cc.callFunc(() => {
                this.bkgResult.active = false;
            })));
        })));
    },
    onClickCloseHistory(event, data) {
        this.bkgResult.stopAllActions();
        this.bkgResult.runAction(cc.sequence(cc.scaleTo(.2, 0, 0).easing(cc.easeBackIn()), cc.callFunc(() => {
            this.bkgResult.active = false;
        })));
    },
    setDealer(name) {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            p.setDealer(false, false);

        }
        var playerD = this.getPlayer(name);
        if (playerD !== null) {
            playerD.setDealer(true, this.players.indexOf(playerD) <= 2);
        }
    },

    resetGame() {
        this.node.stopAllActions();
        this.clearAllCard();
        this.showWaittingInfo("");
        this.setVisibleButton();
        for (let i = 0; i < this.vtBoxGroups.length; i++) {
            this.vtBoxGroups[i].node.active = false;
        }

        this.thisArrayCard = [];

        if (this.thisPlayer)
            if (this.thisPlayer._playerView)
                this.thisPlayer._playerView.setScore(-1);

        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].isFold) {
                this.players[i].isFold = false;
                this.players[i]._playerView.setDark(false);
            }
        };
        
        this.spGroupNoc.active = false;

        this.anim_win.node.active = false;

        cc.NGWlog('---------Do dai cua cai ay:    ' + this.vtCardDanh.length);
        for (let j = 0; j < this.vtCardDanh.length; j++) {
            this.vtCardDanh[j].node.destroy();
        }

        this.vtCardDanh = [];
        this.vtCardDeclare = [];

        this.isDeclareNotTouchCard = false;

        this.isDeclare = false;
        this.isMyDeclare = false;
        this.numCardSelect = 0;
        BurmesePokerView.isInvalid = false;

        this.btnEatCard.node.active = false;
        this.btnAddCard.node.active = false;
        this.btnNewCard.node.active = false;
        this.btnFaceUp.node.active = false;
        this.btnDrop.node.active = false;

        this.lbDeclare.node.stopAllActions();
        this.timeDeclare = 15;
        this.namePlayerEatCardMe = "";
        this.turnName = "";
        this.turnNameFire = "";
        this.countCardEat = 0;
    },

    setVisibleButton() {
        this.btnFinish.node.active = false;
        this.btnDeclare.node.active = false;
        // this.lbDeclare.node.active = false;
        this.btnDiscard.node.active = false;
        this.btnGroup.node.active = false;
    },
    sortViewCard(isMove = true, funcCallBack = null, cardAction = null) {
        if (this.vtCardDeclare.length <= 0) return;
        this.numCardSelect = 0;

        var siz = this.thisPlayer.vectorCard.length;
        var index = 0;

        for (var i = 0; i < this.vtCardDeclare.length; i++) {
            // cc.NGWlog(i + "    " + JSON.stringify(this.vtCardDeclare[i]));
            for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                var card = this.vtCardDeclare[i][j];

                card.node.zIndex = GAME_ZORDER.Z_CARD + index;
                card.isSelect = false;
                //card.isTouch = true;//tren dt thi cmt lai
                card.node.opacity = 255;
                if (card !== cardAction)
                    card.node.stopAllActions();

                var posX = this.POS_CARD_X + (index - parseInt(siz / 2)) * card.getContentSize().width * .5 * SCALE_CARD;

                if (isMove) {
                    // if (i >= this.vtCardDeclare.length - 1 && j >= this.vtCardDeclare[i].length - 1) {
                    //     card.node.runAction(cc.sequence(cc.delayTime(i * 0.05), cc.moveTo(.2, cc.v2(posX, this.POS_CARD_Y)), cc.callFunc(() => {
                    //         card.isTouch = true;
                    //     })));
                    // } else {
                        card.node.runAction(cc.sequence(cc.delayTime(i * 0.05), cc.moveTo(.2, cc.v2(posX, this.POS_CARD_Y)), cc.callFunc(() => {
                            card.isTouch = true;
                            if (funcCallBack !== null) {
                                funcCallBack.call();
                            }
                        })));
                    //}
                } else {
                    card.node.position = cc.v2(posX, this.POS_CARD_Y);
                    card.isTouch = true;
                    if (i >= this.vtCardDeclare.length - 1 && j >= this.vtCardDeclare[i].length - 1) {
                        if (funcCallBack !== null)
                            funcCallBack.call();
                    }
                }
                index++;
            }
        }

        // cc.NGWlog('-------------------SORT');
        // cc.NGWlog(this.vtCardDeclare);
        this.numCardSelect = 0;
        this.hideBtnAddInGroup();

        this.btnFinish.node.active = false;
        this.btnDiscard.node.active = false;
        this.btnGroup.node.active = false;
    },
    sortCardStart(timeDelay = .5) {
        if (this.thisPlayer === null) return;
        let _that = this;
        this.node.runAction(cc.sequence(cc.delayTime(timeDelay), cc.callFunc(() => {
            _that.sortCardStart2();
        })));
    },

    sortCardStart2() {
        cc.NGWlog('----------> sortCardStart2');
        if (this.thisPlayer === null) return;

        var siz = this.thisPlayer.vectorCard.length;
        cc.NGWlog('----------> sortCardStart2  !null  ' + siz);
        if (siz <= 0) return;
        var i = 0;

        this.thisPlayer.vectorCard.sort((x, y) => {
            // if (x.S > y.S) {
            //     return true;
            // } else {
            //     return false;
            // }
            return x.S - y.S;
        });

        var s = this.thisPlayer.vectorCard[0].S;
        var vtTemp = [];
        var vtTemp2 = [];
        vtTemp.push(this.thisPlayer.vectorCard[0]);
        for (i = 1; i < siz; i++) {
            if (s === this.thisPlayer.vectorCard[i].S) {
                vtTemp.push(this.thisPlayer.vectorCard[i]);
                if (i >= siz - 1) {
                    vtTemp.sort(ComparisionTalaForN);
                    vtTemp2.push(vtTemp);
                }
            } else {
                vtTemp.sort(ComparisionTalaForN);
                vtTemp2.push(vtTemp);
                vtTemp = [];
                vtTemp.push(this.thisPlayer.vectorCard[i]);

                s = this.thisPlayer.vectorCard[i].S;
                if (i >= siz - 1) {
                    vtTemp.sort(ComparisionTalaForN);
                    vtTemp2.push(vtTemp);
                }
            }
        }

        if (vtTemp2.length >= 3) {
            var te = vtTemp2[1];
            vtTemp2[1] = vtTemp2[2];
            vtTemp2[2] = te;
        }

        this.vtCardDeclare = vtTemp2;

        this.sortViewCard(false);
        this.showEffectGroup(.4);
    },

    showEffectGroup(timeDelay) {
        this.node.runAction(cc.sequence(cc.delayTime(timeDelay), cc.callFunc(() => {
            this.showEffectGroup2();
        })));
    },
    showEffectGroup2() {
        if (this.thisPlayer === null || this.thisPlayer.vectorCard.length <= 0) return;

        let score = require('LogicManager').checkListGetScore(this.vtCardDeclare, 5 - this.players.length);
        this.thisPlayer._playerView.setScore(score);
        let siEffect = this.vtBoxGroups.length;
        let siGroup = this.vtCardDeclare.length;

        if (siEffect < siGroup) {
            for (let i = 0; i < siGroup - siEffect; i++) {
                let box = cc.instantiate(this.boxGroupPrefab).getComponent('BoxGroup');
                this.node.addChild(box.node, GAME_ZORDER.Z_CARD + 20);
                this.vtBoxGroups.push(box);
            }
        }

        for (let i = 0; i < this.vtBoxGroups.length; i++) {
            this.vtBoxGroups[i].node.active = false;
        }

        let siC = this.thisPlayer.vectorCard[0].getContentSize().width * SCALE_CARD;
        let siW = siC * .5;
        for (let i = 0; i < siGroup; i++) {
            let vtTemp = this.vtCardDeclare[i];
            // if (i === 0) {
            //     cc.NGWlog('***************************00');
            //     cc.NGWlog(vtTemp);

            // }
            var siT = vtTemp.length;
            if (siT <= 0) continue;


            var sp = this.vtBoxGroups[i];
            sp.setVectorCard(vtTemp);
            sp.setInfoTypeCard(vtTemp, BurmesePokerView.isInvalid);
            // if (i === 0)
            sp.node.active = true;
            sp.indexGroup = i;

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'BurmesePokerView';//This is the code file name
            clickEventHandler.handler = "onClickAddGroup";
            clickEventHandler.customEventData = '' + sp.indexGroup;
            sp.btnAdd.clickEvents = [];
            sp.btnAdd.clickEvents.push(clickEventHandler);

            var isCuoi = (i >= siGroup - 1);
            if (isCuoi) {
                sp.setBkgContentSize(cc.size((siT - 1) * siW + siC + 2, 34));
            } else {
                sp.setBkgContentSize(cc.size(siT * siW + 2, 34));
            }
            var ide = parseInt(siT / 2);
            var px = 0;

            for (var j = 0; j < siT; j++) {
                px += vtTemp[j].node.x;
            }

            px /= (1.0 * siT);
            px = px - (isCuoi ? 0 : siW / 2);

            sp.node.setPosition(cc.v2(px, sp.getBkgContentSize().height * .5 - this.sizeWin.height / 2));
        }
    },
    checkShowButton() {
        this.setVisibleButton();
        // if (this.thisPlayer.isFold) return;// || this.stateGame === STATE_GAME.VIEWING) return;

        this.hideBtnAddInGroup();
        if (this.numCardSelect >= 1) {
            this.vtBoxGroups.forEach((gp) => {
                gp.setVisibleButtonAdd(true);
            });
        }
        if (this.isMyDeclare) {
            this.timeDeclare = 15;
            this.showButtonDeclare();
            if (this.numCardSelect >= 2) {
                this.btnGroup.node.active = true;
            }
            return;
        }
        var siz = this.thisPlayer.vectorCard.length;
        if (siz <= 13) {//den luot mh hay ko ko quan trong, theo so quan bai tren tay.
            if (this.numCardSelect >= 2) {
                this.btnGroup.node.active = true;
            }
        } else {
            this.btnDrop.node.active = false;
            this.setVisibleButton();
            if (this.numCardSelect === 1) {
                this.btnFinish.node.active = true;
                this.btnDiscard.node.active = true;
            } else if (this.numCardSelect >= 2) {
                this.btnGroup.node.active = true;
                cc.NGWlog('-=-=-=-=-=-=-=-=-=:numCardSelect 0    ' + this.numCardSelect);
                if (this.numCardSelect === 2) {
                    cc.NGWlog('-=-=-=-=-=-=-=-=-=:numCardSelect 1    ');
                    let ca = null;
                    let isBe = false;

                    for (var i = 0; i < this.vtCardDeclare.length; i++) {
                        for (var j = 0; j < this.vtCardDeclare[i].length; j++) {
                            if (this.vtCardDeclare[i][j].isSelect) {
                                if (ca === null) {
                                    ca = this.vtCardDeclare[i][j];
                                    cc.NGWlog()
                                } else {
                                    if (ca.code === this.vtCardDeclare[i][j].code) {
                                        isBe = true;
                                        this.btnDiscard.node.active = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (isBe)
                            break;
                    }
                }
            }
        }
    },
    initScoreBoard() {
        for (let i = 0; i < this.listItemResult.length; i++) {
            if (i < this.vtPlayerWin.length) {
                this.listItemResult[i].node.active = true;
                var pl = this.getPlayer(this.vtPlayerWin[i].pname);
                if (pl != null) {
                    this.listItemResult[i].setInfo(pl._playerView.imgAvatar, this.vtPlayerWin[i].pname, this.vtPlayerWin[i].vtCard, this.vtPlayerWin[i].score, this.vtPlayerWin[i].money, this.vtPlayerWin[i].state);
                } else {
                    this.listItemResult[i].setInfo(null, this.vtPlayerWin[i].pname, this.vtPlayerWin[i].vtCard, this.vtPlayerWin[i].score, this.vtPlayerWin[i].money, this.vtPlayerWin[i].state);
                }
            } else {
                this.listItemResult[i].node.active = false;
            }
        }
        this.onClickHistory();
    },
    hideBtnAddInGroup() {
        for (var i = 0; i < this.vtBoxGroups.length; i++) {
            this.vtBoxGroups[i].setVisibleButtonAdd(false);
        }
    },

    handleVTable(strData) {
        this._super(strData);
        this.createDataConnect(strData);
    },

    handleRJTable(strData) {
        this._super(strData);
        this.createDataConnect(strData);
    },

    createDataConnect(strData) {
        if (this.isWaitDone) return;
        this.isWaitDone = true;

        this.resetGame();
        var data = JSON.parse(strData);

        var arrCardTakeAble = data.cardTakeAble;
        var idEat = 0;

        if (arrCardTakeAble.length > 0) {
            idEat = arrCardTakeAble[arrCardTakeAble.length - 1];
        }

        if (idEat !== 0) {
            var cEat = this.getCard();
            this.node.addChild(cEat.node, GAME_ZORDER.Z_CARD);
            cEat.setTextureWithCode(idEat);
            cEat.node.setScale(SCALE_CARD);
            cEat.node.setPosition(this.btnEatCard.node.position);
            this.vtCardDanh.push(cEat);
        }

        this.turnName = data.CN;
        var isNotiDeclared = data.isNotiDeclared;
        this.numCardNoc = data.sizeNoc;

        // cc.NGWlog('--------->   numCardNoc: ' + this.numCardNoc);
        if (this.numCardNoc > 0) {
            this.spGroupNoc.active = true;
        } else {
            this.spGroupNoc.active = false;
        }
        this.setCardNoc();
        this.isMyDeclare = false;
        this.isDeclare = false;

        if (isNotiDeclared) {
            if (this.turnName === this.thisPlayer.pname)
                this.isMyDeclare = true;
            else
                this.isDeclare = true;
        }

        var constrainDiscards = data.constrainDiscards;
        for (var ij = 0; ij < constrainDiscards.length; ij++) {
            // ConstrainDiscards item;
            var item = {
                name: "ConstrainDiscards"
            };

            item.cardID = constrainDiscards[ij].cardId;
            item.idPlayerDiscard = constrainDiscards[ij].playerDiscard;
            item.idPlayerTakecard = constrainDiscards[ij].playerTakecard;
            item.justTakePlace = constrainDiscards[ij].justTakePlace;
            item.required = constrainDiscards[ij].required;

            this.listConstrainDiscards.push(item);
        }

        var arr = data.ArrP;

        for (var i = 0; i < arr.length; i++) {
            var dtPl = arr[i];
            var player = this.getPlayer(dtPl.N);
            if (player === null) continue;
            let isMe = (player.pname === this.thisPlayer.pname);
            let isDeclared = dtPl.isDeclared;
            let score = dtPl.diemThua;
            let isBocBai = dtPl.isBocBai;
            let isFold = !dtPl.A;

            // cc.NGWlog('-------------------Up HAY:   ');
            // cc.NGWlog(dtPl.A);

            if (isFold) {
                player.isFold = true;
                if (isMe) {
                    this.setVisibleButton();

                    this.btnEatCard.node.active = false;
                    this.btnAddCard.node.active = false;
                    this.btnNewCard.node.active = false;
                    this.btnFaceUp.node.active = false;

                    this.isMyDeclare = false;
                }

                let agFold = isBocBai ? this.agTable * 40 : this.agTable * 20;

                this.flyChip(player, agFold);
            }

            // var indexPlayer = this.players.indexOf(player);//this.getIndexOf(player);

            if (isMe) {
                let jCards = dtPl.Arr;//bai tren tay
                let dem = 0;
                let siCard = jCards.length;
                // cc.NGWlog('============== siCard ' + siCard);
                if (siCard > 0) {
                    for (let j = 0; j < siCard; j++) {
                        let vtTemp = [];

                        // cc.NGWlog('============== 2 ' + jCards[j].length);
                        for (let k = 0; k < jCards[j].length; k++) {
                            this.thisArrayCard.push(jCards[j][k]);
                            let card = this.getCard();
                            this.node.addChild(card.node, GAME_ZORDER.Z_CARD + i);
                            card.node.setPosition(this.btnAddCard.node.x, this.btnAddCard.node.y);
                            card.node.setScale(SCALE_CARD);
                            card.setTextureWithCode(jCards[j][k]);
                            // if (isFold) {
                            // card.setDark(true);
                            // }
                            vtTemp.push(card);
                            this.thisPlayer.vectorCard.push(card);
                            dem++;

                            if (j === 0 && k === 0) {
                                this.POS_CARD_Y = card.getContentSize().height * .5 * SCALE_CARD - this.sizeWin.height / 2;
                            }
                        }
                        if (siCard !== 1) {
                            vtTemp.sort(ComparisionTalaForN);
                            this.vtCardDeclare.push(vtTemp);
                        }
                    }
                    // cc.NGWlog('-----------------> siCard ' + siCard);
                    if (siCard === 1) {
                        this.sortCardStart2();
                    } else {
                        this.sortViewCard(false);
                        this.showEffectGroup();
                    }
                }
                this.lbMoneyDrop.string = GameManager.getInstance().formatMoney((isBocBai ? 40 : 20) * this.agTable); //(StringUtil:: formatMoneyNumber((isBocBai ? 40 : 20) * agTable).c_str());
            }

            if (isFold) {
                player._playerView.setDark(true);
                continue;
            }

            if (isNotiDeclared) {
                if (isMe) {
                    this.setVisibleButton();
                    this.btnEatCard.node.active = false;
                    this.btnAddCard.node.active = false;
                    this.btnNewCard.node.active = false;
                    this.btnFaceUp.node.active = false;
                    this.btnDrop.node.active = false;
                }
                if (this.isDeclared) {
                    if (score <= 0) {
                        // anim_win = spine:: SkeletonAnimation:: createWithJsonFile(ResDefine:: anim_win_india_json, ResDefine:: anim_win_india_atlas);
                        // this -> addChild(anim_win, Z_EMO);

                        anim_win.node.active = true;
                        anim_win.node.setPosition(player._playerView.node.position);
                        anim_win.setAnimation(0, "animation", true);
                    } else {
                        player.playerView.setDeclare(score);
                    }
                } else {
                    if (isMe) {
                        this.timeDeclare = 15;
                        this.showButtonDeclare();
                    }
                }
            }
        }

        for (let i = 0; i < this.listConstrainDiscards.length; i++) {
            let it = this.listConstrainDiscards[i];
            let playerTakecard = this.getPlayerWithID(it.idPlayerTakecard);
            if (playerTakecard === this.thisPlayer) {
                for (let j = 0; j < this.thisPlayer.vectorCard.length; j++) {
                    let c = this.thisPlayer.vectorCard[j];
                    let isEat = c.getIsEat();
                    let codeCard = c.code;
                    if (it.cardID === codeCard && !isEat) {
                        c.setIsEat(true, this.spriteFrameEat);
                        if (it.justTakePlace) {
                            c.countTurn = 2;
                        } else {
                            c.countTurn = 0;
                        }
                        break;
                    }
                }

                this.countCardEat++;
            } else {
                if (playerTakecard !== null) {
                    let c = this.getCard();
                    c.setTextureWithCode(it.cardID);
                    c.node.setScale(.4);
                    this.node.addChild(c.node);
                    let si = playerTakecard.vectorCardP1.length;
                    let rate = 1;
                    playerTakecard.vectorCardP1.push(c);

                    if (playerTakecard._playerView.node.x > 0) {
                        rate = -1;
                    }

                    let posTo = playerTakecard._playerView.node.position;
                    posTo.x += rate * (playerTakecard._playerView.imgAvatar.node.width * 0.5 + c.getContentSize().width * .15) + rate * si * (c.getContentSize().width * .15 + 2);
                    c.node.zIndex = GAME_ZORDER.Z_CARD + 5 + rate * si;
                    cc.NGWlog("posTo la: " + posTo);
                    c.node.setPosition(posTo);

                    let playerDiscard = this.getPlayerWithID(it.idPlayerDiscard);
                    if (playerDiscard === this.thisPlayer) {
                        for (var ijk = 0; ijk < this.thisPlayer.vectorCard.length; ijk++) {
                            let cc = this.thisPlayer.vectorCard[ijk];
                            cc.NGWlog("-=-= Burmeses Poker -=-=-> c.N la: " + c.N + "Và card cc.N la: " + cc.N);
                            if (c.N === cc.N || c.isJoker && cc.isJoker) {
                                cc.setIsLockCard(true, this.spriteFrameLock);
                            }
                        }
                    }
                }
            }
        }

        this.onTurn();
    },

    getPlayerWithID(idPlayer) {
        for (var i = 0; i < this.players.length; i++) {
            if (idPlayer === this.players[i].id) {
                return this.players[i];
            }
        }

        return null;
    },
    flyChip(player, agBet) {
        var si = this.chipBet.length;
        var siP = this.players.length - 1;
        var posTo = cc.v2((si - siP / 2 + (siP % 2 == 0 ? .5 : 0)) * 100.0, this.sizeWin.height * .25);
        if (agBet > player.ag) {
            this.flyChipToTable(player._playerView.node.position, posTo, player.ag, true);
        } else
            this.flyChipToTable(player._playerView.node.position, posTo, agBet < 0 ? -1 * agBet : agBet, true);
    },

    flyChipToTable(posFrom, posTo, value, isShow = false) {//, aFunc = null) {
        let chip = cc.instantiate(this.chipPrefab).getComponent('Chip');
        this.node.addChild(chip.node, GAME_ZORDER.Z_BET);
        chip.setValue(1234, value);
        chip.node.setScale(.6);

        var nodeText = new cc.Node('Label');
        var labelText = nodeText.addComponent(cc.Label);

        var outline = nodeText.addComponent(cc.LabelOutline);
        outline.color = new cc.Color(0, 0, 0);
        outline.width = 2;

        labelText.cacheMode = 2;
        labelText.string = GameManager.getInstance().formatMoneyChip(value).replace(/(.)(?=(\d{3})+$)/g, '$1,');;
        labelText.fontSize = 30;
        labelText.lineHeight = 30;

        if (value > 1000) {
            labelText.fontSize = 26;
            labelText.lineHeight = 26;
        }

        labelText.horizontalAlign = 1;
        labelText.verticalAlign = 1;
        labelText.node.color = new cc.Color(0, 0, 0);
        chip.node.addChild(labelText.node);

        chip.node.setPosition(posFrom);
        let dis = Math.sqrt((posFrom.x - posTo.x) * (posFrom.x - posTo.x) + (posFrom.y - posTo.y) * (posFrom.y - posTo.y));
        let timeD = dis / 1000;
        cc.NGWlog("--------Khoang cach 2 diem:   " + dis + "thoi gian:  " + timeD);
        chip.node.runAction(cc.sequence(cc.moveTo(timeD, posTo), cc.callFunc(() => {
            chip.node.visible = isShow;
        })));

        this.chipBet.push(chip);
    },
    resultMoney() {
        var playerWin = [];
        var mWin = [];
        for (var i = 0; i < this.vtPlayerWin.length; i++) {
            var player = this.getPlayer(this.vtPlayerWin[i].pname);
            // cc.NGWlog('----------------------> resultMoney');
            cc.NGWlog(player);
            if (player === null) continue;
            // if (player === this.thisPlayer) {
            //     GameManager.getInstance().user.ag = this.vtPlayerWin[i].total_money;
            // }
            if (this.vtPlayerWin[i].money < 0) {
                player.ag = this.vtPlayerWin[i].total_money;
                player.updateMoney();
                // player.effectChangeMoney(this.vtPlayerWin[i].money);
                player._playerView.effectFlyMoney(this.vtPlayerWin[i].money, 50, 70, 0, 20);
                if (player.isFold) continue;
                this.flyChip(player, this.vtPlayerWin[i].money < 0 ? -1 * this.vtPlayerWin[i].money : this.vtPlayerWin[i].money);//cc.Math.abs(this.vtPlayerWin[i].money));
            } else if (this.vtPlayerWin[i].money > 0) {
                playerWin.push(player);
                mWin.push(this.vtPlayerWin[i].money);
                player.ag = this.vtPlayerWin[i].total_money;
            }
        }

        this.node.runAction(cc.sequence(cc.delayTime(2.0), cc.callFunc(() => {
            var sizeWin = playerWin.length;
            var sizeChip = this.chipBet.length;
            for (var i = 0; i < sizeWin; i++) {
                for (var j = 0; j < sizeChip; j++) {
                    var vl = this.chipBet[j].getValue() / sizeWin;

                    // var chip = Chip:: createWithValue(vl);//son
                    // this.addChild(chip, Z_BET);
                    // chip.setPosition(chipBet.at(j).getPosition());

                    var chip = cc.instantiate(this.chipPrefab).getComponent('Chip');
                    this.node.addChild(chip.node, GAME_ZORDER.Z_BET);
                    chip.setValue(vl);
                    chip.node.setScale(.75);
                    chip.node.setPosition(this.chipBet[j].node.position);

                    chip.node.runAction(cc.sequence(cc.moveTo(.4, playerWin[i]._playerView.node.position), cc.removeSelf()));
                    if (j >= sizeChip - 1) {
                        playerWin[i].updateMoney();
                        //  playerWin[i].effectChangeMoney(mWin[i]);
                        playerWin[i]._playerView.effectFlyMoney(mWin[i], 50, 70, 0, 20);
                    }
                }
            }

            for (var i = 0; i < this.chipBet.length; i++) {
                this.chipBet[i].node.destroy();
            }
            this.chipBet = [];
        }), cc.delayTime(2.0), cc.callFunc(() => {
            this.initScoreBoard();
        }), cc.delayTime(3.0), cc.callFunc(() => {
            this.handleFinishGame(0.0);
            this.resetGame();
            if (cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
            this.showWaittingInfo(GameManager.getInstance().getTextConfig("rummy_starting_new_round"), 9);
        })));
    },

    setCardNoc() {
        this.lbNumCardNoc.string = this.numCardNoc + '';
    },

    showButtonDeclare() {
        if (this.thisPlayer.isFold === false && this.stateGame !== STATE_GAME.VIEWING && this.isDeclareNotTouchCard === false) {
            this.btnDeclare.node.active = true;
            // lbDeclare -> setString(StringUtils:: format("%s (%d)", StringUtil:: upperStr(CCFS("rummy_declare")).c_str(), timeDeclare));
            if (this.timeDeclare > 0) {
                this.lbDeclare.string = cc.js.formatStr('%s (%d)', GameManager.getInstance().getTextConfig('rummy_declare'), this.timeDeclare);
            } else {
                this.lbDeclare.string = GameManager.getInstance().getTextConfig('rummy_declare');
            }

            if (this.lbDeclare.node.getNumberOfRunningActions() <= 0 && this.timeDeclare > 0) {
                this.lbDeclare.node.runAction(cc.repeat(cc.sequence(
                    cc.delayTime(1.0)
                    , cc.callFunc(() => {
                        this.timeDeclare--;
                        this.lbDeclare.string = cc.js.formatStr('%s (%d)', GameManager.getInstance().getTextConfig('rummy_declare'), this.timeDeclare);
                        if (this.timeDeclare <= 1) {
                            this.onClickDeclare();
                        }
                    })
                ), this.timeDeclare));
            }
        }
    },

    // onClickBack(event, dataCustom) {
    //     this.onClickDemo();
    // },

    onClickDemo() {
        // { "evt": "lc", "arr": [30, 42, 2, 7, 4, 36, 17, 3, 18, 43, 32, 31, 24], "nextTurn": "sondt123789", "deckCount": 69 }
        // var data = null;
        // if (this.indexNumber === 0) {
        //     var dataa = {
        //         evt: 'ctable',
        //         data: '{\"N\":\"Poker[1732]\",\"M\":100,\"ArrP\":[{\"id\":100425492,\"N\":\"sondt123789\",\"Url\":\"sondt123789\",\"AG\":101480,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"sIP\":\"116.96.80.111\",\"G\":3,\"Av\":5,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0}],\"Id\":1732,\"V\":0,\"S\":5,\"issd\":true}'
        //     };

        //     require('HandleParseDataBurmesePoker')._handleParseDataGame(JSON.stringify(dataa));

        //     data = {
        //         evt: 'lc',
        //         arr: [3, 5, 4, 11, 35, 44, 17, 39, 60, 19, 19, 48, 1],
        //         nextTurn: 'sondt123789',
        //         deckCount: 69
        //     };
        // }
        // else if (this.indexNumber === 1) {
        //     data = {
        //         evt: 'jtable',
        //         data: '{\"id\":100004698,\"N\":\"te.1523163618_929b41aed2f5234b\",\"Url\":\"\",\"AG\":195932,\"LQ\":0,\"VIP\":3,\"isStart\":true,\"IK\":0,\"sIP\":\"100004698\",\"G\":3,\"Av\":9,\"FId\":0,\"GId\":0,\"UserType\":11,\"TotalAG\":0,\"timeToStart\":0}'
        //     };
        // }
        // else if (this.indexNumber === 2) {
        //     data = {
        //         evt: 'finish',
        //         data: '[{\"N\":\"sondt123789\",\"M\":-400,\"AG\":9588767,\"S\":0,\"TotalAG\":0,\"diem\":-40,\"active\":false,\"arrCard\":[[34,21,48],[39,50,49],[31,33,47,17,16,18,39]],\"lastCard\":0},{\"N\":\"te.1523163618_929b41aed2f5234b\",\"M\":372,\"AG\":14372,\"S\":0,\"TotalAG\":0,\"diem\":0,\"active\":true,\"arrCard\":[[20,7,35,12,50,52],[34,11,51,36,13,19,16]],\"lastCard\":0}]'
        //     };
        // }
        // else if (this.indexNumber === 1) {
        //     data = {
        //         evt: 'dc',
        //         C: [4],
        //         NN: 'sondt123789',
        //         N: 'sondt123789'
        //     };
        // } else if (this.indexNumber === 2) {
        //     data = {
        //         evt: 'bc',
        //         C: 4,
        //         N: 'sondt123789'
        //     };
        // } else if (this.indexNumber === 3) {
        //     data = {
        //         evt: 'ac',
        //         C: 4,
        //         N: 'sondt123789'
        //     };
        // }
        if (this.indexNumber === 0) {
            var data = {
                evt: 'ctable',
                data: '{\"N\":\"Poker[1732]\",\"M\":100,\"ArrP\":[{\"id\":100425492,\"N\":\"sondt123789\",\"Url\":\"sondt123789\",\"AG\":101480,\"LQ\":0,\"VIP\":1,\"isStart\":true,\"IK\":0,\"sIP\":\"116.96.80.111\",\"G\":3,\"Av\":5,\"FId\":0,\"GId\":0,\"UserType\":1,\"TotalAG\":0,\"timeToStart\":0}],\"Id\":1732,\"V\":0,\"S\":5,\"issd\":true}'
            };
        } else if (this.indexNumber === 0) {
            data = {
                evt: 'finish',
                data: '{"evt":"finish","data":"[{\"N\":\"fb.528634737591337\",\"M\":7719,\"AG\":51847,\"S\":0,\"TotalAG\":0,\"diem\":0,\"active\":true,\"arrCard\":[[33,46,33],[6,45,45],[9,61,48],[28,29,27,60],[]],\"lastCard\":0},{\"N\":\"ndv062\",\"M\":-6100,\"AG\":65457,\"S\":0,\"TotalAG\":0,\"diem\":-61,\"active\":true,\"arrCard\":[[39,34,32,31,29],[17,14],[52,44,43,40,35,2],[]],\"lastCard\":0},{\"N\":\"fb.312304979598505\",\"M\":-2200,\"AG\":27154,\"S\":0,\"TotalAG\":0,\"diem\":-22,\"active\":true,\"arrCard\":[[28,41,41],[49,47,48],[3,4,5,6],[36,37,14],[]],\"lastCard\":0}]"}'
            };
        }

        // { "N": "mya_mhuu", "C": [44], "evt": "dc", "NN": "fb.140872170086612" }
        // { "N": "mya_mhuu", "C": 0, "evt": "bc" }
        // { "N": "fb.140872170086612", "C": 44, "evt": "ac" }
        require('HandleParseDataBurmesePoker')._handleParseDataGame(JSON.stringify(data));
        this.indexNumber++;
    },

    removePlayer(nameP, isInGame = false) {
        this._super(nameP, isInGame);

        if (this.players.length <= 1) {
            this.showWaittingInfo('');
        }
    },
});

module.export = BurmesePokerView;