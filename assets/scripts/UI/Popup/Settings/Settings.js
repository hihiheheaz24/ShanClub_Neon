
const GameManager = require('GameManager')
const UIManager = require("UIManager")
cc.Class({
    extends: require('PopupEffect'),

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },
        lbName: {
            default: null,
            type: cc.Label
        },
        lbID: {
            default: null,
            type: cc.Label
        },
        lbDisID: {
            default: null,
            type: cc.Label
        },
        lbVersion: {
            default: null,
            type: cc.Label
        },
        lbCurLang: {
            default: null,
            type: cc.Label
        },
        groupLanguage: {
            default: null,
            type: cc.Node
        },
        btnMusic: {
            default: null,
            type: cc.Sprite
        },
        btnSound: {
            default: null,
            type: cc.Sprite
        },

        spriteOnOff: {
            default: [],
            type: [cc.SpriteFrame]
        },
        bkgPopup: {
            default: null,
            type: cc.Node
        },
        btn_FanPage: cc.Button,
        btn_GroupFb: cc.Button,
        // title: cc.Label,

    },

    onLoad() {
        // Initialize the keyboard input listening

    },

    setInfo() {
        this.lbName.string = GameManager.getInstance().user.displayName;
        this.lbName.node.stopAllActions();

        this.lbName.node.stopAllActions();
        this.lbName.node.position=cc.v2(0,0);
        cc.NGWlog("WIDTH LB NAME=="+this.lbName.node.width);
        if (this.lbName.node.width > 280) {
           
            let acMove1 = cc.moveTo(2.0, -this.lbName.node.width *.3 , this.lbName.node.position.y);
            let acMove2 = cc.moveTo(2.0, 0, 0);
            let acMove3 = cc.moveTo(2.0, this.lbName.node.width *.3, this.lbName.node.position.y);
            this.lbName.node.runAction(cc.repeatForever(cc.sequence(acMove1, acMove2, acMove3,cc.delayTime(1.0), acMove2)));
        }

        this.lbID.string = GameManager.getInstance().user.id;
        var avt = GameManager.getInstance().user.avtId;
        this.avatar.node.getComponent("AvatarItem").loadTexture(avt, GameManager.getInstance().user.tinyURL);
        this.lbDisID.string = GameManager.getInstance().getTextConfig('txt_disid') + " " + require("GameManager").getInstance().disId;
        let strVersionA = "";
        if (require("GameManager").getInstance().versionA !== null) {
            strVersionA = " - " + require("GameManager").getInstance().versionA;
        }
        this.lbVersion.string = GameManager.getInstance().getTextConfig('txt_version') + " " + require("GameManager").getInstance().versionGame + strVersionA;//" - " + require('HotUpdate').instance.versionA;

        var languaSave = cc.sys.localStorage.getItem('language_save_2');
        var langua = (languaSave === null ? GameManager.getInstance().isLanguageEnDefault : parseInt(languaSave));
        var strLang = '';
        // cc.NGWlog("NGW:Curlang==== --------->   " + cc.sys.localStorage.getItem('language_save_2'));
        if (parseInt(languaSave) === 0 || languaSave === null) {
            strLang = GameManager.getInstance().getTextConfig('txt_language_en');
        } else {
            strLang = GameManager.getInstance().getTextConfig('txt_language_myanmar');
        }

        this.lbCurLang.string = strLang;
        let music = cc.sys.localStorage.getItem("music");
        if (music === "off") {
            this.btnMusic.spriteFrame = this.spriteOnOff[1];
        }
        else {
            this.btnMusic.spriteFrame = this.spriteOnOff[0];
        }
        let sound = cc.sys.localStorage.getItem("sound");
        if (sound === "off") {
            this.btnSound.spriteFrame = this.spriteOnOff[1];
        } else {
            this.btnSound.spriteFrame = this.spriteOnOff[0];
        }

        this.btn_FanPage.node.active = require("GameManager").getInstance().is_bl_fb;
        this.btn_GroupFb.node.active = require("GameManager").getInstance().is_bl_fb;

    },
    onMoveOut() {
        this.onPopOn();
        this.setInfo();
        if (this.groupLanguage.active)
            this.onClickHideGroupLanguage();
        // this.node.position = cc.v2(0, 0);
    },
    onClickQuit() {
        require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickQuitGame");
        require('SoundManager1').instance.playButton();
        GameManager.getInstance().onQuitGame();
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickQuitGame_%s", require('GameManager').getInstance().getCurrentSceneName()));


    },
    onClickLogout() {
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        cc.sys.localStorage.setItem('isLogOut', 'true');
        setTimeout(function () {
            //require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogOut");
            require("UIManager").instance.onLogout();

            GameManager.getInstance().setCurView(CURRENT_VIEW.LOGIN_VIEW);
        }, 500)
        // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickLogOut_%s", require('GameManager').getInstance().getCurrentSceneName()));
        //  require("GameManager").getInstance().setCurView(CURRENT_VIEW.LOGIN_VIEW);
    },

    onClickChangeLanguage() {
        require('SoundManager1').instance.playButton();
        this.groupLanguage.active = true;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickChangeLanguage_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },

    onClickHideGroupLanguage() {
        require('SoundManager1').instance.playButton();
        this.groupLanguage.active = false;
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseChangeLanguage_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },

    onClickChooseLanguage(event, indexLang) {
        require('SoundManager1').instance.playButton();
        this.groupLanguage.active = false;
        cc.NGWlog("IS LANGUAGE DEFAULT: ", GameManager.getInstance().isLanguageEnDefault);
        cc.NGWlog("IS LANGUAGE SELECT: ", indexLang);
        // if (`${GameManager.getInstance().isLanguageEnDefault}` === indexLang) return;
        if (GameManager.getInstance().isLanguageEnDefault === indexLang) return;
        try {

            // cc.NGWlog("======> click lang:  " + indexLang);
            if (indexLang === '0') {
                GameManager.getInstance().isLanguageEnDefault = 0;
            } else {
                GameManager.getInstance().isLanguageEnDefault = 1;
            }
            cc.sys.localStorage.setItem('language_save_2', GameManager.getInstance().isLanguageEnDefault);
            let length = GameManager.getInstance().listCCFS.length;
            cc.NGWlog("do dai list la== " + length);
            for (let i = 0; i < length; i++) {
                GameManager.getInstance().listCCFS[i].getText();
            }

            GameManager.getInstance().onShowConfirmDialog(GameManager.getInstance().getTextConfig('msg_change_language'), () => {
                GameManager.getInstance().onReconnect();
                //require('SMLSocketIO').getInstance().emitSIOCCCNew("ClickLogOut");
                this.onPopOff();
            });
        } catch (err) {
            cc.NGWlog("===========>  Error:  " + err);
        }
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickCloseChangeLanguage_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },
    onClickMusic() {
        let music = cc.sys.localStorage.getItem("music");
        let state = '';
        if (music == "off") {
            state = 'on';
            require('SoundManager1').instance.playMusicBackground();
            this.btnMusic.spriteFrame = this.spriteOnOff[0];
        }
        else {
            state = 'off';
            require('SoundManager1').instance.stopMusic();
            this.btnMusic.spriteFrame = this.spriteOnOff[1];
        }
        cc.sys.localStorage.setItem("music", state);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickMusic_%s", require('GameManager').getInstance().getCurrentSceneName()));

    },
    onClickSound() {
        var sound = cc.sys.localStorage.getItem("sound");
        if (sound === "off") {
            sound = "on";
            require('SoundManager1').instance.turnOnSFX();
            this.btnSound.spriteFrame = this.spriteOnOff[0];
        } else {
            sound = "off";
            require('SoundManager1').instance.playButton();
            require('SoundManager1').instance.turnOffSFX();
            this.btnSound.spriteFrame = this.spriteOnOff[1];
        }
        cc.sys.localStorage.setItem("sound", sound);
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSound_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickFeedBack() {
        require('SoundManager1').instance.playButton();
       if(require('GameManager').getInstance().is_bl_fb){
                require('UIManager').instance.onShowContactAdmin();
              }
              else{
                require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowFeedback_%s", require('GameManager').getInstance().getCurrentSceneName()));
                require('UIManager').instance.onShowFeedbackPopup();
              }
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickShowFeedback_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickClose: function (event, customEventData) {
        //*Effect
        // let _this = this;
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require("GameManager").getInstance().setCurView(CURRENT_VIEW.GAMELIST_VIEW);

    },

    onClickOpenFanpage() {
        require('SoundManager1').instance.playButton();
        if (cc.sys.isBrowser) window.open(require("GameManager").getInstance().fanpageURL);
        require('Util').openFanpage();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickFanpage_%s", require('GameManager').getInstance().getCurrentSceneName()));
    },

    onClickOpenGroup() {
        require('SoundManager1').instance.playButton();
        if (cc.sys.isBrowser) window.open(require("GameManager").getInstance().groupURL);
        else require('Util').openGroup();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickGroup_%s", require('GameManager').getInstance().getCurrentSceneName()));
    }
});
