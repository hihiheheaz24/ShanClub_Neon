var sizeDefine = cc.winSize;
var GameManager = require('GameManager')
var GameView = require('GameView2')
var ShanClubGameView = cc.Class({
    extends: GameView,

    properties: {
        anim_start: {
            default: null,
            type: sp.Skeleton
        },
        ParentCard: {
            default: null,
            type: cc.Node
        },
        ParentChip: {
            default: null,
            type: cc.Node
        },
        chipEffect: {
            default: null,
            type: cc.Node
        },
        NodeChat: cc.Node,
        DealerInGame: {
            default: null,
            type: require('DealerInGameView')
        },
        ani_dealer: {
            default: null,
            type: sp.Skeleton
        },
        list_Boxbet: {
            default: [],
            type: [require('BoxbetView')]
        },
        bg_Score_Result: {
            default: null,
            type: cc.Prefab
        },
        item_effect: {
            default: null,
            type: cc.Prefab
        },
        Node_BetPf: cc.Prefab,
        listToggle: {
            default: [],
            type: [cc.Toggle]
        },
        Node_Toggle: {
            default: null,
            type: cc.Node
        },
        Node_Btn_Ac_Card: {
            default: null,
            type: cc.Node
        },
        is_my_turn: false,
        _scoreP: 0,
        _rateP: 0,
        listCardSystem: [],
        isTurnOnToggle: true,
        spriteChipEffect: cc.SpriteFrame,
        listNameTable: [cc.SpriteFrame],
        table_left: cc.Sprite,
        table_right: cc.Sprite,
        is_show_border_dealer: false,
    },

    onLoad() {
        this.countUpVip = 0;
        this.listPosView[7] = null;
        this._super();
        this.List_Bg_Result = [{}, {}, {}, {}, {}, {}, {}, {}];
        this.listEffWinLose = [{}, {}, {}, {}, {}, {}, {}];
        this.name_cur_turn = '';
        this.nodeGroupMenu = null;
        this.ShanClubScorePool = new cc.NodePool('ShanClubResultScore');
        this.efWinLosePool = new cc.NodePool('EffectWinLose');
        this.chipEffectPool = new cc.NodePool();
        this.Node_Bet = null;
        this.ParentChip.zIndex = 1000;
        this.DealerInGame.node.zIndex = GAME_ZORDER.Z_MENU_VIEW - 1;

        this.DealerInGame.node.position = cc.v2(0, sizeDefine.height / 2 * 0.55);
        this.ani_dealer.node.position = cc.v2(0, sizeDefine.height / 2 * 0.61);

        this.listPosView = [
            { x: sizeDefine.width / 2 * -0.18, y: sizeDefine.height / 2 * -0.48 },
            { x: sizeDefine.width / 2 * -0.618, y: sizeDefine.height / 2 * -0.48 },
            { x: sizeDefine.width / 2 * -0.80, y: sizeDefine.height / 2 * 0.11 },
            { x: sizeDefine.width / 2 * -0.5, y: sizeDefine.height / 2 * 0.65 },
            { x: sizeDefine.width / 2 * 0.5, y: sizeDefine.height / 2 * 0.65 },
            { x: sizeDefine.width / 2 * 0.836, y: sizeDefine.height / 2 * 0.11 },
            { x: sizeDefine.width / 2 * 0.67, y: sizeDefine.height / 2 * -0.48 },
            { x: sizeDefine.width / 2 * 0, y: sizeDefine.height / 2 * 0.55 }
        ];

        this.list_Boxbet[0].node.position = cc.v2(sizeDefine.width / 2 * -0.13, sizeDefine.height / 2 * -0.183);
        this.list_Boxbet[1].node.position = cc.v2(sizeDefine.width / 2 * -0.4375, sizeDefine.height / 2 * -0.3);
        this.list_Boxbet[2].node.position = cc.v2(sizeDefine.width / 2 * -0.53, sizeDefine.height / 2 * 0.125);
        this.list_Boxbet[3].node.position = cc.v2(sizeDefine.width / 2 * -0.364, sizeDefine.height / 2 * 0.347);
        this.list_Boxbet[4].node.position = cc.v2(sizeDefine.width / 2 * 0.39, sizeDefine.height / 2 * 0.347);
        this.list_Boxbet[5].node.position = cc.v2(sizeDefine.width / 2 * 0.6, sizeDefine.height / 2 * 0.125);
        this.list_Boxbet[6].node.position = cc.v2(sizeDefine.width / 2 * 0.453, sizeDefine.height / 2 * -0.3);

        // var nodeNameTable = new cc.Node('Sprite');
        // var spName = nodeNameTable.addComponent(cc.Sprite);

        // var languaSave = cc.sys.localStorage.getItem('language_save_2');
        // if (parseInt(languaSave) == 0 || languaSave == null)
        //     spName.spriteFrame = this.listNameTable[0];
        // else
        //     spName.spriteFrame = this.listNameTable[1];
        // this.node.addChild(nodeNameTable, 1);

        this.table_left.node.width = sizeDefine.width / 2;
        this.table_right.node.width = sizeDefine.width / 2;

        this.anim_start.node.zIndex = 10;

    },
    handleCCTable(data) {
        this.stateGame = STATE_GAME.WAITING;

        var name = data.Name;
        var player = this.getPlayer(name);
        if (player === null)
            return;
        for (var i = 0; i < this.players.length; i++) {
            var pl = this.players[i];
            if (pl == player)
                pl.setHost(true);
            else
                pl.setHost(false);
        }
    },
    handleVTable(strData) {
        this._super(strData);
        let data = JSON.parse(strData)
        var _listPlayer = data.ArrP;
        this.ViewIng(_listPlayer);

        if (data.Dealer == "SystemDealer") {
            if (data.ArrDealer.length > 0) {
                for (let i = 0; i < data.ArrDealer.length; i++) {
                    this.ChiaCardDealer();
                }
            }

            if (data.scoreDealer != 0) {
                this.OpenCardViewing(1, "SystemDealer", data.scoreDealer, data.rateDealer, data.ArrDealer);
            }
        }

        if (this.Node_Bet == null) {
            this.Node_Bet = cc.instantiate(this.Node_BetPf).getComponent('ShanClubNodeBet');
        }

        if (this.stateGame == STATE_GAME.VIEWING) {
            this.Node_Toggle.active = false;
        }
        
    },
    handleCTable(strData) {
        this._super(strData);
        if (this.Node_Bet == null) {
            this.Node_Bet = cc.instantiate(this.Node_BetPf).getComponent('ShanClubNodeBet');
        }
    },

    handleRJTable(strData) {
        this._super(strData);
        let data = JSON.parse(strData)
        var _listPlayer = data.ArrP;
        this.ViewIng(_listPlayer);
        cc.NGWlog('ten thang dealer la=== ' + data.Dealer);
        if (data.Dealer == "SystemDealer") {
            if (data.ArrDealer.length > 0) {
                for (let i = 0; i < data.ArrDealer.length; i++) {
                    this.ChiaCardDealer();
                }
            }
            if (data.scoreDealer != 0) {
                cc.NGWlog('Open card dealer ' + data.ArrDealer[i]);
                this.OpenCardViewing(1, "SystemDealer", data.scoreDealer, data.rateDealer, data.ArrDealer);
            }
        }
        this.Node_Toggle.active = false;
        this.updatePositionPlayerView();
    },

    setupNewGame(nameDealer, _time) { // startdealer
        // GameTransportPacket: {"evt":"startdealer","Dealer":"SystemDealer","T":7000,"S":0,"rate":0,"score":0}
        this.state = 0;
        cc.NGWlog('chay vao ham resetView');
        this.resetGameDisPlay();
        this.anim_start.node.active = true;
        this.anim_start.setAnimation(0, "animation", false);
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.anim_start.node.active = false;

            this.nameDealer = nameDealer;
            var time_turn = _time / 1000;
            for (var i = 0; i < this.players.length; i++) {
                this.players[i]._playerView.setTurn(true, time_turn, true);
            };
            this.isTurnOnToggle = true;
            this.is_my_turn = false;
            if (this.Node_Bet == null) {
                this.Node_Bet = cc.instantiate(this.Node_BetPf).getComponent('ShanClubNodeBet');
            }
            this.node.addChild(this.Node_Bet.node);
            this.NodeChat.active = false;

            if (this.stateGame == STATE_GAME.VIEWING) {
                this.Node_Bet.onHide();
                this.thisPlayer._playerView.setTurn(false, 0);
            }

            require('HandleGamePacket').NextEvt();
        }, 2000)
    },
    resetGameDisPlay() {
        this.handleFinishGame();
        this.clearAllCard();
        this.resetToggleList();
        cc.sys.localStorage.setItem('isHien', false);
        for (var i = 0; i < this.list_Boxbet.length; i++) {
            this.list_Boxbet[i].setValueBoogyi(0);
            this.list_Boxbet[i].onHide();
        }
        for (var i = 0; i < this.List_Bg_Result.length; i++) {
            let item = this.List_Bg_Result[i];
            if (item.node != null && typeof item.node != 'undefined') {
                this.ShanClubScorePool.put(item.node);
            }

        };
        this.List_Bg_Result.length = 0;
        this.List_Bg_Result = [{}, {}, {}, {}, {}, {}, {}, {}];
        let lengthEff = this.listEffWinLose.length;
        for (var i = 0; i < lengthEff; i++) {
            let item = this.listEffWinLose[i];
            if (item.node != null && typeof item.node != 'undefined')
                this.efWinLosePool.put(item.node);
        };

        this.listEffWinLose.length = 0;
        this.listEffWinLose = [{}, {}, {}, {}, {}, {}, {}];

        for (var i = 0; i < this.listCardSystem.length; i++) {
            this.cardPool.put(this.listCardSystem[i].node);
        }
        this.listCardSystem = [];
    },
    cleanGame() {
        this._super();
        this.ShanClubScorePool.clear();
        this.efWinLosePool.clear();
        this.chipEffectPool.clear();
    },
    handleSTable(strData) {
        this.resetGameDisPlay();
        this._super(strData);
        if (this.Node_Bet == null) {
            this.Node_Bet = cc.instantiate(this.Node_BetPf).getComponent('ShanClubNodeBet');
        }
    },
    handleBc(data) {
        if (data.N == this.thisPlayer.pname) {
            this.is_my_turn = true;
            this.thisPlayer._playerView.setTurn(false, 0);
            this.Node_Toggle.active = false;
            this.Node_Btn_Ac_Card.active = false;
        }
        if (data.C === 0) {
            return;
        }

        var player = this.getPlayer(data.N);
        if (player !== null) {
            player._playerView.setTurn(false, 0);
            var IndexP = this.getIndexPlayerWithName(data.N);
            if (data.N == this.thisPlayer.pname) {
                this._scoreP = this.HamTinhDiem(parseInt(data.score));
                this._rateP = data.rate;
                this.ChiaCardPlayer(IndexP, 0.3, data.C, 2);
            } else {
                this.ChiaCardPlayer(IndexP, 0.3, 0, 2);
            }
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
        } else if (data.N === "SystemDealer") {
            this.ChiaCardDealer(0.3);
            require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
        }


    },
    handleTimeOut(data) {
        var playerNext = this.getPlayer(this.name_cur_turn);
        if (playerNext) playerNext._playerView.setTurn(false, 0);
        var player = this.getPlayer(data.NN);
        if (player === null) return;
        player._playerView.setTurn(true, data.T / 1000, true);
        this.name_cur_turn = data.NN;

        if (this.stateGame !== 1) {
            return;
        }
        if (data.NN == this.thisPlayer.pname) {
            this.isTurnOnToggle = false;
            cc.sys.localStorage.setItem('isHien', true);
            if (!this.readListToggle()) {
                this.Node_Toggle.active = false;
                this.Node_Btn_Ac_Card.active = true;
            }
        } else {
            if (this.isTurnOnToggle) {
                this.Node_Toggle.active = true;
            }
            this.Node_Btn_Ac_Card.active = false;
        }
    },
    ViewIng(lisP) {
        this.isTurnOnToggle = false;
        this.resetToggleList();
        let checkBeforeLc = false;
        let checkBet = false;
        for (let i = 0; i < lisP.length; i++) {
            this.playerBet(lisP[i].N, lisP[i].AGC);
            let indexP = this.getIndexPlayerWithName(lisP[i].N)
            let player = this.players[indexP];

            if (player == this.thisPlayer) {
                if (lisP[i].AGC > 0) checkBet = true;
                if (lisP[i].Arr.length > 0) {
                    if (lisP[i].Arr[0] == 0) {
                        checkBeforeLc = true;
                    }
                }
            }
        }
        if (checkBeforeLc) {
            cc.NGWlog("May Rjtable truoc luc chia bai con trai a");
            if (!checkBet) {
                if (this.Node_Bet == null) {
                    this.Node_Bet = cc.instantiate(this.Node_BetPf).getComponent('ShanClubNodeBet');
                }
                this.node.addChild(this.Node_Bet.node);
                this.NodeChat.active = false;
            }
            return;
        }

        for (let i = 0; i < lisP.length; i++) {
            let indexP = this.getIndexPlayerWithName(lisP[i].N);
            let player = this.players[indexP];

            if (player == this.thisPlayer) {
                this._scoreP = this.HamTinhDiem(parseInt(lisP[i].score));
                let isHien = cc.sys.localStorage.getItem('isHien');
                cc.NGWlog("Bien de hien toggle la: " + isHien);
                if (this._scoreP >= 8 || lisP[i].Arr.length == 3 || isHien == 'true' || this.listCardSystem.length == 3) {
                    this.Node_Toggle.active = false;
                    this.isTurnOnToggle = false;
                } else{
                    this.Node_Toggle.active = true;
                }
                for (let j = 0; j < lisP[i].Arr.length; j++) {
                    this.ChiaCardPlayer(indexP, 0, lisP[i].Arr[j]);
                }
            } else {
                for (let j = 0; j < lisP[i].Arr.length; j++) {
                    if (j == 2)
                        this.ChiaCardPlayer(indexP, 0, 0, 2);
                    else
                        this.ChiaCardPlayer(indexP, 0);
                }
            }

            if (lisP[i].Arr[0] != 0) {
                cc.NGWlog('chay vao ham mo bai this player');
                this.OpenCardViewing(1, lisP[i].N, lisP[i].score, lisP[i].rate, lisP[i].Arr)
            }
        }
    },
    OpenCardViewing(timeDelay, nameP, score, rate, arrC) {
        this.node.runAction(cc.sequence(cc.delayTime(timeDelay), cc.callFunc(() => {
            this.openCardPlayer(nameP, arrC, score, rate);
        })))

    },
    handleLc(data) {
        this.sendTrackingGame();
        this.ArrCardCodethisPlayer = [];
        this.ArrCardCodethisPlayer = data.arr;
        this._scoreP = this.HamTinhDiem(parseInt(data.score));
        this.nameDealer = data.Dealer;

        this.ani_dealer.setAnimation(0, "chiabai", true);
        this.ani_dealer.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(() => {
            this.ani_dealer.setAnimation(0, "normal", true);
        })))

        if (this._scoreP >= 8) {
            this.isTurnOnToggle = false
            this.Node_Toggle.active = false;
        }
        this._rateP = data.rate;
        this.STATE_GAME = STATE_GAME.PLAYING;
        let isDealerSystem = this.nameDealer === 'SystemDealer' ? true : false;
        let delayTimeDealard = 0.1;
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chiabai);
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.players.length; j++) {
                if (j == this.getIndexPlayerWithName(this.thisPlayer.pname)) {
                    let length = this.players[j].vectorCard.length;
                    if (length == i) {
                        this.ChiaCardPlayer(j, delayTimeDealard, this.ArrCardCodethisPlayer[i], 1);
                    } else {
                        this.thisPlayer.vectorCard[i].setTextureWithCode(this.ArrCardCodethisPlayer[i]);
                        this.SetEfftResult(0, this._scoreP, this._rateP, length);
                    }
                } else {
                    if (this.players[j].vectorCard.length == i) this.ChiaCardPlayer(j, delayTimeDealard);
                }
                delayTimeDealard += 0.1;
            }

            let delayTimeCardDealer = 0.1 * (i * this.players.length) + 0.1;

            if (isDealerSystem) {
                if (this.listCardSystem.length == i) this.ChiaCardDealer(delayTimeCardDealer);
                delayTimeDealard += 0.1;
            }
        }

        this.setTimeout(() => {
            require('HandleGamePacket').NextEvt();
        }, 1000);
    },
    playerBet(name, chip) {
        //{"N":"thet_phain_oo","AG":30000,"evt":"bm"} (NetworkManager.js, line 34)

        var pl = this.getPlayer(name);
        if (pl === null || chip <= 0) {
            return;
        }
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.chipsAudio);
        var index_bet = pl._indexDynamic;
        this.list_Boxbet[index_bet].onShow();
        this.list_Boxbet[index_bet].setValueBoogyi(chip);

        // if (this.stateGame === 1) {
        //     console.log("chip bet la " + chip);
        //     // this.EffectMoneyChange(-chip, pl.ag, pl._playerView.lbAg);
        //     pl.ag = pl.ag - chip;
        //     pl.updateMoney();
        // }
        pl.ag = pl.ag - chip;
        pl.updateMoney();
        pl._playerView.setTurn(false, 0);

    },

    handleBm(data) {
        let nameP = data.N;
        let amount = data.AG;

        let index = this.getIndexPlayerWithName(nameP);
        this.playerBet(nameP, amount);
        // fly Chip Effect
        if (nameP === this.thisPlayer.pname) {
            this.Node_Bet.onHide();
            this.NodeChat.active = true;
        }
    },
    handleFinish(doc) {
        var playerNext = this.getPlayer(this.name_cur_turn);
        
        if (playerNext) {
            playerNext._playerView.setTurn(false, 0);
        }
        this.Node_Toggle.active = false;
        this.Node_Btn_Ac_Card.active = false;

        var size_card_dealer = 0;
        var score_dealer_final = 0;
        this.is_show_border_dealer = false;

        var data = JSON.parse(doc);

        for (let i = 0; i < data.length; i++) {
            if (data[i].N.localeCompare("SystemDealer") === 0) {
                score_dealer_final = this.HamTinhDiem(data[i].S);
                size_card_dealer = data[i].ArrCard.length;
                var rate = data[i].rate;
                this.openCardPlayer("SystemDealer", data[i].ArrCard, score_dealer_final, rate);
                this.itemChatNgoaiGame.setDataChatCard("Monica: " + require('GameManager').getInstance().getTextConfig('txt_cardofsys'), data[i].ArrCard);
                this.quickChat.addChatWithCard("Monica: " + require('GameManager').getInstance().getTextConfig('txt_cardofsys'), data[i].ArrCard);
            }
        }

        for (let i = 0; i < data.length; i++) {
            let pl = this.getPlayer(data[i].N);
            let chip = parseInt(data[i].M);
            let totalChip = parseInt(data[i].AG);
            let score = this.HamTinhDiem(data[i].S);
            let size_card_player = data[i].ArrCard.length;
            var rate = data[i].rate;
            if (data[i].N === this.thisPlayer.pname) {
                GameManager.getInstance().user.ag = totalChip;
                if (Global.LobbyView !== null)
                    Global.LobbyView.updateChip();
                if (Global.MainView !== null)
                    Global.MainView.updateChipAndSafe();
                var str = "";
                if (chip < 0) {
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.loseAudio);
                    str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_lost').replace("%lld", chip + "");
                } else if (chip > 0) {
                    require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.winAudio);
                    str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_win').replace("%lld", chip + "");
                }
                this.itemChatNgoaiGame.setDataChatCard(str, data[i].ArrCard);
                this.quickChat.addChatWithCard(str, data[i].ArrCard);

                // require('SMLSocketIO').getInstance().emitUpdateInfo();
            }

            if (pl !== null) {
                let dyn_id = pl._indexDynamic;
                this.openCardPlayer(data[i].N, data[i].ArrCard, score, rate);
                this.instantiateEffWinLose(dyn_id, chip);
                if (chip > 0) {
                    if (i == 0) require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    let delayT = 0;
                    this.setTimeout(() => {
                        if (this.node == null || typeof this.node == 'undefined') return;
                        this.list_Boxbet[dyn_id].node.active = false;

                        for (let id = 0; id < 4; id++) {
                            let nodeChip = new cc.Node();
                            nodeChip.addComponent(cc.Sprite).spriteFrame = this.spriteChipEffect;
                            this.node.addChild(nodeChip, GAME_ZORDER.Z_EMO);

                            nodeChip.position = cc.v2(0, 230);

                            let pos = cc.v2(0, 0);
                            let num1 = Math.floor(Math.random() * 80) - 40;
                            let num2 = Math.floor(Math.random() * 80) - 40;

                            pos = pos.add(cc.v2(num1, num2));

                            let move = cc.moveTo(0.25, pos).easing(cc.easeCubicActionInOut());
                            let delay = cc.delayTime(delayT);
                            let moveTarget = cc.moveTo(0.25, this.listPosView[dyn_id]).easing(cc.easeCubicActionInOut());

                            nodeChip.runAction(cc.sequence(delay, move, cc.delayTime(2), moveTarget, cc.callFunc(() => {
                                nodeChip.destroy();
                            })));
                            delayT += 0.075;
                        }
                    }, 2800)

                    this.setTimeout(() => {
                        let moneyChange = totalChip - pl.ag
                        pl._playerView.setupEffectChangeMoney(pl.ag, pl.ag += moneyChange);
                        if (pl == this.thisPlayer)
                            this.listEffWinLose[dyn_id].effectFlyMoney(chip, 40, 70, -135, 50);
                        else
                            this.listEffWinLose[dyn_id].effectFlyMoney(chip, 40, 70, 0, 50);
                    }, 5000)

                } else if (chip < 0) {
                    let delayT = 0;
                    this.list_Boxbet[dyn_id].node.active = false;
                    if (i == 0) require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
                    for (let id = 0; id < 4; id++) {
                        let nodeChip = new cc.Node();
                        nodeChip.addComponent(cc.Sprite).spriteFrame = this.spriteChipEffect;
                        this.node.addChild(nodeChip, GAME_ZORDER.Z_EMO);
                        nodeChip.position = this.listPosView[dyn_id];
                        let pos = this.list_Boxbet[dyn_id].node.position;
                        let num1 = Math.floor(Math.random() * 50) - 40;
                        let num2 = Math.floor(Math.random() * 50) - 40;
                        pos = pos.add(cc.v2(num1, num2));
                        let move = cc.moveTo(0.1, pos).easing(cc.easeCubicActionInOut());
                        let delay = cc.delayTime(delayT);
                        let moveTarget = cc.moveTo(0.25, cc.v2(0, 230)).easing(cc.easeCubicActionInOut());
                        nodeChip.runAction(cc.sequence(delay, move, cc.delayTime(2), moveTarget, cc.callFunc(() => {
                            nodeChip.destroy();
                        })));
                        delayT += 0.075;
                    }

                    this.setTimeout(() => {
                        let moneyChange = totalChip - pl.ag
                        pl._playerView.setupEffectChangeMoney(pl.ag, pl.ag += moneyChange);

                        if (pl == this.thisPlayer)
                            this.listEffWinLose[dyn_id].effectFlyMoney(chip, 40, 70, -135, 50);
                        else
                            this.listEffWinLose[dyn_id].effectFlyMoney(chip, 40, 70, 0, 50);

                    }, 1000)
                } else {
                    this.setTimeout(() => {
                        let moneyChange = totalChip - pl.ag
                        pl._playerView.setupEffectChangeMoney(pl.ag, pl.ag += moneyChange);
                    }, 1000)
                }

                this.setTimeout(() => {
                    cc.NGWlog("size_card_dealer la " + size_card_dealer + "\n" + "size_card_player la " + size_card_player)
                    if (score == score_dealer_final && size_card_dealer == size_card_player) {
                        this.showBigestCard("SystemDealer");
                        this.showBigestCard(data[i].N);
                    }
                }, 300);
            }
        }

        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.stateGame = 0;
            this.resetGameDisPlay();
            if (cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
            require('HandleGamePacket').NextEvt();
            this.countUpVip++;
            if (require('GameManager').getInstance().user.vip < 1 && this.countUpVip >= 2)
                require('NetworkManager').getInstance().sendUpVip();
        }, 6500);
    },
    instantiateEffWinLose(indexDyn, chip) {
        let item = this.listEffWinLose[indexDyn];
        if (item.node == null || typeof item.node == 'undefined') {
            if (this.efWinLosePool.size() < 1) {
                item = cc.instantiate(this.item_effect).getComponent('EffectWinLose');
            } else {
                item = this.efWinLosePool.get().getComponent('EffectWinLose');
            };
            this.node.addChild(item.node, GAME_ZORDER.Z_EMO);
            if (indexDyn == 0) {
                if (this.thisPlayer.vectorCard.length == 3) {
                    item.node.position = cc.v2(30, sizeDefine.height / 2 * -0.55);
                } else {
                    item.node.position = cc.v2(20, sizeDefine.height / 2 * -0.55);
                }
            } else {
                item.node.position = this.listPosView[indexDyn];
            }
            this.listEffWinLose[indexDyn] = item;
        }
        item.effectWinLose(chip);
    },
    getDynamicIndex(index) {
        if (index == 0) return 0;
        let _index = index;
        if (this.players.length < 5) {
            _index += 2;
        } else {
            if (this.players.length == 5)
                _index += 1;
            else
                return _index;
        }
        return _index;
    },
    getIndexPlayerWithName(name) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == name) {
                return i;
            }
        }
    },
    handlePokpok(doc) {
        var dataPok = JSON.parse(doc);
        //   this.node.runAction(cc.sequence(cc.delayTime(0.4 * (this.players.length) + 0.5), cc.callFunc(() => {
        for (var i = 0; i < dataPok.length; i++) {
            this.openCardPlayer(dataPok[i].N, dataPok[i].arr, dataPok[i].score, dataPok[i].rate)
        }
        //  })))
    },
    openCardPlayer(nameP, arrC, score, rate) {

        if (nameP !== 'SystemDealer') {
            var player = this.getPlayer(nameP);
            var indexPDyn = player._indexDynamic;
            if (indexPDyn !== 0) {
                let vectorCard = player.vectorCard
                let length = vectorCard.length;
                let offset = 30;
                let Pos = -15;
                let offsetRotation = 20;
                let rotate = -10;

                if (length == 3) {
                    Pos = -25;
                    rotate = -10;
                    offsetRotation = 10;
                }
                let posFirtCard = cc.v2(this.listPosView[indexPDyn].x + Pos, this.listPosView[indexPDyn].y + 30);
                for (let i = 0; i < length; i++) {
                    vectorCard[i].setTextureWithCode(arrC[i]);
                    vectorCard[i].node.stopAllActions();
                    vectorCard[i].node.rotation = rotate;
                    vectorCard[i].node.setScale(0.45, 0.45);
                    vectorCard[i].node.position = posFirtCard;
                    rotate += offsetRotation;
                    posFirtCard = cc.v2(posFirtCard.x + offset, posFirtCard.y);
                }
                cc.log("chay vao shan+ if  :: ", rate);
                this.SetEfftResult(indexPDyn, this.HamTinhDiem(score), rate, arrC.length);
            } else {
                this.is_my_turn = true;
                this.SetEfftResult(indexPDyn, this.HamTinhDiem(score), rate, arrC.length);
            }

        } else {
            let offset = 30;
            let Pos = -15;
            let offsetRotation = 20;
            let rotate = -10;
            let vectorCard = this.listCardSystem
            let length = vectorCard.length;
            if (length == 3) {
                Pos = -25;
                rotate = -10;
                offsetRotation = 10;
            }
            let posFirtCard = cc.v2(Pos, this.DealerInGame.node.position.y);
            for (var i = 0; i < arrC.length, i < length; i++) {
                vectorCard[i].setTextureWithCode(arrC[i]);
                vectorCard[i].node.stopAllActions();
                vectorCard[i].node.rotation = rotate;
                vectorCard[i].node.setScale(0.45, 0.45);
                vectorCard[i].node.position = posFirtCard;
                rotate += offsetRotation;
                posFirtCard = cc.v2(posFirtCard.x + offset, posFirtCard.y);
            }
            cc.log("chay vao shan+ else  :: ", rate);
            this.SetEfftResult(7, this.HamTinhDiem(score), rate, arrC.length);
        }
    },

    HamTinhDiem(diem) {
        if (diem >= 1000 && diem < 2000) diem = 11;
        else if (diem >= 2000 && diem < 3000) diem = 12;
        else if (diem >= 3000 && diem < 4000) diem = 13;
        else if (diem >= 4000 && diem < 5000) diem = 14;
        else if (diem >= 5000) {
            diem = diem % 5000;
            diem = diem % 10;
        }
        return diem;
    },

    EffectMoneyChange(amountChange, _valueSet, label) {
        cc.NGWlog('chay vao ham thay doi tien');
        label.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.callFunc(() => {
            _valueSet += amountChange;
            label.string = GameManager.getInstance().formatMoney(_valueSet);
        }), cc.scaleTo(0.2, 1)))

    },
    ChiaCardPlayer(indexP, delayTime, cardCode = 0, round = 1) {
        let Vplayer;
        var cardTemp;
        let isRound2 = 0;
        cardTemp = this.getCard();
        this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
        cardTemp.setTextureWithCode(0);
        cardTemp.node.setScale(0);
        cardTemp.node.position = this.DealerInGame.node.position;
        var dynamicIndex = this.players[indexP]._indexDynamic;

        let listVCardP = this.players[indexP].vectorCard;
        if (round == 1) {
            isRound2 = 0;
            cardTemp.node.rotation = -10 + (20 * (listVCardP.length));
        } else {
            isRound2 = 2;
            cardTemp.node.rotation = 13;
        }

        if (dynamicIndex != 0) {
            let offset = 20 * listVCardP.length;
            let num = 35;
            // Set z-Index for card of thisPlayer
            if (dynamicIndex > 4) {
                Vplayer = cc.v2(this.listPosView[dynamicIndex].x - num + offset, this.listPosView[dynamicIndex].y - isRound2);
            } else {
                Vplayer = cc.v2(this.listPosView[dynamicIndex].x + num + offset, this.listPosView[dynamicIndex].y - isRound2);
            }
            if (listVCardP.length > 0) cardTemp.node.zIndex = listVCardP[listVCardP.length - 1].node.zIndex + 1;
        } else {
            // Set z-index for another players
            let offset = 27 * listVCardP.length;
            if (listVCardP.length > 0) cardTemp.node.zIndex = listVCardP[listVCardP.length - 1].node.zIndex + 1;
            if (round == 2)
                Vplayer = cc.v2(this.listPosView[dynamicIndex].x + 120 + offset, this.listPosView[dynamicIndex].y - 5);
            else
                Vplayer = cc.v2(this.listPosView[dynamicIndex].x + 120 + offset, this.listPosView[dynamicIndex].y);
        }
        listVCardP.push(cardTemp);
        let length = listVCardP.length;

        let dt = 0.5;
        let scale = 0.35;
        if (delayTime == 0) dt = 0;
        else dt = 0.5;
        if (dynamicIndex == 0) scale = 0.55;

        let acOpenCard = cc.callFunc(() => {
            if (delayTime != 0) {
                cardTemp.node.runAction(cc.sequence(cc.scaleTo(0.2, 0.05, scale), cc.scaleTo(0.2, scale)));
                cardTemp.node.runAction(cc.sequence(cc.skewTo(0.2, 0, 15), cc.callFunc(() => { cardTemp.skewY = -15 }), cc.skewTo(0.2, 0, 0)));
            }
            this.setTimeout(() => {
                cardTemp.setTextureWithCode(cardCode);
            }, 200)
        });

        let actionMove = cc.spawn(cc.rotateBy(dt, 360), cc.moveTo(dt, Vplayer), cc.fadeIn(dt), cc.scaleTo(dt, scale), cc.callFunc(() => {
            if (listVCardP.length == 3) {
                for (let i = 0; i < 3; i++) {
                    listVCardP[i].node.runAction(cc.sequence(cc.delayTime(0.2), cc.rotateTo(0.2, (i - 1) * 13)));
                }
            }
        }));

        if (dynamicIndex == 0) {
            let actResult = cc.callFunc(() => {
                if (length > 1) {
                    this.SetEfftResult(0, this._scoreP, this._rateP, length);
                    if (length == 3) this.List_Bg_Result[0].node.position = cc.v2(this.listPosView[0].x + 150, this.listPosView[0].y - 40);
                }
            });
            cardTemp.node.runAction(cc.sequence(cc.delayTime(delayTime), actionMove, acOpenCard, cc.delayTime(0.3), actResult));
        } else {
            cardTemp.node.runAction(cc.sequence(cc.delayTime(delayTime), actionMove));
        }
    },
    ChiaCardDealer(delayTime = 0, card = 0, round = 1) {
        let cardTemp = this.getCard();
        this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
        cardTemp.setTextureWithCode(0);
        cardTemp.node.scale = 0;
        cardTemp.node.position = this.DealerInGame.node.position;
        cardTemp.node.rotation = -10 + (20 * (this.listCardSystem.length));
        if (this.listCardSystem.length > 0) cardTemp.node.zIndex = this.listCardSystem[this.listCardSystem.length - 1].node.zIndex + 1;
        this.listCardSystem.push(cardTemp);
        if (this.listCardSystem.length == 4) this.listCardSystem[3].node.active = false;
        cc.NGWlog("Size listCardSystem la: " + this.listCardSystem.length);
        let offset = this.DealerInGame.node.position.x - 30 + (this.listCardSystem.length * 20);
        let Vplayer = cc.v2(offset, this.DealerInGame.node.position.y - 5);
        if (this.listCardSystem.length >= 3) Vplayer = cc.v2(offset - 7, this.DealerInGame.node.position.y - 10);
        let dt;
        if (delayTime == 0) dt = 0;
        else dt = 0.5;

        var acSpawn = cc.spawn(cc.moveTo(dt, Vplayer), cc.fadeIn(dt), cc.scaleTo(dt, 0.35), cc.callFunc(() => {
            if (this.listCardSystem.length >= 3) {
                this.listCardSystem[2].node.rotation = 13;
                for (let i = 0; i < 2; i++) {
                    this.listCardSystem[i].node.runAction(cc.spawn(cc.moveBy(dt, cc.v2(-7, 0)), cc.rotateTo(dt, (i - 1) * 13)));
                }
            }
            cardTemp.setTextureWithCode(card)
        }));
        cardTemp.node.runAction(cc.sequence(cc.delayTime(delayTime), acSpawn));

    },
    SetEfftResult(arr_index, score, rate, num_card) {

        let item = this.List_Bg_Result[arr_index];
        if (item.node == null || typeof item.node == 'undefined') {
            if (this.ShanClubScorePool.size() < 1) {
                item = cc.instantiate(this.bg_Score_Result).getComponent('ShanClubResultScore');
            } else {
                item = this.ShanClubScorePool.get().getComponent('ShanClubResultScore');;
            }
            this.node.addChild(item.node, GAME_ZORDER.Z_BET);
            this.List_Bg_Result[arr_index] = item;
            if (arr_index == 0) {
                item.node.position = cc.v2(this.listPosView[0].x + 135, this.listPosView[0].y - 30);
                item.bg_bonus.node.position = cc.v2(70, 80);
            } else if (arr_index == 7) {
                item.node.position = cc.v2(0, this.listPosView[7].y - 25);
                if (num_card == 3) item.node.position = cc.v2(5, this.listPosView[7].y - 25);
            } else {
                item.node.position = this.listPosView[arr_index];
            }

        }
        cc.NGWlog('chay vao ham khoi tao item result ' + 'Index: ' + arr_index + "    Score: " + score + '   rate: ' + rate);
        item.setResult(score, rate, num_card);

    },
    HandlerTip(data) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == data.N) {
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.tipAudio);
                this.EffectMoneyChange(-data.AGTip, this.players[i].ag, this.players[i]._playerView.lbAg);
                this.players[i].ag -= data.AGTip;
                if (this.players[i].pname == this.thisPlayer.pname) {
                    GameManager.getInstance().user.ag -= data.AGTip;
                }
                for (let j = 0; j < 2; j++) // sinh ra 4 chip
                {
                    if (this.chipEffectPool.size() < 1) this.chipEffectPool.put(cc.instantiate(this.chipEffect));
                    let temp = this.chipEffectPool.get();
                    temp.active = true;
                    temp.setPosition(this.players[i]._playerView.node.position);
                    this.ParentChip.addChild(temp);
                    let tempAc1 = cc.moveTo(0.2, temp.position.add(cc.v2(0, 80))).easing(cc.easeElasticOut(1));
                    let tempAc2 = cc.moveTo(1, this.DealerInGame.node.position).easing(cc.easeInOut(3));
                    temp.runAction(cc.sequence(cc.delayTime(j * 0.2), tempAc1, cc.delayTime(0.3), tempAc2, cc.callFunc(() => { this.chipEffectPool.put(temp) })));
                }
                this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => { this.DealerInGame.show(data.N, data.AGTip); })))
            }
        }
    },
    resetToggleList() {
        for (let i = 0; i < this.listToggle.length; i++) {
            this.listToggle[i].isChecked = false;
        }
    },
    readListToggle() {
        for (let i = 0; i < this.listToggle.length; i++) {
            if (this.listToggle[i].isChecked) {

                if (i == 0) {
                    this.OnClickAcPCard();
                } else {
                    this.OnClickUnAcPCard();
                }

                this.listToggle[i].isChecked = false;
                return true;
            }
        }
        this.Node_Toggle.active = false;
        return false;
    },
    OnClickAcPCard() {
        require('NetworkManager').getInstance().sendReiveCard(1);
    },
    OnClickUnAcPCard() {
        require('NetworkManager').getInstance().sendReiveCard(0);
    },
    showBigestCard(namePlayer) {
        if (namePlayer.localeCompare("SystemDealer") == 0) {
            if (this.is_show_border_dealer) return;

            for (let i = 0; i < this.listCardSystem.length; i++) {
                this.listCardSystem[i].setBorder(false);
            }

            let index = 0;

            for (let i = 0; i < this.listCardSystem.length; i++) {
                let numi = this.listCardSystem[i].N == 1 ? 14 : this.listCardSystem[i].N;
                let numindex = this.listCardSystem[index].N == 1 ? 14 : this.listCardSystem[index].N;
                if (numi > numindex) {
                    index = i;
                }
                else if (numi == numindex) {
                    if (this.listCardSystem[i].S > this.listCardSystem[index].S) {
                        index = i;
                    }
                }
            }

            this.listCardSystem[index].setBorder(true);
            this.is_show_border_dealer = true;
            return;
        }

        var player = this.getPlayer(namePlayer);
        if (player === null) return;

        for (let i = 0; i < player.vectorCard.length; i++) {
            player.vectorCard[i].setBorder(false);
        }
        let index = 0;

        for (let i = 0; i < player.vectorCard.length; i++) {
            let numi = player.vectorCard[i].N == 1 ? 14 : player.vectorCard[i].N;
            let numindex = player.vectorCard[index].N == 1 ? 14 : player.vectorCard[index].N;
            if (numi > numindex) {
                index = i;
            }
            else if (numi == numindex) {
                if (player.vectorCard[i].S > player.vectorCard[index].S) {
                    index = i;
                }
            }
        }

        player.vectorCard[index].setBorder(true);
    }
});
module.export = ShanClubGameView;