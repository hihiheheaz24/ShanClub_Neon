const GameManager = require('GameManager')
cc.Class({
    extends: require("PopupEffect"),
    // name: TopGamePopup
    properties: {
        lbTitle: {
            default: null,
            type: cc.Label
        },

        listTopGame: {
            default: null,
            type: cc.ScrollView,
        },

        itemGame: {
            default: null,
            type: cc.Prefab
        },
        lbTimerEnd: {
            default: null,
            type: cc.Label
        },
        loadingNode:cc.Node,
        _rank_list: [],
        _show_list:[],
        itemPool: null,
        _countTopGame:0,
    },
    receiveData(data){

    },

    onMoveIn() {
        this.onMoveUp();
        this.listTopGame.scrollToTop(0.1);
        this.scheduleOnce(() => {
            this.getTopData();
            if(this._countTopGame != 0) this.activeAllItem();
        }, 1);
    },
    getTopData() {
        if (this._countTopGame == 0) {
          let listTopGame = this._rank_list;//[GAME_ID.BAUCUA, GAME_ID.BORK, GAME_ID.BLACKJACK, GAME_ID.BINH, GAME_ID.SHOW, GAME_ID.BACCARAT, GAME_ID.SESKU, GAME_ID.SLOT100LINE, GAME_ID.TIENLEN];    
          this._show_list = [];
          for (let i = 0; i < listTopGame.length; i++) {
            for (let child in GAME_ID) {
              if (GAME_ID[child] === listTopGame[i]) {
                this._show_list.push(listTopGame[i]);
              }
            }
          }
          for (let i = 0; i < listTopGame.length; i++) {
            this.node.runAction(cc.sequence(cc.delayTime(1.8 * i + 0.1), cc.callFunc(() => {
              require('NetworkManager').getInstance().getTopGameNew(this._show_list[i], 0);
            })))
          }
        }
        
      },
    updateList(list) {
        if (list.length == 0) return;
        
        let listContent = this.listTopGame.content;
        let listContentChildren = listContent.children;
        this.loadingNode.removeFromParent(false);
        let item = listContentChildren[this._countTopGame];
        if (item == null && item != this.loadingNode ) {
            item = cc.instantiate(this.itemGame);
            listContent.addChild(item);
        }
       
        item.active = true;
        let itemCp = item.getComponent('TopGameItem')
        if (itemCp.idGame == null) {
            itemCp.init(list);
        }
        if(this._countTopGame != this._rank_list.length - 1 && this._countTopGame + 1 == listContentChildren.length )listContent.addChild(this.loadingNode);
        this._countTopGame++;
       // this.listTopGame.scrollToBottom(0.5);
    },
    resetOnLogOut(){
        this._countTopGame = 0;
        let length = this.listTopGame.content.childrenCount;
        for(let i = 0 ; i < length ; i++){
            this.listTopGame.content.children[i].active = false;
        }
    },
    activeAllItem(){
        let length = this.listTopGame.content.childrenCount;
        for(let i = 0 ; i < length ; i++){
            this.scheduleOnce(()=>{
                this.listTopGame.content.children[i].active = true;
            },0.2 * i)
            
        }
    },
    onBack() {
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onHideView(this.node, true);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('GameManager').getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        let length = this.listTopGame.content.childrenCount;
        for(let i = 0 ; i < length ; i++){
            this.listTopGame.content.children[i].active = false;
        }
    }
    // update (dt) {},
});
