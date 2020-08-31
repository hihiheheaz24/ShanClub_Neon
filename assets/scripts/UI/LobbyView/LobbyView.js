const GameManager = require('GameManager');
const ChatWorldData = require('ChatWorldData')

cc.Class({
    extends: cc.Component,
    // name: "LobbyView",

    properties: {
        btn_back: {
            default: null,
            type: cc.Button
        },

        btn_tab_rich: {
            default: null,
            type: cc.Sprite
        },

        btn_tab_player: {
            default: null,
            type: cc.Sprite
        },
        btn_chat_game: {
            default: null,
            type: cc.Sprite
        },

        btn_chat_world: {
            default: null,
            type: cc.Sprite
        },
        listFrameBtnTab: {
            default: [],
            type: [cc.SpriteFrame]
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },

        listViewPlayer: {
            default: null,
            type: cc.ScrollView
        },

        btn_rank: {
            default: null,
            type: cc.Button
        },

        btn_setting: {
            default: null,
            type: cc.Button
        },

        btn_create: {
            default: null,
            type: cc.Button
        },

        btn_play_now: {
            default: null,
            type: cc.Button
        },

        edt_box: {
            default: null,
            type: cc.EditBox
        },

        // btn_search_table: {
        //     default: null,
        //     type: cc.Button
        // },

        item_create_prefab: {
            default: null,
            type: cc.Prefab
        },
        item_checkpass_prefab: {
            default: null,
            type: cc.Prefab
        },
        lb_GameName: {
            default: null,
            type: cc.Label
        },
        //////////////////////
        item_chat : {
            default : null,
            type : cc.Prefab
        },
        list_chat : {
            default : null,
            type : cc.ScrollView
        },
        edbox_chat:{
            default : null,
            type : cc.EditBox
        },
        btn_send : {
            default : null,
            type : cc.Button
        },
        vip_create_table: 11,
        mark_room_rich: 0,
        chip_room_rich: 0,
        cur_tab: 0,
        isShowBest: false,
        itemBetPool: null,
        dialogIVP: null,
        isFirt: true,
        ltv_data_list: [],
        room_vip_list: [],
        list_data_chat_game: [],
        list_data_reload_chat: [],
        listChildFalse: [],

        isReconnectGame:false,
        isChatWorld : false,
        indexChat : 0,
        isTouch : true
    },
     //=========== handle chat ===================//
     
    receiveDataChatGame(jsonData) {
        this.list_data_chat_game = [];
        var data = JSON.parse(jsonData.data);
        var start_index = 0;
        if (data.length > 25) {
            start_index = data.length - 25;
        }
        for (var i = start_index; i < data.length; i++) {
            var item = new ChatWorldData();
            item.name_player = data[i].Name;
            item.id_player = data[i].ID;
            item.content = data[i].Data;
            item.type = data[i].Type;
            item.vip_player = data[i].Vip;
            item.time = data[i].time;
            this.list_data_chat_game.push(item);
        }
        if (data.length > 0) {
            this.updateListChat();
        }
    },
    updateListChat() {
        for (let i = 0; i < this.list_chat.content.length; i++) {
            this.list_chat.content[i].destroy();
        }
        this.list_chat.content.removeAllChildren();

        cc.NGWlog("chay vao update list chat");
        this.list_data_reload_chat = [];
        if(this.isChatWorld) this.list_data_reload_chat = Global.ChatWorldView.list_data_chat_world;
        else this.list_data_reload_chat = this.list_data_chat_game;

        let coutMax = this.list_data_reload_chat.length;
        // let index = 0;
        // if (coutMax > 5) {
        //     index = coutMax - 5;
        // }
        let countNode = this.list_chat.content.childrenCount;
        this.indexChat = 0;
        for (let i = 0 ; i < coutMax; i++) {
            let data = this.list_data_reload_chat[i];
            let isAddChild = false;
            //let item = cc.instantiate(this.item_chat);
            let item = null;
            if (i < countNode) {
                item = this.list_chat.content.children[i];
            } else {
                item = cc.instantiate(this.item_chat);
                isAddChild = true;
            }
            //this.list_chat.content.addChild(item);
            item.active = true;
           // item.getComponent('ItemChatLobby').init(data);

            //let item = cc.instantiate(this.item_chat).getComponent("ItemChatLobby");
            //item.node.active = true;
            //item.init(data);
           // this.list_chat.content.addChild(item.node);
           //this.indexChat++;
           this.scheduleOnce(() => {
                if (isAddChild)
                    this.list_chat.content.addChild(item);
                item.getComponent('ItemChatLobby').init(data);
                this.list_chat.scrollToBottom(0.3);
            }, 0.03 * i);
         }
         this.list_chat.scrollToBottom(0.3);
        this.listChildFalse = [];
        for (let i = coutMax; i < countNode; i++) {
            this.listChildFalse.push(this.list_chat.content.children[i]);
        }
        // setTimeout(() => {
        //     cc.NGWlog("Scroll To Bottom");
        //     this.list_chat.scrollToBottom(0.3);
        // }, 60 * coutMax)
    },
    updateChatItem(data) {
        if(data.type == 1 && !this.isChatWorld) return;
        if(data.type == 2 && this.isChatWorld) return;

        let item = null;
        if (this.listChildFalse.length > 0) {
            cc.NGWlog('==================> chay vao day th1');
            item = this.listChildFalse[0];
            this.listChildFalse.splice(0, 1);
        } else {
            cc.NGWlog('==================> chay vao day th2');
            item = cc.instantiate(this.item_chat);
            this.list_chat.content.addChild(item);
        }
        item.active = true;
        item.getComponent('ItemChatLobby').init(data);
        if (data.id_player === require("GameManager").getInstance().user.id) {
            this.list_chat.scrollToBottom(0.3);
        }
        let offSet = this.list_chat.getScrollOffset();
        let maxOffSet = this.list_chat.getMaxScrollOffset();
        let lastItem = this.list_chat.content.children[this.list_chat.content.children.length - 1];
        if (offSet.y > maxOffSet.y - lastItem.height)
            this.list_chat.scrollToBottom(0.3);

    },
    editText() {
        if (this.edbox_chat.string.length > 0) {
            if (!this.btn_send.interactable)
                this.btn_send.interactable = true;
        } else {
            if (this.btn_send.interactable)
                this.btn_send.interactable = false;
        }
    },
    callback(){
        cc.NGWlog('chayyyyyyyyy lennnnnnnnnnnnnn toppppppppppppp');
    },
    //=========== end handle chat ===================//
    recivceData(jsonData) {
        let key = cc.js.formatStr("ltv_%d", require('GameManager').getInstance().curGameId);
        cc.sys.localStorage.setItem(key, jsonData.data);
        let data = JSON.parse(jsonData.data);
        this.ltv_data_list = [];
        this.room_vip_list = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].mark && data[i].room === 0) {
                let item = {
                    name: "ltvData"
                };
                item.maxAgCon = data[i].maxAgCon;
                item.mark = data[i].mark;
                item.chip_require = data[i].minAgCon;
                item.cur_user = data[i].currplay;
                item.ag = data[i].ag;
                item.room = data[i].room;
                this.ltv_data_list.push(item);
            }
            else{
                let itemVip = {
                        name: "RoomVipData"
                    };
            
                    itemVip.mark = data[i].mark;
                    itemVip.player = data[i].currplay;
                    itemVip.chip_require = data[i].minAgCon;
                    itemVip.table_id = 0;
                    itemVip.isPrivate = false
                    this.room_vip_list.push(itemVip);
            }
        }
        if (require('GameManager').getInstance().currentView == CURRENT_VIEW.LOBBY) {
            require("UIManager").instance.onHideLoad();
        }
        this.reuse();
        if (Global.LobbyView.node.getParent() !== null) {
            require('NetworkManager').getInstance().sendPromotionInfo();
        }
    },
    recivceDataRoomVip(jsonData) {
    },
    onLoad() {
        this.curMarkVip = 0;
        this.indexSprVip = 0;
        this.list_chat.node.on('scroll-to-top', this.callback, this);
        this.isTouch = true;
    },
    
    // onStart(){
    // },
    onEnable() {
        //Global.MainView._isClickGame = true;
        cc.NGWlog("nmAg=" + GameManager.getInstance().user.nmAg + "==countMailAg===" + Global.FreeChipView.countMailAg);
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.showPopupWhenLostChip();
        }, 500);
    },
    onDisable() {

    },
    setInfo() {
        this.isChatWorld = false;
        this.updateChip();
        this.btn_create.getComponentInChildren(cc.Label).string = GameManager.getInstance().getTextConfig('txt_create_table');
        this.lb_GameName.string = GameManager.getInstance().getTextConfig(GameManager.getInstance().curGameId);
        let length = GameManager.getInstance().listIp.length;
        for (var i = 0; i < length; i++) {
            var svip = GameManager.getInstance().listIp[i];
            if (svip.gameID === GameManager.getInstance().curGameId) {
                if (svip.vip != null)
                    this.vip_create_table = svip.vip.pop();

                if (svip.chipsRoom.length > 0) {
                    this.chip_room_rich = svip.chipsRoom[svip.chipsRoom.length - 2];
                    this.mark_room_rich = svip.chipsRoom[0];
                }
                break;
            }
            else
            this.vip_create_table = 0;
        }
        if (GameManager.getInstance().user.ag < this.chip_room_rich) {
            this.cur_tab = 0;
            this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[0];
            this.btn_tab_player.spriteFrame = this.listFrameBtnTab[1];
            require('NetworkManager').getInstance().sendRomVip();
            this.loadDataListView();
            this.cur_tab = 1;
            this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[1];
            this.btn_tab_player.spriteFrame = this.listFrameBtnTab[0];
            this.loadDataListView();
        }
        else {
            this.cur_tab = 1;
            this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[1];
            this.btn_tab_player.spriteFrame = this.listFrameBtnTab[0];
            this.loadDataListView();
            this.cur_tab = 0;
            this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[0];
            this.btn_tab_player.spriteFrame = this.listFrameBtnTab[1];
            require('NetworkManager').getInstance().sendRomVip();
            this.loadDataListView();
        }

        if (GameManager.getInstance().user.vip < this.vip_create_table) {
            cc.NGWlog("vip tao ban = " + this.vip_create_table + " vip user = " + GameManager.getInstance().user.vip);
            this.btn_create.interactable = false;
        }
        else {
            cc.NGWlog("vip tao ban = " + this.vip_create_table + " vip user = " + GameManager.getInstance().user.vip);
            this.btn_create.interactable = true;
        }

        // get edit box text
        var textFind = GameManager.getInstance().getTextConfig('txt_FindRoom').replace('...', '');
        this.edt_box.placeholder = textFind;

        // chat
        this.btn_chat_game.spriteFrame = this.listFrameBtnTab[0];
        this.btn_chat_world.spriteFrame = this.listFrameBtnTab[1];

        setTimeout(() => {
            require('UIManager').instance.onHideLoad();
        }, 700);
        
        if (Global.LobbyView.node.getParent() !== null) {
            require('NetworkManager').getInstance().getChatGame(require('GameManager').getInstance().curGameId);
        }
    },
    showPopupWhenLostChip(isBackFromGame = false, isChooseGame = false) {
        if (require("GameManager").getInstance().currentView == CURRENT_VIEW.LOGIN_VIEW) return;
        let money = GameManager.getInstance().user.ag;
        if (money <= 0) {
            let isInGame = false;
            if (require("GameManager").getInstance().gameView != null && !isBackFromGame) isInGame = true;
            let typeBTN = isInGame ? DIALOG_TYPE.ONE_BTN : DIALOG_TYPE.TWO_BTN;
            let textShow = GameManager.getInstance().getTextConfig("has_mail_show_gold");
            let textBtn1 = GameManager.getInstance().getTextConfig("txt_free_chip");
            let textBtn2 = GameManager.getInstance().getTextConfig("shop");
            let textBtn3 = GameManager.getInstance().getTextConfig("label_cancel");
            if (isInGame) {
                textShow = textShow.split(",")[0];
                textBtn1 = textBtn3;
                textBtn2 = textBtn3;
            }
            if (isChooseGame) textShow = GameManager.getInstance().getTextConfig("txt_not_enough_money_gl");
            if (GameManager.getInstance().user.nmAg > 0 || Global.FreeChipView.countMailAg > 0) {
                GameManager.getInstance().onShowWarningDialog(
                    textShow,
                    typeBTN,
                    textBtn1,
                    () => {
                        if (!isInGame)
                            require('UIManager').instance.onShowFreeChip();
                    },
                    textBtn2,
                    () => {
                        if (!isInGame)
                            require('UIManager').instance.onShowShop();
                    },
                );
            } else {
                textShow = GameManager.getInstance().getTextConfig("txt_not_enough_money_gl");
                require('GameManager').getInstance().onShowWarningDialog(
                    textShow,
                    typeBTN,
                    textBtn2,
                    () => {
                        if (!isInGame) {
                            require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
                            require('UIManager').instance.onShowShop();
                        }
                    },
                    textBtn3
                );
            }
        }
    },
    updateChip() {
        cc.NGWlog('chay vao day nao e oi');
        let money = GameManager.getInstance().user.ag
        this.lb_chip.string = GameManager.getInstance().formatNumber(money);
        this.loadDataListView();
    },

    loadDataListView() {
        if (this.listViewPlayer === null) return;
        let arrListRoom = [];
        let count = 0;
        let lisLTV = this.ltv_data_list;
        let listVip = this.room_vip_list;
        if (this.itemBetPool === null) {
            this.itemBetPool = require('UIManager').instance.lobbyItemPool
        }
        let agPLayer = GameManager.getInstance().user.ag;
        let scrollView = this.listViewPlayer;
        let parent = scrollView.content;
        var viewChidlren = parent.children;
        if (this.cur_tab === 1) {
            arrListRoom = lisLTV;
        };
        if (this.cur_tab === 0) {
            arrListRoom = listVip;
        };
        let lengt = arrListRoom.length;
        for (var i = 0; i < lengt; i++) {
            var ltv_data = arrListRoom[i];

            let item = viewChidlren[i];
            if (item == null || typeof item == 'undefined') {
                // if (this.itemBetPool < 1) this.itemBetPool.put(cc.instantiate(Global.ItemLobby.node));
                item = cc.instantiate(Global.ItemLobby.node)
                parent.addChild(item);
            }
            item.active = true;
            let itemCompoment = item.getComponent('ItemBetRoomView');
            if (typeof ltv_data.chip_require == 'undefined') ltv_data.chip_require = 0;
            var isSelect = agPLayer >= ltv_data.chip_require ? true : false;
            var isBest = false;
            if (agPLayer >= ltv_data.chip_require) {
                if (i < lengt - 1 && agPLayer < arrListRoom[i + 1].chip_require) {
                    isBest = true;
                }
            }

            if (this.cur_tab === 0) {
                if (this.curMarkVip === 0) this.curMarkVip = ltv_data.mark;
                if (ltv_data.mark !== this.curMarkVip && this.curMarkVip !== 0) {
                    this.curMarkVip = ltv_data.mark;
                    this.indexSprVip++;
                    if (this.indexSprVip > 2) this.indexSprVip = 0;
                }
                itemCompoment.isVip(this.indexSprVip);
                if (this.curMarkVip)
                    itemCompoment.setInfoVip(ltv_data.mark, ltv_data.player, isSelect, ltv_data.table_id, count, ltv_data.isPrivate);
            } if (this.cur_tab === 1) {
                itemCompoment.isnomal();
                itemCompoment.setInfo(ltv_data.mark, ltv_data.chip_require, ltv_data.cur_user, isSelect, isBest, count, ltv_data.maxAgCon, ltv_data.ag);
            }
            count++;
        }

        let lengtPlayer = parent.children.length;
        for (let i = lengt; i < lengtPlayer; i++) {
            parent.children[i].active = false;
        }
        scrollView.scrollToLeft(0);
    },

    showInvite(N, ag, tid, agu) {
        if (this.dialogIVP !== null) {
            this.dialogIVP.node.destroy();
            this.dialogIVP = null;
        }
        let msg = cc.js.formatStr(GameManager.getInstance().getTextConfig("invite_join_game"), N, GameManager.getInstance().formatNumber(ag), GameManager.getInstance().formatNumber(agu));
        let lb1 = GameManager.getInstance().getTextConfig("ok");
        let lb2 = GameManager.getInstance().getTextConfig("refuse");
        let lb3 = GameManager.getInstance().getTextConfig("refuse_all");

        this.dialogIVP = GameManager.getInstance().onShowWarningDialog(msg, DIALOG_TYPE.THREE_BTN, lb1, () => {
            // SocketSend:: sendJoinTable(GPManager -> tableIDInvite);
            // cc.NGWlog('--------> e vao ban day:   ' + tid);
            // GameManager.getInstance().onShowHideWaiting(true);
            //require('NetworkManager').getInstance().sendJoinTable(tid);
            require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayInvite_%d", require('GameManager').getInstance().curGameId));
            //require('NetworkManager').getInstance().sendCheckPass(tid);
            require('NetworkManager').getInstance().sendJoinTable(tid);

            this.dialogIVP = null;
        }, lb2, () => {
            // cc.NGWlog('--------> e ko vao ban dau:   ' + tid);
            this.dialogIVP = null;
        }, lb3, () => {
            GameManager.getInstance().invitePlayGame = false;
            // cc.NGWlog('--------> e ko bao gio vao ban dau:   ' + tid);
            this.dialogIVP = null;
        });
    },

    onClickBack() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);
        require('SoundManager1').instance.playButton()
        require('UIManager').instance.onHideView(this.node, true);

        this.isChatWorld = false;
        for (let i = 0; i < this.list_chat.content.length; i++) {
            this.list_chat.content[i].destroy();
        }
        this.list_chat.content.removeAllChildren();

    },
    onClickTabRich() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabRoom_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.cur_tab = 0;
        this.btn_tab_player.spriteFrame = this.listFrameBtnTab[1];
        this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[0];
        require('NetworkManager').getInstance().sendRomVip();
        this.loadDataListView();
    },

    onClickTabPlayer() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTabRoom_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.cur_tab = 1;
        this.btn_tab_rich.spriteFrame = this.listFrameBtnTab[1];
        this.btn_tab_player.spriteFrame = this.listFrameBtnTab[0];
        this.isDataPlayer = true;
        this.loadDataListView();
    },

    onClickRank() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowRankGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onShowTopRich();

    },

    onClickShop() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ClickShop_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        require("UIManager").instance.onShowShop();
    },

    onCreateTable() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCreateTable_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        var item = cc.instantiate(this.item_create_prefab).getComponent("CreateTableView");
        item.init();
        this.node.addChild(item.node);
    },

    onClickPlayNow() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickPlayNow_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayNow_%d", require('GameManager').getInstance().curGameId));
        this.btn_play_now.interactable = false;
        setTimeout(() => {
            if (this.node == null || typeof this.node == 'undefined') return;
            this.btn_play_now.interactable = true;
        }, 1500);
        require('SoundManager1').instance.playButton();
        require('UIManager').instance.onShowLoad();
        require('NetworkManager').getInstance().sendPlayNow(GameManager.getInstance().curGameId);

    },

    onClickSearch() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFindTable_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayJoin_%d", require('GameManager').getInstance().curGameId));
        require('SoundManager1').instance.playButton();
        var tableId = this.edt_box.string;
        if (tableId.length > 0) {
             require('NetworkManager').getInstance().sendJoinTable(tableId);
            //require('NetworkManager').getInstance().sendCheckPass(tableId);
        }
        this.edt_box.string = "";
    },

    onShowCheckPass() {
        var item = cc.instantiate(this.item_checkpass_prefab).getComponent("CheckPass");
        //item.init();
        this.node.addChild(item.node);
    },
    onClickChatGame(){
        this.isChatWorld = false;
        if(!this.isTouch){
            require('GameManager').getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('txt_touchslow'));
            return;
        }
        
        this.updateListChat();
        this.btn_chat_game.spriteFrame = this.listFrameBtnTab[0];
        this.btn_chat_world.spriteFrame = this.listFrameBtnTab[1];
        this.isTouch = false;
        setTimeout(() => {
            this.isTouch = true;
        }, 30 * this.list_data_reload_chat.length);
    },
    onClickChatWorld(){
        this.isChatWorld = true;
        if(!this.isTouch){
            require('GameManager').getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('txt_touchslow'));
            return;
        }
        
        this.updateListChat();
        this.btn_chat_game.spriteFrame = this.listFrameBtnTab[1];
        this.btn_chat_world.spriteFrame = this.listFrameBtnTab[0];
        this.isTouch = false;
        setTimeout(() => {
            this.isTouch = true;
        }, 30* this.list_data_reload_chat.length);
    },
    onClickSendChat(){
        require('SoundManager1').instance.playButton();
        if (this.edbox_chat.string.length > 0) {
            let str = this.edbox_chat.string;
            str = str.trim();
            if(this.isChatWorld)
            require('NetworkManager').getInstance().sendChatWorld(str, 1);
            else
            require('NetworkManager').getInstance().sendChatWorld(str, 2);
        }
        this.edbox_chat.string = "";
        this.btn_send.interactable = false;
    },
    reuse: function () {
        this.isDataPlayer = false;
        this.isDataVip = false
        this.setInfo();
    }
});