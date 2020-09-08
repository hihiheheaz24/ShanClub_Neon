
var ShanGameView = cc.Class({
    extends: require("GameView2"),

    properties: {

        bet_box: {
            default: null,
            type: cc.Prefab,
        },

        banker_icon: {
            default: null,
            type: cc.Sprite,
        },

        DealerInGame: {
            default: null,
            type: require('DealerInGameView'),
        },

        Hide_BackGround: {
            default: null,
            type: cc.Prefab,
        },

        play_button: {
            default: null,
            type: cc.Prefab,
        },

        bet_button: {
            default: null,
            type: cc.Prefab,
        },

        drawn_countDown: {
            default: null,
            type: cc.Prefab,
        },

        CenterCountDown: {
            default: null,
            type: cc.Prefab,
        },

        potView: {
            default: null,
            type: cc.Node,
        },

        show_point: {
            default: null,
            type: cc.Prefab,
        },

        dealer_button: {
            default: null,
            type: cc.Prefab,
        },

        show_noti: {
            default: null,
            type: cc.Prefab,
        },

        show_moneyChange: {
            default: null,
            type: cc.Prefab,
        },

        round_left: {
            default: null,
            type: cc.Sprite,
        },

        swipe_ani: {
            default: null,
            type: sp.Skeleton,
        },

        chip_tip: {
            default: null,
            type: cc.Prefab,
        },

        wait_ani: {
            default: null,
            type: cc.Prefab,
        },

        dealer_dialog: {
            default: null,
            type: cc.Sprite,
        },
        isBanker: false,
        node_chat :{
            default : null,
            type : cc.Node
        },
    },

    onLoad (){
        this._super();
        cc.NGWlog("!> @load ShanGameView");
        this.plBets = [];
        this.playerCards = [[],[],[],[],[],[],[]];
        this.playerBets = [[],[],[],[],[],[],[]];
        this.playerPoints = [[],[],[],[],[],[],[]];
        this.currentBankerName = null;
        this.currentPoint = 0;
        this.currentRate = 0;
        this.potValue = 0;
        this.tableBaseBet = 0;
        this.activePlayer = [];
        this.playerAction = 0;
        this.isShan = false;
        this.isDealerGet = false;
        this.backUpCode = 0;
        this.bankerAg = 0;
        this.isCheckOpt1 = false;
        this.shanPlayers = [];
        this.arrWait = [[],[],[],[],[],[],[]];
        this.potView.getComponent('PotViewShan').initDefaultValue();
        this.timer = null;
        this.buttons = null;
        this.hideBg = null;
        this.is_show_border_dealer = false;
        this.isChangeCardToNormal = false;
        
    },

    handleCTable (strData){
        this._super(strData);
        cc.NGWlog("!> handleCTable",strData);
        this.currentBankerName = '';
        this.activePlayer = [...this.players];
    },
    
    handleCCTable (strData){
        this._super(strData);
        cc.NGWlog("!> handleCCTable",strData);
    },

    handleVTable (strData){
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.join_PLayer);
        this._super(strData);
        var data = JSON.parse(strData);
        this.tableBaseBet = data.M;
        cc.NGWlog("!> handelVTable",data,JSON.stringify(data));
        this.currentBankerName = data.bankerInfoTransfer.userName;
        this.activePlayer = [];
        for(let i = 0; i < data.ArrP.length; i ++){
            let player = this.getPlayer(data.ArrP[i].N)
            this.activePlayer.push(player);
        }
        this.sortActivePlayer();
        this.handleBankerInfo(data.bankerInfoTransfer);
        if(data.gameStatus !== 'WAIT_FOR_DECLARE'){
            this.viewExistingBet(data.ArrP);
            if(this.checkIsBet() == true){
                this.viewExistingCard(data.ArrP);
            }
        }
        
        this.setTimeout(()=>{
            this.showNoti(0,0)
        },500)
    },

    handleJTable(strData) {
        this._super(strData);
        cc.NGWlog("!> handleJTable", strData);
        let data = JSON.parse(strData);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.join_PLayer);
        this.activePlayer = [...this.players]
        this.sortActivePlayer();

    },

    handleRJTable (strData){
        this._super(strData);
        cc.NGWlog("!> handleRJTable",strData);
        this.destroyBets();
        this.destroyCards();
        var data = JSON.parse(strData);
        this.tableBaseBet = data.M;
        this.activePlayer = [];
        for(let i = 0; i < data.ArrP.length; i ++){
            let player = this.getPlayer(data.ArrP[i].N)
            this.activePlayer.push(player);
        }
        this.sortActivePlayer();
        this.handleBankerInfo(data.bankerInfoTransfer);
        this.viewExistingBet(data.ArrP);
        if(this.checkIsBet() == true){
            this.viewExistingCard(data.ArrP);
        }
    },

    handleSTable (strData){
        this._super(strData);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.join_PLayer);
        cc.NGWlog("!> handleSTable",strData);
        let data = JSON.parse(strData);
        this.tableBaseBet = data.M;
        this.destroyBets();
        this.destroyCards();
        this.activePlayer = [];
        for(let i = 0; i < data.ArrP.length; i ++){
            let player = this.getPlayer(data.ArrP[i].N)
            this.activePlayer.push(player);
        }
        this.sortActivePlayer();
    },

    viewExistingCard (data){
        for(let i = 0 ; i < data.length; i++){
            let index = this.getPlayerIndex(data[i].N);
            let player = this.getPlayer(data[i].N);
            for(let j = 0; j < data[i].Arr.length; j++){
                let pos = this.getHandPosition(index,0);
                let cardTemp = this.getCard();
                cardTemp.setTextureWithCode(data[i].Arr[j]);          
                this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD);
                player.vectorCard.push(cardTemp.node);
                if(player == this.thisPlayer){
                    cardTemp.node.setScale(0.6, 0.6);
                }else{
                    if(data[i].Arr[j] != 0){
                        cardTemp.node.setScale(0.55, 0.55);
                    }else{
                        cardTemp.node.setScale(0.4, 0.4);
                    }
                }
                cardTemp.node.position = pos;
                for(let k = 0; k < player.vectorCard.length; k++){
                    let isLarge = false;
                    if(data[i].Arr[j] != 0){
                        isLarge = true;
                    }
                    this.handleCardRotationAndOffset(player.vectorCard[k],k,player.vectorCard.length,index,isLarge);
                }
            }
            if(data[i].Arr[0] != 0){
                this.showPlayerPoint(player.vectorCard.length,index,data[i].score,data[i].rate);
            }
        }
    },

    viewExistingBet (data){
        for(let i = 0; i < data.length; i++){
            if(data[i].AGC > 0){
                let index = this.getPlayerIndex(data[i].N);
                let position = this.getBetPosition(index);
                let betVisualize = cc.instantiate(this.bet_box).getComponent('BetBox');
                betVisualize.showExistingBet(data[i].AGC,position);
                this.node.addChild(betVisualize.node,GAME_ZORDER.Z_CARD + 1);
                this.playerBets[index].push(betVisualize);
            }
        }
    },

    checkIsBet (){
        for(let i = 0; i < this.playerBets.length; i++){
            if(this.playerBets[i].length > 0){
                return true;
            }
        }
        return false;
    },

    updatePlayerInfo (player,money){
        player.ag = money;
        player.updateMoney();
    },

    getPlayersViewIndex (name){
        for(let i = 0; i < this.players.length; i++){
            if(name == this.players[i].pname){
                return i;
            }
        }
        return;
    },

    showWaitAni (type,index){
        //0 == bet 1 == card
        let pos;
        if(type == 0){
            pos = this.getBetPosition(index);
        }else{
            pos = this.getHandPosition(index,0);
        }
        
        if(this.getPlayerIndex(this.currentBankerName) != index && index != 0){
            let ani = cc.instantiate(this.wait_ani).getComponent('ShowWait');
            ani.setInfo(pos,type);
            ani.node.zIndex = GAME_ZORDER.Z_CARD + 10;
            this.node.addChild(ani.node);
            this.arrWait[index].push(ani.node);
        }
    },

    handleBm (data){
        cc.NGWlog("!>",data,JSON.stringify(data),"<!");
        if(data.timeAction == null){
            let playerBet = data.chipBet;
            let playerName = data.playerName;
            let id = this.getPlayerIndex(playerName);
            if(id != null){
                let len = this.arrWait[id].length
                for(let i = 0; i < len; i ++){
                    let wait = this.arrWait[id].pop();
                    wait.destroy();
                }
                
                this.playerBet(playerBet,playerName);
                this.playerAction ++;
                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.chipsAudio);
                let player = this.getPlayer(playerName);
                if(this.checkIfActive(player) == false){
                    this.activePlayer.push(player);
                    this.sortActivePlayer();
                }
                
                // if(playerBet > this.potValue){
                //     playerBet = this.potValue;
                // }
                let moneyLeft = Math.floor(Math.sqrt(Math.pow(player.ag - playerBet,2)));
                if(playerBet > player.ag){
                    moneyLeft = 0;
                }
                this.updatePlayerInfo(player,moneyLeft);
                if(player == this.thisPlayer){
                    if(this.buttons != null){
                        this.buttons.destroy();
                        // this.buttons.runAction(cc.sequence(cc.moveTo(0.5,cc.v2(0,-420)),cc.callFunc(()=>{
                        //     if(this.buttons != null){
                        //         this.buttons.destroy()
                        //     }
                        // })));
                        this.node_chat.active = true;
                    }
                }
                
                if(this.playerAction >= this.activePlayer.length - 1){
                    this.playerAction = 0;
                    this.clearTimer();
                    
                    this.setTimeout(()=>{
                        this.dealCardEffect();  
                    },500)
                }
            }
        }else{
           cc.log('')
            this.sortActivePlayer();
            for(let i = 0; i < this.activePlayer.length; i ++){
                this.showWaitAni(0,this.activePlayer[i]._indexDynamic);
            }
            this.playerAction = 0;
            // for(let i = 0; i < this.activePlayer.length; i++){
            //     if(this.activePlayer[i] == this.thisPlayer){
            //         this.stateGame = STATE_GAME.PLAYING;
            //         break;
            //     }
            // }
            this.showCenterTimer(8,1);
            if(this.checkIfActive(this.thisPlayer) == true){
                this.stateGame = STATE_GAME.PLAYING;
            }
            if(this.getPlayerIndex(this.currentBankerName) != 0 && this.checkIfActive(this.thisPlayer) == true){
                let betButton = cc.instantiate(this.bet_button).getComponent('BetButton');
                betButton.gameView = this;
                betButton.node.runAction(cc.fadeIn(0.5).easing(cc.easeCubicActionOut()));
                this.node.addChild(betButton.node,900,'BetButton');
                betButton.setInfo(this.tableBaseBet,this.potValue,this.thisPlayer.ag);
                this.buttons = betButton.node;
                this.node_chat.active = false;
            }
        }
    },

    fakeDealingEffect(plNumb) {
        cc.NGWlog("!> fake dealing card", this.activePlayer);
        for (let i = 0; i < plNumb; i++) {
            this.setTimeout(() => {
                if (this.node == null || typeof this.node == 'undefined' || this.activePlayer[i] == null) return;
                this.dealingCardsForPlayer(this.activePlayer[i]);
                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
                // require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.cardAudio);
            }, 100 * i)
        }
    },

    playerBet (playerBet,playerName){
        let player = this.getPlayer(playerName);
        let index = player._indexDynamic;
        let position = this.getBetPosition(index);
        if(index != null && position != null){
            let betVisualize = cc.instantiate(this.bet_box).getComponent('BetBox');
            betVisualize.setInfo(index,playerBet,position);
            this.node.addChild(betVisualize.node);
            this.playerBets[index].push(betVisualize);
        }
    },

    getBetPosition (index){
        switch (index) {
            case 0:
                return cc.v2(0,-75);
            case 1:
                return cc.v2(-240,-75);
            case 2:
                return cc.v2(-300,0);
            case 3:
                return cc.v2(-225,75);
            case 4:
                return cc.v2(225,75);
            case 5:
                return cc.v2(300,0);
            case 6:
                return cc.v2(240,-75);
        }
    },

    getPlayerIndex (playerName){
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].pname == playerName) {
                return this.players[i]._indexDynamic;
            }
        }
    },

    handleLTable (data){
        this.destroyCards();
        this.destroyBets();
        this._super(data);
        this.activePlayer = [...this.players];
        this.sortActivePlayer();
        if(this.players.length == 1) {
            this.clearTimer();
            this.stateGame == STATE_GAME.WAITING;
            if(this.getPlayerIndex(this.currentBankerName) == 0){
                this.returnMoneyToBanker();
            }
        }
    },

    handleBankerInfo (data){
        this.showPotValue(data.pot);
        this.potValue = data.pot;
        if(data.isCountDown == true){
            
            if(data.gameRemain != 0){
                this.setTimeout(()=>{
                    this.showNoti(1,data.gameRemain);
                },2000)
                let count = this.round_left.node;
                count.active = true;
                let lbl = count.getChildByName('gameLeft').getComponent(cc.Label);
                lbl.string = data.gameRemain;
                count.runAction(cc.sequence(
                    cc.scaleTo(0.2,1.6),
                    cc.scaleTo(0.4,1.4).easing(cc.easeCubicActionOut()),
                ));
            }
            if(data.gameRemain == 1){
                this.isDealerGet = true;
                this.bankerAg = data.ag;
            }
        }else{
            let count = this.round_left.node;
            count.active = false;
        }
        let player = this.getPlayer(data.userName);
        if(player.ag == data.ag + data.pot && data.pot > 0){
            this.showMoneyChange(1,"- " + data.pot,data.userName);
            this.isDealerGet = false;
            this.round_left.node.active = false;
        }
        this.updatePlayerInfo(player,data.ag);

        cc.NGWlog("!> handle banker info ",data,JSON.stringify(data));
        let index = this.getPlayerIndex(data.userName);
        let bankerIcon = this.banker_icon.node;
        bankerIcon.active = true;
        this.currentBankerName = data.userName;
        if(player == this.thisPlayer){
            this.isBanker = true;
        }else{
            this.isBanker = false;
        }
        let pos = this.getBetPosition(index);
        if(pos == null){
            return
        }
        if(this.currentBankerName == null || this.currentBankerName == ''){
            bankerIcon.position = pos;
        }else{
            bankerIcon.runAction(cc.moveTo(0.6,pos).easing(cc.easeCubicActionOut()));
        }
        bankerIcon.runAction(cc.sequence(cc.scaleTo(0.2,1.2),cc.scaleTo(0.2,1)));
    },

    updatePositionPlayerView (){
        this._super();
        this.keepTrackOfbanker();
    },

    keepTrackOfbanker (){
        let index = this.getPlayerIndex(this.currentBankerName);
        if(index != null){
            this.banker_icon.node.position = this.getBetPosition(index);
        }else{
            this.banker_icon.node.active = false;
            this.showPotValue(0);
        }
    },

    handleTimeToStart (data){
        this.destroyBets();
        this.destroyCards();
        for(let i = 0; i < 7; i++){
            let limit = this.playerPoints[i].length;
            for(let j = 0; j < limit; j++){
                let bet = this.playerPoints[i].pop();
                bet.destroy();
            }
        }
        let btn = this.node.getChildByName('dealerButton');
        if(btn != null){
            btn.destroy();
        }
        cc.NGWlog("!> handle time to start ",data,JSON.stringify(data));
        this.stateGame = STATE_GAME.WAITING;
        // for(let i = 0; i < this.players.length; i++){
        //     if(this.checkIfActive(this.players[i]) == false){
        //         this.activePlayer.push(this.players[i]);
        //     }
        // }
        // this.sortActivePlayer();
        // this.setTimeout(()=>{
        //     this.stateGame = STATE_GAME.PLAYING;
        // },data.timeAction)
        this.showCenterTimer(data.timeAction/1000,0);
        this.isChangeCardToNormal = false;
        // if(cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
    },

    showCenterTimer (time,type){
        this.clearTimer();
        
        let timer = cc.instantiate(this.CenterCountDown).getComponent('CenterCountDown');
        timer.startCountDown(time,type);
        this.node.addChild(timer.node,GAME_ZORDER.Z_CARD + 2,'timer');
        this.timer = timer.node;
        // this.setTimeout(()=>{
        //     this.timer = null;
        // },time * 1000)
    },

    clearTimer (){
        if(this.timer != null){
            this.timer.destroy();
            this.timer = null;
        }
    },

    handleLc (data) {
        cc.NGWlog("!> handlelc chia bai ", data, JSON.stringify(data));
        this.codeArr = [];
        let cardsArr = data.arr;
        this.currentPoint = data.score;
        this.currentRate = data.rate;
        this.setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            let Hide = this.showHideBackGround();
            this.showCountDownClock(22);
            for (let i = 0; i < this.thisPlayer.vectorCard.length; i++) {
                let card = this.thisPlayer.vectorCard[i];
                card.runAction(cc.rotateTo(0.8, 0).easing(cc.easeCubicActionOut()));
                let cardTemp = card.getComponent('Card');
                cardTemp.moveCardNoBug(0.8, cc.v2(0 + i * 7, 50));
                card.runAction(cc.scaleTo(0.8, 2.4).easing(cc.easeCubicActionOut()));
                card.runAction(cc.sequence(cc.delayTime(0.8), cc.scaleTo(0.2, 0.1, 2.5), cc.scaleTo(0.2, 2.5).easing(cc.easeCubicActionOut()), cc.scaleTo(0.2, 2.4).easing(cc.easeCubicActionOut())));
                card.runAction(cc.sequence(cc.delayTime(0.8), cc.skewTo(0.2, 0, 15), cc.callFunc(() => { card.skewY = -15 }), cc.skewTo(0.2, 0, 0).easing(cc.easeCubicActionOut())));
                this.setTimeout(() => {
                    if (this.node == null || typeof this.node == 'undefined') return;
                    card.getComponent('Card').setTextureWithCode(cardsArr[i], true, i != 0);
                    this.codeArr.push(cardsArr[i]);
                }, 1000)
                card.zIndex = 1001;
                this.setTimeout(() => {
                    if (this.node == null || typeof this.node == 'undefined') return;
                    this.handleTouchCardReveal(Hide, this.thisPlayer.vectorCard);
                }, 2000)
            }
        }, 2000);
        this.stateGame = STATE_GAME.PLAYING;
    },

    handleTouchCardReveal (target,cards){
        this.swipe_ani.node.active = true;
        this.swipe_ani.node.zIndex = 1010;
        if(cards == null || cards[0] == null || cards[1] == null){
            return;
        }
        let originPos = cards[1].position;

        target.on('touchstart', function(event) {
            this.swipe_ani.node.active = false;
        },this);

        target.on('touchmove', function(event) {
            let delta = event.touch.getDelta();
            cards[1].x += delta.x/2;
            cards[1].y += delta.y/2;
            // cards[0].x -= delta.x;
            // cards[0].y -= delta.y;
        });

        target.on('touchend', function(event) {
            let distance = Math.sqrt(Math.pow(cards[1].x - originPos.x,2) + Math.pow(cards[1].y - originPos.y,2));
            // let distance = Math.sqrt(Math.pow(cards[1].x - originPos.x,2));
            if(distance > 50){
                cards[1].getComponent('Card').moveCardNoBug(0.4,cc.v2(60,50));
                cards[0].getComponent('Card').moveCardNoBug(0.4,cc.v2(-60,50));
                cards[0].getComponent('Card').showShanCorner(true)
                this.manageGamePlayButton();
                target.off('touchmove');
                target.off('touchend');
                target.off('touchstart')
                target.off('touchend')
                this.swipe_ani.node.active = false;
            }else{
                this.swipe_ani.node.active = true;
            }
        },this);

        target.on('touchcancel', function(event) {
            cards[1].getComponent('Card').moveCardNoBug(0.4,cc.v2(60,50));
            cards[0].getComponent('Card').moveCardNoBug(0.4,cc.v2(-60,50));
            this.manageGamePlayButton();
            target.off('touchmove');
            target.off('touchend');
            target.off('touchcancel');
            target.off('touchstart')
            this.swipe_ani.node.active = false;
        },this);
    },

    manageGamePlayButton (){
        let btn = cc.instantiate(this.play_button).getComponent('PlayButton');
        btn.gameView = this;
        let index = this.getPlayerIndex(this.currentBankerName);
        let isBanker;
        if(index == 0){
            isBanker = true;
        }else{
            isBanker = false;
        }
        btn.setInfo(isBanker,this.isShan);
        this.node.addChild(btn.node,1001,'PlayButton');
    },

    allowBtnFinish (){
        let item = this.node.getChildByName('PlayButton');
        if(item != null){
            item.getComponent('PlayButton').showFinishBtn();
        }
    },

    changeCardBackToNomal (code){
        this.swipe_ani.node.active = false;
        if(this.isBanker == false){
            this.isChangeCardToNormal = true;
        }
        if(code == null){
            code = this.backUpCode;
        }
        for(let i = 0; i < this.thisPlayer.vectorCard.length; i++){
            let card = this.thisPlayer.vectorCard[i];
            card.runAction(cc.scaleTo(0.6,0.6).easing(cc.easeCubicActionOut()));
            card.skewY = 0
            card.zIndex = GAME_ZORDER.Z_CARD + i;
            let cardTemp = card.getComponent('Card');
            cardTemp.exitShanCard();
            if(this.thisPlayer.vectorCard.length > 2 && i == 1){
                card.getComponent('Card').setTextureWithCode(code);
            }
            this.setTimeout(()=>{
                this.handleCardRotationAndOffset(card,i,this.thisPlayer.vectorCard.length,0,true);
            },0.5)
        }this.setTimeout(()=>{
            this.showPlayerPoint(this.thisPlayer.vectorCard.length,0,this.currentPoint,this.currentRate);
            this.swipe_ani.node.active = false;    
        },400)
    },

    findPlayer (value,array){
        for(let i = 0; i < array.length; i++){
            if(value == array[i]){
                return true;
            }
        }
        return false;
    },

    dealingCardsForPlayer (player){
        let cardTemp = this.getCard();
        this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD + player.vectorCard.length);
        player.vectorCard.push(cardTemp.node);
        cardTemp.setTextureWithCode(0);
        if(player == this.thisPlayer){
            cardTemp.node.setScale(0.6, 0.6);
        }else{
            cardTemp.node.setScale(0.4, 0.4);
        }
        cardTemp.node.position = this.DealerInGame.node.position;
        cardTemp.node.rotation = -90;
        for(let i = 0; i < player.vectorCard.length; i++){
            this.handleCardRotationAndOffset(player.vectorCard[i],i,player.vectorCard.length,player._indexDynamic);
        }
    },

    handleCardRotationAndOffset(card, index, numbOfCard, playerSlot, isLarge = false, openCard = false) {
        let angle = 20 * index - 10 * (numbOfCard - 1);
        card.skewY = 0;
        card.runAction(cc.rotateTo(0.3, angle).easing(cc.easeCubicActionOut()));
        let offsetX = 20 * index - 10 * (numbOfCard - 1);
        if (isLarge == true) {
            offsetX = 30 * index - 15 * (numbOfCard - 1);
        }
        let offsetY = 0;
        if (numbOfCard == 3 && index != 1) {
            offsetY = -5;
        }
        let pos = this.getHandPosition(playerSlot, offsetX, offsetY);
        if (openCard == true) {
            pos = this.getHandPositionOpenCard(playerSlot, offsetX, offsetY);
        }

        card.getComponent('Card').moveCardNoBug(0.3, pos)
        card.zIndex = GAME_ZORDER.Z_CARD + index;
        // this.setTimeout(()=>{
        //     card.position = this.getHandPosition(playerSlot,offset);
        // },350)
    },

    getHandPosition (playerIndex,offsetX,offsetY = 0){
        switch (playerIndex) {
            case 0:
                return cc.v2(-100+120+offsetX,-175 + offsetY);
            case 1:
                return cc.v2(-450+120+offsetX,-175 + offsetY);
            case 2:
                return cc.v2(-500+80+offsetX,25 + offsetY);
            case 3:
                return cc.v2(-325+120+offsetX,200 + offsetY);
            case 4:
                return cc.v2(325-120+offsetX,200 + offsetY);
            case 5:
                return cc.v2(500-80+offsetX,25 + offsetY);
            case 6:
                return cc.v2(450-120+offsetX,-175 + offsetY);
        }
    },
    getHandPositionOpenCard(playerIndex, offsetX, offsetY = 0) {
        switch (playerIndex) {
            case 0:
                return cc.v2(-100 + 120 + offsetX, -175 + offsetY);
            case 1:
                return cc.v2(-450 + offsetX, -175 + offsetY);
            case 2:
                return cc.v2(-500 - 39 + offsetX, 20 + offsetY + 10);
            case 3:
                return cc.v2(-325 + offsetX, 215 + offsetY + 10);
            case 4:
                return cc.v2(325 + offsetX, 215 + offsetY + 10);
            case 5:
                return cc.v2(500 + 39 + offsetX, 20 + offsetY + 10);
            case 6:
                return cc.v2(450 + offsetX, -175 + offsetY);
        }
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

    handleBc (data){
        cc.NGWlog("!> handle Bc \n",data,JSON.stringify(data));
        if(data.timeAction != null ){
            this.showCenterTimer(25,2);
            this.sortActivePlayer();
            this.setTimeout(()=>{
                for(let i = 0; i < this.activePlayer.length; i ++){
                    this.showWaitAni(1,this.activePlayer[i]._indexDynamic);
                }
            },1000)
        }else{
            let player = this.getPlayer(data.N);
            let len = this.arrWait[player._indexDynamic].length
            for(let i = 0; i < len; i ++){
                let wait = this.arrWait[player._indexDynamic].pop();
                wait.destroy();
            }
            if(player._indexDynamic == 0){
                this.backUpCode = data.C;
                this.dealing3rdCardForYou(data.C);
                this.currentPoint = data.score;
                this.currentRate = data.rate;
                let countDown = this.node.getChildByName('DrawCountDown');
                if(countDown != null){
                    let insertCode = countDown.getComponent('DrawCountDownTime');
                    insertCode.insertBackUpCode(this.backUpCode);
                }
                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
            }else{
                this.setTimeout(()=>{
                    this.dealingCardsForPlayer(player);
                    require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
                },800)
            }
        }
        
    },

    drawTimeOut (code){
        let item = this.node.getChildByName('PlayButton');
        this.swipe_ani.node.active = false;
        if(item != null){
            item.getComponent('PlayButton').onFinishClick();
        }else{
            // let hide = this.node.getChildByName('Hide');
            if(this.hideBg != null){
                this.hideBg.off('touchstart');
                this.hideBg.off('touchmove');
                this.hideBg.off('touchend');
                this.hideBg.off('touchcancel')
                for(let i = 0; i < this.thisPlayer.vectorCard.length; i++){
                    let card = this.thisPlayer.vectorCard[i];
                    card.skewY = 0;
                }
                this.hideBg.destroy();
                this.changeCardBackToNomal(code);
                let timer = this.node.getChildByName('DrawCountDown');
                if(timer != null){
                    timer.destroy();
                }
            }
        }
    },

    foldCardForYou(card,code,time = 0.2,scale){
        card.runAction(cc.sequence(
            // cc.delayTime(delay),
            cc.scaleTo(time/2,0,scale),
            cc.callFunc(()=>{
                card.getComponent('Card').setTextureWithCode(code, true);
            }),
            cc.scaleTo(time/2,scale).easing(cc.easeCubicActionOut()),
        ));

        card.runAction(cc.sequence(
            // cc.delayTime(delay),
            cc.skewTo(time/2,0,-15),
            cc.callFunc(()=>{card.skewY = 15}),
            cc.skewTo(time/2,0,0).easing(cc.easeCubicActionOut()),
        ));
    },

    dealing3rdCardForYou (cardCode){
        this.allowBtnFinish();
        if(this.getPlayerIndex(this.currentBankerName) != 0){
            let cardTemp = this.getCard();
            this.node.addChild(cardTemp.node, GAME_ZORDER.Z_CARD + 1);
            this.thisPlayer.vectorCard.splice(1,0,cardTemp.node);
            cardTemp.setTextureWithCode(0);
            // cardTemp.node.rotation = -90;
            cardTemp.node.rotation = 0;
            cardTemp.node.position = cc.v2(0,400);
            cardTemp.node.setScale(1, 1);
            // cardTemp.node.zIndex = 1001;
            cardTemp.node.runAction(cc.scaleTo(0.4,2.4).easing(cc.easeCubicActionOut()));
            cardTemp.node.runAction(cc.rotateTo(0.4,0).easing(cc.easeCubicActionOut()));
            for(let i = 0; i < this.thisPlayer.vectorCard.length - 1; i++){
                let card = this.thisPlayer.vectorCard[i];
                card.zIndex = 1001 + i;
                card.getComponent('Card').moveCardNoBug(0.5,cc.v2(-60 + 120 * i,50));
            }
            this.foldCardForYou(this.thisPlayer.vectorCard[1],cardCode,0.6,2.4);
            this.thisPlayer.vectorCard[2].getComponent('Card').moveCardNoBug(0.5,cc.v2(67,50));
            this.thisPlayer.vectorCard[2].zIndex = 1003;
            let hide = this.node.getChildByName('Hide');
            this.setTimeout(()=>{
                if(this.isChangeCardToNormal == false){
                    this.handleTouch3rdCard(hide);
                }
            },500)
        }else if(this.getPlayerIndex(this.currentBankerName) == 0){
            let Hide = this.showHideBackGround();
            this.showCountDownClock(10);
            let cardTemp = this.getCard();
            this.node.addChild(cardTemp.node);
            cardTemp.setTextureWithCode(0);
            // cardTemp.node.rotation = -90;
            cardTemp.node.rotation = 0;
            cardTemp.node.position = cc.v2(0,400);
            cardTemp.node.setScale(1, 1);
            this.thisPlayer.vectorCard.splice(1,0,cardTemp.node);
            this.setTimeout(()=>{
                this.foldCardForYou(cardTemp.node,cardCode,0.4,2.4);
            },200)
            for(let i = 0; i < this.thisPlayer.vectorCard.length; i++){
                let card = this.thisPlayer.vectorCard[i];
                card.runAction(cc.rotateTo(0.4,0).easing(cc.easeCubicActionOut()));
                card.getComponent('Card').showShanCard();
                if(i != 1){
                    card.runAction(cc.scaleTo(0.4,2.4).easing(cc.easeCubicActionOut()));
                }
                let pos = cc.v2(-60 + i * 120,50);
                if(i == 2){
                    pos = cc.v2(67,50);
                }
                card.getComponent('Card').moveCardNoBug(0.5,pos,12);
                card.zIndex = 1001 + i;
            }
            
            this.setTimeout(()=>{
                if(this.isChangeCardToNormal == false){
                    this.handleTouch3rdCard(Hide,true);
                }
            },600)
        }
    },

    handleTouch3rdCard (target,isbanker = false){
        if(target == null){
            this.swipe_ani.node.active = false;
            return;
        }
        
        target.off('touchmove');
        target.off('touchend');
        target.off('touchstart');
        target.off('touchcancel');
        
        this.swipe_ani.node.active = true;
        this.swipe_ani.node.zIndex = 1010;
        let cards = this.thisPlayer.vectorCard;
        if(cards == null || cards[0] == null || cards[1] == null || cards[2] == null){
            return;
        }
        let originPos = cards[2].position;
        target.on('touchstart', function(event) {
            this.swipe_ani.node.active = false;
        },this);

        target.on('touchmove', function(event) {
            let delta = event.touch.getDelta();
            cards[2].x += delta.x;
            cards[2].y += delta.y;
            // cards[0].x -= delta.x;
            // cards[0].y -= delta.y;
        });

        target.on('touchend', function(event) {
            let distance = Math.sqrt(Math.pow(cards[2].x - originPos.x,2) + Math.pow(cards[2].y - originPos.y,2));
            // let distance = Math.sqrt(Math.pow(cards[2].x - originPos.x,2));
            if(distance > 30){
                cards[2].getComponent('Card').moveCardNoBug(0.4,cc.v2(120,50));
                cards[1].getComponent('Card').moveCardNoBug(0.4,cc.v2(0,50));
                cards[1].getComponent('Card').showShanCorner(true);
                cards[0].getComponent('Card').moveCardNoBug(0.4,cc.v2(-120,50));
                
                target.off('touchmove');
                target.off('touchend');
                target.off('touchstart');
                this.swipe_ani.node.active = false;
                if(isbanker == true){
                    this.setTimeout(()=>{
                        this.drawTimeOut(this.backUpCode);
                    },1000)
                }
            }else{
                this.swipe_ani.node.active = true;
            }
        },this);

        target.on('touchcancel', function(event) {
            cards[2].getComponent('Card').moveCardNoBug(0.4,cc.v2(55,50));
            cards[1].getComponent('Card').moveCardNoBug(0.4,cc.v2(50,50));
            cards[0].getComponent('Card').moveCardNoBug(0.4,cc.v2(-50,50));
            
            target.off('touchmove');
            target.off('touchend');
            target.off('touchcancel');
            target.off('touchstart')
            this.swipe_ani.node.active = false;
        },this);
    },

    showPotValue (value){
        
        this.potValue = value
        let string = value.toString();
        let arrString = string.split("");
        this.potView.getComponent('PotViewShan').showPot(arrString);
        this.potView.runAction(cc.sequence(cc.scaleTo(0.1,0.9).easing(cc.easeCubicActionOut()),cc.scaleTo(0.2,0.8).easing(cc.easeCubicActionOut())));
    },

    handleFinish (data){
        cc.NGWlog("!> handle finish" ,data,JSON.stringify(data));
        this.isShan = false;
        this.isCheckOpt1 = false;
        this.isChangeCardToNormal = false;
        this.clearTimer();
        let btn = this.node.getChildByName('dealerButton');
        if(btn != null){
            btn.destroy();
        }
        this.drawTimeOut(this.backUpCode);
        for(let j = 1; j < 7; j++){
            let len = this.arrWait[j].length
            for(let i = 0; i < len; i ++){
                let wait = this.arrWait[j].pop();
                wait.destroy();
            }
        }
        if(this.shanPlayers.length > 0){
            this.showShanPlayer();
        }
        this.shanPlayers = [];
        this.arrWait = [[],[],[],[],[],[],[]];
        let resultArray = data.declarePlayerTransferList;
        this.is_show_border_dealer = false;
        this.setTimeout(()=>{
            for(let i = 0; i < resultArray.length; i++){
                let player = this.getPlayer(resultArray[i].userName);
                if(resultArray[i].userName != this.currentBankerName){
                    this.updatePlayerInfo(player,resultArray[i].ag);
                }
                if(this.playerPoints[player._indexDynamic].length == 0){
                    this.showPlayerPoint(player.vectorCard.length,player._indexDynamic,resultArray[i].score,resultArray[i].rate);
                }
                
                if(player._indexDynamic != 0){
                    this.cardFoldUp(player.vectorCard,resultArray[i].arr,player._indexDynamic);
                }
                
                if(resultArray[i].winStatus == true){
                    this.playerPoints[player._indexDynamic][0].getComponent('PointView').showResultAni(1);
                    this.setTimeout(()=>{
                        this.showMoneyChange(0,resultArray[i].chipWin,resultArray[i].userName);
                    },4800)
                    
                    if(player == this.thisPlayer){
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.winAudio);
                        this.showHistory(0,resultArray[i].arr,resultArray[i].chipWin)
                    }
                    
                }else if(resultArray[i].winStatus == false && resultArray[i].userName != this.currentBankerName){
                    this.playerPoints[player._indexDynamic][0].getComponent('PointView').showResultAni(0);
                    this.setTimeout(()=>{
                        this.showMoneyChange(1,resultArray[i].chipWin,resultArray[i].userName);
                    },4800)
                    if(player == this.thisPlayer){
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.loseAudio);
                        this.showHistory(0,resultArray[i].arr,resultArray[i].chipWin)
                    }
                }else if(resultArray[i].userName == this.currentBankerName && this.isDealerGet == true){
                    let bankerGet = Math.floor(Math.sqrt(Math.pow(resultArray[i].ag - this.bankerAg,2)));
                    if(bankerGet == 0){
                        this.showNoti(0,3);
                        this.round_left.node.active = false;
                    }else{
                        this.setTimeout(()=>{
                            this.showMoneyChange(0,bankerGet,resultArray[i].userName);
                            this.showNoti(2,bankerGet);
                            this.round_left.node.active = false;
                            this.updatePlayerInfo(player,resultArray[i].ag);
                            if(player = this.thisPlayer){
                                require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.winAudio);
                            }
                        },4800)
                    }
                }
                if(resultArray[i].userName == this.currentBankerName){
                    this.showHistory(1,resultArray[i].arr);
                }
            }
    
            this.setTimeout(()=>{
                this.clearCards();
                this.clearBets(resultArray);
                this.clearPoint();
                this.stateGame = STATE_GAME.WAITING;
            },4000)
            this.setTimeout(()=>{
                this.showPotValue(data.pot);
                if(cc.sys.localStorage.getItem("isBack") == 'true') require('NetworkManager').getInstance().sendExitGame();
            },4800)
        },1000)
        this.setTimeout(()=>{
            this.showHighLightCards(resultArray);
        },1200)

        if(data.pot == 0 && this.isDealerGet == false){
            this.showNoti(0,3);
        }
        this.activePlayer = [...this.players];
        this.sortActivePlayer();
        
    },

    handleCbc (data){
        cc.NGWlog("!> handle Cbc",data,JSON.stringify(data));
        let playerIndex = this.getPlayerIndex(data.N);
        
        let index = this.getPlayerIndex(this.currentBankerName);
        if(data.userName == this.currentBankerName && index == 0){
            let btn = this.node.getChildByName('dealerButton');
            if(btn != null){
                btn.destroy();
            }
            this.clearTimer();
            if(this.isCheckOpt1 == true){
                this.isCheckOpt1 = false;
                this.showNoti(0,2);
            }
        }
        if(playerIndex != null){
            let len = this.arrWait[playerIndex].length
            for(let i = 0; i < len; i ++){
                let wait = this.arrWait[playerIndex].pop();
                wait.destroy();
            }   
        }
    },

    handleCShan (data){
        cc.NGWlog("!> handle cShan",data,index);
        this.shanPlayers.push(data);
        let index = this.getPlayerIndex(data.userName);
        if(index == 0){
            this.isShan = true;
        }
        // this.setTimeout(()=>{
        //     this.showShanPlayer();
        // },25000)
    },

    handleFinishOpt1 (data){
        cc.NGWlog("!> handle FinishOpt1",data,JSON.stringify(data));
        this.isCheckOpt1 = true;
        let resultArray = data.declarePlayerTransferList;
        this.setTimeout(()=>{
            for(let i = 0; i < resultArray.length; i++){
                let player = this.getPlayer(resultArray[i].userName);
                if(player._indexDynamic != 0 && resultArray[i].userName != this.currentBankerName){
                    this.cardFoldUp(player.vectorCard,resultArray[i].arr,player._indexDynamic);
                }
                if(this.playerPoints[player._indexDynamic].length == 0 && this.getPlayerIndex(this.currentBankerName) != player._indexDynamic){
                    this.showPlayerPoint(player.vectorCard.length,player._indexDynamic,resultArray[i].score,resultArray[i].rate);
                }
                if(resultArray[i].winStatus == true){
                    this.playerPoints[player._indexDynamic][0].getComponent('PointView').showResultAni(1);
                    if(this.getPlayerIndex(resultArray[i].userName) == 0){
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.winAudio);
                    }
                }else if(resultArray[i].winStatus == false && resultArray[i].userName != this.currentBankerName){
                    this.playerPoints[player._indexDynamic][0].getComponent('PointView').showResultAni(0);
                    if(this.getPlayerIndex(resultArray[i].userName) == 0){
                        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.loseAudio);
                    }
                }
            }
            this.showPotValue(data.pot);
        },2000)
    },

    handleCdco (data){
        cc.NGWlog("!> handle cdco",data,JSON.stringify(data));
        this.showShanPlayer();
        if(data.timeAction != null){
            this.showCenterTimer(data.timeAction / 1000,3);
        }else{
            this.clearTimer();
            if(this.getPlayerIndex(this.currentBankerName) != 0){
                this.drawTimeOut(this.backUpCode);
            }
        }
        if(data.timeAction != null && this.getPlayerIndex(this.currentBankerName) == 0){     
            let btn = this.node.getChildByName('dealerButton');
            if(btn != null){
                btn.destroy();
            }
            this.showDealerButton(data);
        }
        
        if(data.opt == 1){
            this.showNoti(0,1);
        }

        for(let j = 1; j < 7; j++){
            let len = this.arrWait[j].length
            for(let i = 0; i < len; i ++){
                let wait = this.arrWait[j].pop();
                wait.destroy();
            }
        }
    },

    showShanPlayer (){
        let len = this.shanPlayers.length;
        for(let i = 0; i < len; i++){
            let data = this.shanPlayers.pop();
            let player = this.getPlayer(data.userName);
            if(player._indexDynamic != 0 && player.vectorCard.length === 2){
                this.cardFoldUp(player.vectorCard,data.arr,player._indexDynamic);
                this.showPlayerPoint(player.vectorCard.length,player._indexDynamic,data.score,data.rate);
            }
        }
    },

    showDealerButton (data){
        let dealerButton = cc.instantiate(this.dealer_button).getComponent('DealerButton');
        dealerButton.setInfo(data);
        this.node.addChild(dealerButton.node,999,'dealerButton');
    },

    showPlayerPoint (playerCard,playerIndex,point,rate){
        let playerPoint = cc.instantiate(this.show_point).getComponent('PointView');
        let lastpoint = this.playerPoints[playerIndex].pop();
        if(lastpoint != null){
            lastpoint.destroy();
        }
        this.playerPoints[playerIndex].push(playerPoint.node);
        this.node.addChild(playerPoint.node,GAME_ZORDER.Z_CARD + 10);
        let pos = this.getHandPosition(playerIndex,0);
        playerPoint.setInfo(playerCard,point,pos,rate);
    },

    cardFoldUp (arrCardNode,codes,playerSlot){
        for(let i = 0; i < arrCardNode.length; i++){
            let card = arrCardNode[i];
            card.runAction(cc.sequence(cc.scaleTo(0.1,0.05,0.65),cc.scaleTo(0.1,0.65),cc.scaleTo(0.1,0.55)));
            card.runAction(cc.sequence(cc.skewTo(0.1,0,15),cc.callFunc(()=>{card.skewY = -15}),cc.skewTo(0.1,0,0)));  
            this.setTimeout(()=>{
                card.getComponent('Card').setTextureWithCode(codes[i]);
            },100)
            this.handleCardRotationAndOffset(card,i,arrCardNode.length,playerSlot,true);
        }
    },

    showNoti (type,value){
        let oldNoti = this.node.getChildByName('noti');
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.allinAudio);
        if(oldNoti != null){
            oldNoti.destroy();
        }
        let noti = cc.instantiate(this.show_noti).getComponent('ShowNoti');
        noti.showNoti(type,value);
        this.node.addChild(noti.node,999,'noti');
    },

    showMoneyChange (type,value,name){
        let player =this.getPlayer(name);
        let index = player._indexDynamic;
        let money = cc.instantiate(this.show_moneyChange).getComponent('MoneyChange');
        money.setInfo(type,value,index);
        this.node.addChild(money.node,GAME_ZORDER.Z_CARD + 2);
    },
    
    clearCards (){
        let delay = 0;
        let pos = this.DealerInGame.node.position;
        for(let i = 0; i < this.players.length; i++){
            let limit = this.players[i].vectorCard.length;
            for(let j = 0; j < limit; j++){
                require('SoundManager1').instance.dynamicallyPlayMusic('sounds/cardPlipBlackJack');
                let card = this.players[i].vectorCard.pop();
                card.getComponent('Card').setBorder(false);
                card.runAction(cc.sequence(cc.delayTime(delay),cc.moveTo(0.5,pos).easing(cc.easeCubicActionOut()),cc.callFunc(()=>{this.cardPool.put(card)})));
                card.runAction(cc.sequence(cc.delayTime(delay),cc.scaleTo(0.2,0.05,0.4),cc.scaleTo(0.2,0.4)));
                card.runAction(cc.sequence(cc.delayTime(delay),cc.scaleTo(0.2,0.05,0.4),cc.scaleTo(0.2,0.4)));
                card.runAction(cc.sequence(cc.delayTime(delay),cc.skewTo(0.2,0,-5),cc.callFunc(()=>{card.skewY = 5}),cc.skewTo(0.2,0,0)));
                this.setTimeout(()=>{
                    card.getComponent('Card').setTextureWithCode(0);
                    card.zIndex = GAME_ZORDER.Z_CARD + i + j;
                },200 + delay * 1000)
                card.runAction(cc.sequence(cc.delayTime(delay),cc.rotateTo(0.5,0).easing(cc.easeCubicActionOut())));                
                delay = delay + 0.1;
            }
        }
    },

    clearBets (data){
        this.setTimeout(()=>{
            require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_nemxu);
        },1000)
        for(let i = 0; i < data.length; i ++){
            let player = this.getPlayer(data[i].userName);
            if(player == null){
                return;
            }
            let index = player._indexDynamic;
            if(data[i].winStatus == false && data[i].isBanker == false){
                if(this.playerBets[index].length > 0){
                    let bet = this.playerBets[index].pop();
                    if(bet != null){
                        bet.betLose();
                    }
                }
            }else if(data[i].winStatus == true && data[i].isBanker == false){
                if(this.playerBets[index].length > 0){
                    let bet = this.playerBets[index].pop();
                    if(bet != null){
                        bet.betWin(index);
                    }
                }

                if(data[i].chipWin > 0){
                    let reward = cc.instantiate(this.bet_box).getComponent('BetBox');
                    this.node.addChild(reward.node,GAME_ZORDER.Z_CARD + 1);
                    let pos = this.getBetPosition(index);
                    let offset = 30;
                    if(index > 3){
                        offset = -30;
                    }
                    reward.doBetReward(index,pos,offset);
                }
            }
        }
    },

    clearPoint (){
        for(let i = 0; i < 7; i ++){
            if(this.playerPoints[i].length > 0){
                let l = this.playerPoints[i].length;
                for(let j = 0; j < l; j++){
                    let point = this.playerPoints[i].pop();
                    point.destroy();
                }
            }
        }
    },

    checkCanTip (){
        if(this.thisPlayer.ag >= 2 * this.tableBaseBet){
            return true;
        }
        return false;
    },

    onClickTip (){
        if(this.checkCanTip() == true){
            cc.NGWlog("on click send tip");
            require('NetworkManager').getInstance().sendTip();
            require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTip_%s", require('GameManager').getInstance().getCurrentSceneName()));
        }else{
            require('GameManager').getInstance().onShowConfirmDialog('you dont have enough money');
            // this.showNoti(3,'you dont have enough money');
        }
    },

    HandleTip (data){
        cc.NGWlog("!> handle tips ",data,JSON.stringify(data));
        let player = this.getPlayer(data.N);

        if (data.data != null) {
            require('GameManager').getInstance().onShowConfirmDialog(data.data);
            return;
        }

        this.updatePlayerInfo(player,player.ag - data.AGTip);
        this.showMoneyChange(3,data.AGTip,data.N);
        require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.tipAudio);
        this.showChipTipEffect(data.N);
        
        let dialog = this.dealer_dialog.node;
        dialog.active = false;
        dialog.opacity = 0;
        dialog.setScale(0.2,0.2);
        dialog.active = true;
        dialog.zIndex = GAME_ZORDER.Z_CARD + 20;
        let label = dialog.getChildByName('content');
        cc.NGWlog("!>@",label);

        let str1, str2;
        if(Math.random() < 0.5){
            str1 = 'thank you,\n';
        }else{
            str1 = 'yayy thanks,\n'
        }

        if(Math.random() < 0.2){
            str2 = '\nso lucky today';
        }else if(Math.random() < 0.4){
            str2 = '\n have a nice day!'
        }
        else if(Math.random() < 0.6){
            str2 = '\n "I appreciate it!'
        }
        else if(Math.random() < 0.8){
            str2 = '\n thanks a lot!'
        }else{
            str2 = '\n so nice of you!!'
        }
        label.getComponent(cc.Label).string = str1 + data.N + str2;
        dialog.width = 100 + data.N.length * 10;
        dialog.stopAllActions();
        dialog.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.4).easing(cc.easeCubicActionOut()),
                    cc.sequence(
                        cc.scaleTo(0.3,1.1),
                        cc.scaleTo(0.1,1),
                    )
                ),
                cc.delayTime(1.5),
                cc.spawn(
                    cc.fadeOut(0.3).easing(cc.easeCubicActionOut()),
                    cc.sequence(
                        cc.scaleTo(0.1,1.1).easing(cc.easeCubicActionOut()),
                        cc.scaleTo(0.4,0.2).easing(cc.easeCubicActionOut()),
                    )
                ),
                cc.callFunc(()=>{
                    dialog.active = false;
                })
            )
        )
    },

    showChipTipEffect (name){
        let chipTip = cc.instantiate(this.chip_tip).getComponent('ChipTip');
        let index = this.getPlayerIndex(name);
        chipTip.setInfo(index,this.DealerInGame.node.position);
        this.node.addChild(chipTip.node)
    },

    destroyCards (){
        this.clearPoint();
        for(let i = 0; i < this.players.length; i++){
            let limit = this.players[i].vectorCard.length;
            for(let j = 0; j < limit; j++){
                let card = this.players[i].vectorCard.pop();
                if(card != null){
                    card.destroy();
                }
            }
        }
    },

    destroyBets (){
        for(let i = 0; i < 7; i++){
            let limit = this.playerBets[i].length;
            for(let j = 0; j < limit; j++){
                let bet = this.playerBets[i].pop();
                if(bet != null){
                    bet.node.destroy();
                }
            }
        }
    },

    showHideBackGround (){
        let Hide = cc.instantiate(this.Hide_BackGround);
        Hide.zIndex = 1000;
        Hide.opacity = 0;
        Hide.runAction(cc.fadeTo(0.4,240));
        this.node.addChild(Hide,1000,'Hide');
        this.hideBg = Hide;
        return Hide;
    },

    showCountDownClock (time){
        let countDown = cc.instantiate(this.drawn_countDown).getComponent('DrawCountDownTime');
        countDown.gameView = this;
        countDown.startCountDown(time);
        this.node.addChild(countDown.node,1001,'DrawCountDown');
    },

    dealCardEffect (isPlay){
        for(let i = 0; i < this.players.length; i++){
            let player = this.players[i];
            if(this.playerBets[player._indexDynamic].length > 0 && this.checkIfActive(player) == false){
                this.activePlayer.push(player);
                this.sortActivePlayer();
            }
        }
        let plNumb = this.activePlayer.length
        let delay = 100 * plNumb;
        this.fakeDealingEffect(plNumb);
        this.setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.fakeDealingEffect(plNumb);
            // require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chiabai);
        },delay + 100)
        // require('SoundManager1').instance.dynamicallyPlayMusic(ResDefine.sound_chiabai);
    },

    sortActivePlayer (){
        let temp = [];
        let saveActive = [];
        saveActive = [...this.activePlayer];
        for(let i = 0; i < saveActive.length; i++){
            temp.push(saveActive[i]._indexDynamic);
        }
        temp.sort(function(a, b){return a-b});
        for(let i = 0; i < temp.length; i++){
            for(let j = 0; j < saveActive.length; j++){
                if(temp[i] == saveActive[j]._indexDynamic){
                    this.activePlayer[i] = saveActive[j];
                }
            }
        }
    },

    checkIfActive (player){
        for(let i = 0; i < this.activePlayer.length; i++){
            if(this.activePlayer[i] == player){
                return true;
            }
        }
        return false;
    },

    returnMoneyToBanker (){
        let banker = this.getPlayer(this.currentBankerName);
        if(banker != null){
            let moneyLeft = banker.ag + this.potValue;
            this.updatePlayerInfo(banker,moneyLeft);
            this.showNoti(2,this.potValue);
            this.isDealerGet = false;
            this.round_left.node.active = false;
            this.banker_icon.node.active = false;
            this.showPotValue(0);
            this.potValue = 0;
        }
    },

    showHistory (type,arrCard,chip){
        // 0 player 1 dealer
        if(type == 0){
            var str = "";
            if (chip < 0) {
                str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_lost').replace("%lld", -chip + "");
            } else if (chip > 0) {
                str = "Monica: " + require('GameManager').getInstance().getTextConfig('shan2_you_win').replace("%lld", chip + "");
            }
            this.itemChatNgoaiGame.setDataChatCard(str, arrCard);
            this.quickChat.addChatWithCard(str, arrCard);
        }else{
            var str = str = "Monica: " + require('GameManager').getInstance().getTextConfig('txt_cardofdealer').replace("%lld");
            this.itemChatNgoaiGame.setDataChatCard(str, arrCard);
            this.quickChat.addChatWithCard(str, arrCard);
        }
    },

    highlightBigestCard (player){
        let maxCard = player.vectorCard[0].getComponent('Card');
        for(let i = 0; i < player.vectorCard.length; i++){
            let card = player.vectorCard[i].getComponent('Card');
            if(this.getNCard(card) > this.getNCard(maxCard)){
                maxCard = card;
            }else if(this.getNCard(card) == this.getNCard(maxCard)){
                if(card.S >= maxCard.S){
                    maxCard = card;
                }
            }
        }
        maxCard.setBorder(true);
    },

    getNCard (card){
        if(card.N == 1){
            return 14;
        }else{
            return card.N;
        }
    },

    showHighLightCards (resultArray){
        let bankerPoint = 0;
        let bankerCards = 0;
        for(let i = 0; i < resultArray.length; i++){
            if(resultArray[i].isBanker == true){
                bankerPoint = resultArray[i].score;
                bankerCards = resultArray[i].arr.length;
                break;
            }
        }

        let count = 0;
        for(let i = 0; i < resultArray.length; i++){
            let player = this.getPlayer(resultArray[i].userName);
            if(resultArray[i].score == bankerPoint && resultArray[i].arr.length == bankerCards){
                count ++;
            }
        }
        if(count > 1){
            for(let i = 0; i < resultArray.length; i++){
                let player = this.getPlayer(resultArray[i].userName);
                if(resultArray[i].score == bankerPoint && resultArray[i].arr.length == bankerCards){
                    this.highlightBigestCard(player);
                }
            }
        }
    }

});
module.exports = ShanGameView;
