const GameManager = require('GameManager')
const NetWorkManager = require('NetworkManager')
const UIManager = require('UIManager')
cc.Class({
    extends: cc.Component,
    properties: {
        icCard: {
            default: null,
            type: cc.Sprite,
        },
        icWave: {
            default: null,
            type: cc.Sprite,
        },
        icMerchant: {
            default: null,
            type: cc.Sprite,
        },
        nodeCard : {
            default : null,
            type : cc.Node
        },
        listSpriteFrameNet : {
            default : [],
            type : [cc.Node]
        },
       listButtonTabLeft : [cc.Button],
       //item card
        listViewContent: {
            default: null,
            type: cc.ScrollView
        },
        prefabItemCard: {
            default: null,
            type: cc.Node
        },
        //agency
        prefabItemAgentcy: {
            default: null,
            type: cc.Prefab
        },
        prefabItemHistory: {
            default: null,
            type: cc.Node
        },
        prefabInputWave: {
            default: null,
            type: cc.Prefab
        },
        prefabGuide: {
            default: null,
            type: cc.Node
        },
        bkgGuide: cc.Sprite,
        btnNodeCard : cc.Node,
        btnNodeWave : cc.Node,
        btnNodeMerchant : cc.Node,
        btnNodeHistory : cc.Node,
        prov : 0,
    },

    start() {

        this.icCard.node.active = true;
        this.icWave.node.active = false;
        this.icMerchant.node.active = false;

        this.setInfo();
    },
    setInfo(){
        this.onClickTabNet(0);
        this.reloadListRight(1);
        this.listSpriteFrameNet[1].active = true;
        this.btnNodeCard.active = true;
        this.btnNodeWave.active = false;
        this.btnNodeMerchant.active = false;
        this.btnNodeHistory.active = false;
    },
    onClose(){
        require('UIManager').instance.onHideView(this.node, true);
    },

    onClickCard(){
        this.icCard.node.active = true;
        this.icWave.node.active = false;
        this.icMerchant.node.active = false;
        this.onClickTabNet(0);
        this.reloadListRight(1);
        this.listSpriteFrameNet[1].active = true;
        this.btnNodeCard.active = true;
        this.btnNodeWave.active = false;
        this.btnNodeMerchant.active = false;
        this.btnNodeHistory.active = false;
    },

    onClickWave(){
        this.icCard.node.active = false;
        this.icWave.node.active = true;
        this.icMerchant.node.active = false;
        this.reloadListRight(4);
        this.btnNodeCard.active = false;
        this.btnNodeWave.active = true;
        this.btnNodeMerchant.active = false;
        this.btnNodeHistory.active = false;
    },

    onClickMerchant(){
        this.icCard.node.active = false;
        this.icWave.node.active = false;
        this.icMerchant.node.active = true;
        this.reloadListMerchant();
        this.btnNodeCard.active = false;
        this.btnNodeWave.active = false;
        this.btnNodeMerchant.active = true;
        this.btnNodeHistory.active = false;
    },
    onClickTabNet(event, data){
        let index = parseInt(data);
        for(let i = 0; i < this.listSpriteFrameNet.length; i++){
            if(index == i)
            this.listSpriteFrameNet[i].active = true;
            else
            this.listSpriteFrameNet[i].active = false;
        }
        this.reloadListRight(index);
    },
    reloadListRight(type){
        // if(GameManager.getInstance().listAgDT == []) {
        //     require('UIManager').instance.onShowLoad();
        //     setTimeout(()=>{
        //         this.reloadListRight(type);
        //     }, 500);
        // }
        //require('UIManager').instance.onHideLoad();
        for (let i = 0; i < this.listViewContent.content.length; i++) {
            this.listViewContent.content[i].destroy();
        }
        this.listViewContent.content.removeAllChildren();
        
        let listNet = ["MPT", "Telenor", "Ooredoo", "Mytel","Wavemoney"];
        for(let i = 0 ; i < GameManager.getInstance().listAgDT.length ; i++){
            for(let j = 0 ; j < GameManager.getInstance().listAgDT[i].prov.length ; j ++){
                if(type != j) continue;
                if( GameManager.getInstance().listAgDT[i].prov[j] == false)
                    continue;
                    let item = cc.instantiate(this.prefabItemCard).getComponent("itemExchange");
                    item.node.active = true;
                    cc.NGWlog("===================> la " + type);
                    item.init(listNet[j],GameManager.getInstance().listAgDT[i].m,GameManager.getInstance().listAgDT[i].ag, type);

                    this.listViewContent.content.addChild(item.node);

            }
        }
    },
    reloadListMerchant(){
        for (let i = 0; i < this.listViewContent.content.length; i++) {
            this.listViewContent.content[i].destroy();
        }
        this.listViewContent.content.removeAllChildren();

        for (let i = 0; i < require('GameManager').getInstance().listAgency.length; i++) {
            let obj = cc.instantiate(this.prefabItemAgentcy).getComponent('ItemAgency');
            obj.node.active = true;
            obj.updateItem(require('GameManager').getInstance().listAgency[i]);
            this.listViewContent.content.addChild(obj.node);
        }
    },
    onClickGuide(){
        let opa = 255;
        this.prefabGuide.active = true;
        this.bkgGuide.node.scale = 0.8;
        this.bkgGuide.node.opacity = 200;
        let acScaleOut = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        let acFadeOut = cc.fadeTo(0.1, opa);
        this.bkgGuide.node.stopAllActions();
        this.bkgGuide.node.runAction(cc.spawn(acScaleOut, acFadeOut));
    },
    onClickCloseGuide(){
        let acScaleOut = cc.scaleTo(0.1, 0.8).easing(cc.easeBackIn());
        let acFadeOut = cc.fadeTo(0.1, 120).easing(cc.easeCircleActionIn());
        this.bkgGuide.node.stopAllActions();
        this.bkgGuide.node.runAction(cc.spawn(acScaleOut, acFadeOut));
        this.scheduleOnce(() => {
                this.prefabGuide.active = false;
        }, 0.1)
    },
    onClickHistory(){
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickHistory_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('NetworkManager').getInstance().sendDTHistory(require('GameManager').getInstance().user.id);
        this.btnNodeCard.active = false;
        this.btnNodeWave.active = false;
        this.btnNodeMerchant.active = false;
        this.btnNodeHistory.active = true;
        
        require('UIManager').instance.onShowLoad();
        this.icCard.node.active = false;
        this.icWave.node.active = false;
        this.icMerchant.node.active = false;
        
    },
    reloadListHistory(listItem){
        require('UIManager').instance.onHideLoad();

        for (let i = 0; i < this.listViewContent.content.length; i++) {
            this.listViewContent.content[i].destroy();
        }
        this.listViewContent.content.removeAllChildren();

        for (let i = 0; i < listItem.length; i++) {
            let obj = cc.instantiate(this.prefabItemHistory).getComponent('itemHistoryExchange');
            obj.node.active = true;
            obj.updateItem(listItem[i]);
            this.listViewContent.content.addChild(obj.node);
        }
    },
    cashOutReturn(data) {

        if (data.status) {
            require('NetworkManager').getInstance().sendUAG();
            require("UIManager").instance.onShowConfirmDialog(data.data);
        } else {
            require("UIManager").instance.onShowConfirmDialog(data.data);
        }
        require('NetworkManager').getInstance().sendUAG();
    },
    onCloseInputWaveId(){
        //this.prefabInputWave.active = false;
    }

});