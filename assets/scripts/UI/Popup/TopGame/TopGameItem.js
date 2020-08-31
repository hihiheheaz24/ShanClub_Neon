const GameManager = require('GameManager');

cc.Class({
    extends: cc.Component,

    properties: {
        // user properties
        userAvatar: {
            default: null,
            type: cc.Sprite,
        },

        userLbName: {
            default: null,
            type: cc.Label
        },

        userLbMoney: {
            default: null,
            type: cc.Label
        },

        userLbRank: {
            default: null,
            type: cc.Label
        },

        listTopRank: {
            default: [],
            type: [cc.Node]
        },

        lbGame: {
            default: null,
            type: cc.Label
        },

        data: {
            default: null,
            visible: false,
        },
        avatarTop: [cc.Sprite],
        idGame: null
    },
    onLoad(){
        this.node.scale=cc.v2(1,0);
    },
    onEnable(){
        this.node.runAction(cc.scaleTo(0.3,1,1).easing(cc.easeBackOut()));
    },
    onDisable(){
        this.node.scale=cc.v2(1,0);
        
    },
    init(list) {
        if (!list || list === undefined || list.length == 0) return;
        this.data = list;
        this.idGame = list[0].Gameid;
        let gameName = cc.js.formatStr("%s", list[0].Gameid);
        gameName = require("GameManager").getInstance().getTextConfig(gameName);

        this.data.name = gameName;
        this.lbGame.string = gameName;
        for (let index = 0; index < list.length ; index++) {
            const data = list[index];
            if (data.Id === GameManager.getInstance().user.id && data.R < list.length - 1) list.pop();
            if (data.R <= 3) {
                let name = this.listTopRank[data.R - 1].getChildByName('name').getComponent(cc.Label);
                name.string = data.N;
                if (name.string.length > 15) name.string = name.string.substring(0, 12) + '...';
                let chip = this.listTopRank[data.R - 1].getChildByName('lbChip').getComponent(cc.Label);
                chip.string = GameManager.getInstance().formatMoney(data.M);
                this.avatarTop[data.R - 1].node.getComponent("AvatarItem").loadTexture(data.Av, data.N, data.Faid);
                if (data.R === 1) {
                    name.node.color = cc.Color.YELLOW;
                    chip.node.color = cc.Color.YELLOW;
                }
            }
            if (data.Id === GameManager.getInstance().user.id || data.Id == 0) {
                //User data
                //-Avatar
                let avtId = GameManager.getInstance().user.avtId;
                this.userAvatar.node.getComponent("AvatarItem").loadTexture(avtId, data.N, data.Faid);
                //-Name
                let name = GameManager.getInstance().user.displayName;
                if (name.length > 12) {
                    name = name.substring(0, 12) + '...';
                }
                this.userLbName.string = name;
                //-Money
                this.userLbMoney.string = GameManager.getInstance().formatMoney(data.M);
                //-Rank 
                this.userLbRank.string = (data.R > 1000) ? '999+' : data.R;
            }
        }
    },

    onClickOpenTop() {
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickTab_%s", require('GameManager').getInstance().getCurrentSceneName()));
        if (this.data === null) return;
        require('SoundManager1').instance.playButton();
        if (Global.TopGameView.node.getParent())
            require('UIManager').instance.onHideView(Global.TopGameView.node, false);
        if (Global.TopListView.node.getParent() === null)
            require('UIManager').instance.instantiate_parent.addChild(Global.TopListView.node);
        Global.TopListView.init(this.data);
        Global.TopListView.setPlayer = false;
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.TOP_VIEW);

    }
});