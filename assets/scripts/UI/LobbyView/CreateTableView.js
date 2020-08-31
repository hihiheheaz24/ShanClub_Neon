const GameManager = require("GameManager").getInstance()

var CreateTableView = cc.Class({
    extends: require('PopupEffect'),
    // name: "CreateTableView",

    properties: {
        btn_close: {
            default: null,
            type: cc.Button
        },

        lb_chip: {
            default: null,
            type: cc.Label
        },
        lb_min_chip: {
            default: null,
            type: cc.Label
        },

        sp_err_chip: {
            default: null,
            type: cc.Sprite
        },

        slider: {
            default: null,
            type: cc.Slider
        },

        sp_fill: {
            default: null,
            type: cc.Sprite
        },

        sp_err_slider: {
            default: null,
            type: cc.Sprite
        },

        lb_curBet: {
            default: null,
            type: cc.Label
        },

        btn_sub: {
            default: null,
            type: cc.Button
        },

        btn_add: {
            default: null,
            type: cc.Button
        },

        btn_confirm: {
            default: null,
            type: cc.Button
        },
        ed_pass: {
            default: null,
            type: cc.EditBox
        },
        listFrame : {
            default : [],
            type : [cc.SpriteFrame]
        },
        bkg_min_chip : cc.Sprite,

        cur_bet: 0,
        cur_per: 0,
        cur_index: 0,
        list_creat_table : [],
    },
    start () {
       // this.onPopOn();
    },

    init: function() {
        this.sp_err_chip.node.active = false;
        this.sp_err_slider.node.active = false;
        this.list_creat_table = Global.LobbyView.ltv_data_list.concat(Global.LobbyView.room_vip_list);
        this.cur_per = Math.round(9 / this.list_creat_table.length * 100) / 1000;
        this.lb_chip.string = GameManager.formatNumber(GameManager.user.ag);
        this.handleSlide();
    },

    onClickClose() {
        //this.node.destroy();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SoundManager1').instance.playButton();
        this.onPopOff();
    },

    onClickSub() {
        this.slider.progress = this.slider.progress - this.cur_per;
        this.handleSlide();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSub_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },

    onClickAdd() {
        this.slider.progress = this.slider.progress + this.cur_per;
        this.handleSlide();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickAdd_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickConfirm() {
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickConfirm_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('SMLSocketIO').getInstance().emitSIOCCCNew(cc.js.formatStr("ActionPlayCreate_%d", require('GameManager').getInstance().curGameId));

    //    if(this.ed_pass.string != ""){
    //     require("NetworkManager").getInstance().
    //     sendCreateTableWithPass(
    //         this.list_creat_table[this.cur_index].mark, "abcabc", parseInt(this.ed_pass.string)
    //         );
    //     }
    //     else{
            require("NetworkManager").getInstance().sendCreateTable(this.list_creat_table[this.cur_index].mark);
       //}
      // require('UIManager').instance.onHideView(this.node, true);
       require('SoundManager1').instance.playButton();
        this.onPopOff();
    },

    handleSlide() {
        this.slider.progress = Math.max(this.slider.progress, 0.1);
        this.slider.progress = Math.min(this.slider.progress, 0.9);

        this.cur_index = Math.round((this.slider.progress - 0.1) / this.cur_per * 100) / 100;
        this.cur_index = Math.max(this.cur_index, 0);
        this.cur_index = Math.min(this.cur_index, this.list_creat_table.length - 1);
        this.cur_index = Math.round(this.cur_index);
        
        this.lb_curBet.string = GameManager.formatMoney(this.list_creat_table[this.cur_index].mark);
        this.lb_min_chip.string = GameManager.formatMoney(this.list_creat_table[this.cur_index].chip_require);
        

        var chip_need = this.list_creat_table[this.cur_index].chip_require;
        if (GameManager.user.ag >= chip_need) {
            this.btn_confirm.node.scale = 1;
            this.sp_fill.node.active = true;
            this.sp_fill.node.setContentSize(cc.size(this.slider.progress * 900, this.sp_fill.node.getContentSize().height));

            this.sp_err_chip.node.active = false;
            this.sp_err_slider.node.active = false;
            this.bkg_min_chip.spriteFrame = this.listFrame[1];
        }
        else {
            this.sp_err_chip.node.active = true;
            this.sp_err_slider.node.active = true;
            this.sp_err_slider.node.setContentSize(cc.size(this.slider.progress * 900, this.sp_fill.node.getContentSize().height));

            this.btn_confirm.node.scale = 0;
            this.sp_fill.node.active = false;
            this.bkg_min_chip.spriteFrame = this.listFrame[0];
        }
    }
});
module.exports = CreateTableView;
