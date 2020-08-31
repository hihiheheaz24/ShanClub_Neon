const GameManager = require("GameManager");
const NetworkManager = require('NetworkManager');
cc.Class({
    extends: require('PopupEffect'),

    properties: {
        text1: {
            default: null,
            type: cc.Label
        },
        text2: {
            default: null,
            type: cc.Label
        },
        tagBonus: {
            default: null,
            type: cc.Sprite
        },
        edb_username: {
            default: null,
            type: cc.EditBox
        },
        edb_password: {
            default: null,
            type: cc.EditBox
        },
        edb_retype: {
            default: null,
            type: cc.EditBox
        },
        lb_Title: cc.Label,
        lb_Confirm: {
            default: null,
            type: cc.Label,
        },
        lbBonus: {
            default: null,
            type: cc.Label,
        },
        btn_confirm: {
            default: null,
            type: cc.Button
        }
    },
    onConfirm() {
        require('SoundManager1').instance.playButton();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickConfirm_%s", require('GameManager').getInstance().getCurrentSceneName()));

        if ((this.edb_username.string == "" && this.edb_username.node.getParent().active) || (this.edb_password.string == "" && this.edb_password.node.getParent().active) || (this.edb_retype.string == "" && this.edb_retype.node.getParent().active)) {
            require("UIManager").instance.onShowConfirmDialog(require("GameManager").getInstance().getTextConfig("txt_empty_noti"));
            return;
        }

        cc.NGWlog('LOG', GameManager.getInstance().typeLogin);
        if (this.edb_username.string !== '' && GameManager.getInstance().typeLogin === LOGIN_TYPE.FACEBOOK || require('GameManager').getInstance().typeLogin === LOGIN_TYPE.APPLE_ID || require('GameManager').getInstance().typeLogin === LOGIN_TYPE.FACEBOOK_INSTANT) { //
            NetworkManager.getInstance().sendChangeName(this.edb_username.string);
            this.btn_confirm.interactable = false;
        } else if (this.edb_password.string != '' && this.edb_password.string === this.edb_retype.string && GameManager.getInstance().typeLogin === LOGIN_TYPE.NORMAL) {

            if (this.edb_password.string === this.edb_username.string) {
                let message = require("GameManager").getInstance().getTextConfig("enter_new_pass");
                require("UIManager").instance.onShowConfirmDialog(message);
                return;
            }

            GameManager.getInstance().passwordToBeChanged = this.edb_password.string;
            NetworkManager.getInstance().senChangePass(this.edb_username.string, this.edb_password.string);
            this.btn_confirm.interactable = false;
        } else if (this.edb_password.string != '' && this.edb_password.string === this.edb_retype.string && GameManager.getInstance().typeLogin === LOGIN_TYPE.PLAYNOW) {
            if(cc.sys.localStorage.getItem("isReg") === 'true'){
                GameManager.getInstance().userNameRegTempl = this.edb_username.string;
                GameManager.getInstance().passRegTemple = this.edb_password.string;
                NetworkManager.getInstance().sendRegister(this.edb_username.string, this.edb_password.string, this.edb_retype.string);
                this.btn_confirm.interactable = false;
            }else{

                if (this.edb_password.string === this.edb_username.string) {
                    let message = require("GameManager").getInstance().getTextConfig("enter_new_pass");
                    require("UIManager").instance.onShowConfirmDialog(message);
                    return;
                }

                GameManager.getInstance().passwordToBeChanged = this.edb_password.string;
                NetworkManager.getInstance().senChangePass(this.edb_username.string, this.edb_password.string);
                this.btn_confirm.interactable = false;
            }    
        }
        else if (this.edb_password.string !== this.edb_retype.string && (GameManager.getInstance().typeLogin === LOGIN_TYPE.PLAYNOW || GameManager.getInstance().typeLogin === LOGIN_TYPE.NORMAL)){
            let message=require("GameManager").getInstance().getTextConfig("reg_not_pass");
            require("UIManager").instance.onShowConfirmDialog(message);
        }
    },
    onClose() {
        require('SoundManager1').instance.playButton();
        this.onPopOff();
        require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickBack_%s", require('GameManager').getInstance().getCurrentSceneName()));
        require('GameManager').getInstance().setCurView(CURRENT_VIEW.PROFILE_VIEW);
    },
    setInfo() {
        cc.NGWlog("vao day la dk vi no la playNow");
        this.onPopOn();
        this.edb_username.string = '';
        this.edb_password.string = '';
        this.edb_retype.string = '';
        this.btn_confirm.interactable = true;
        cc.NGWlog('LOG', GameManager.getInstance().typeLogin);
        if (GameManager.getInstance().typeLogin === LOGIN_TYPE.NORMAL) {
            cc.NGWlog("vao day la doi pass == vi no la normal");
            this.lb_Title.string = 'Change Password';
            this.lb_Title.fontSize = 35;
            this.text1.node.active = false;
            this.text2.node.active = false;
            this.tagBonus.node.active = false;
            this.edb_password.node.getParent().active = true;
            this.edb_retype.node.getParent().active = true;
            this.edb_username.placeholder = GameManager.getInstance().getTextConfig('old_pw')
            this.edb_password.placeholder = GameManager.getInstance().getTextConfig('new_pw')
            this.edb_retype.placeholder = GameManager.getInstance().getTextConfig('login_re_pass')
            this.edb_username.inputFlag = 0;
            this.lb_Confirm.string = GameManager.getInstance().getTextConfig('ok');
            this.lb_Confirm.fontSize = 37;
            this.bkg.height = 600;
        }
        else if (GameManager.getInstance().typeLogin === LOGIN_TYPE.FACEBOOK || require('GameManager').getInstance().typeLogin === LOGIN_TYPE.APPLE_ID || require('GameManager').getInstance().typeLogin === LOGIN_TYPE.FACEBOOK_INSTANT) {
            cc.NGWlog("vao day la doi ten")
            this.lb_Title.string = 'Rename';
            this.text1.node.active = false;
            this.text2.node.active = true;
            this.text2.string = cc.js.formatStr(require('GameManager').getInstance().getTextConfig("receive_chip"), require("GameManager").getInstance().agRename);
            this.lbBonus.string = "+" + require("GameManager").getInstance().agRename.toString();
            this.edb_password.node.getParent().active = false;
            this.edb_retype.node.getParent().active = false;
            this.edb_username.placeholder = GameManager.getInstance().getTextConfig('login_name');
            this.edb_username.inputFlag = cc.EditBox.InputFlag.DEFAULT;
            this.lb_Confirm.string = GameManager.getInstance().getTextConfig('ok');
            this.lb_Confirm.fontSize = 30;
        } else if (GameManager.getInstance().typeLogin === LOGIN_TYPE.PLAYNOW) {
          
            if( cc.sys.localStorage.getItem("isReg") === 'true') {
                this.lb_Title.string = 'Register';
                this.text1.node.active = true;
                this.text2.node.active = true;
                this.text2.string = cc.js.formatStr(require('GameManager').getInstance().getTextConfig("receive_chip"), require("GameManager").getInstance().agRename);
                this.lbBonus.string = "+" + require("GameManager").getInstance().agRename.toString();  
                this.edb_password.node.getParent().active = true;
                this.edb_retype.node.getParent().active = true;
                this.text1.string = GameManager.getInstance().getTextConfig('txt_protect_account');
                this.edb_username.placeholder = GameManager.getInstance().getTextConfig('login_name');
                this.edb_password.placeholder = GameManager.getInstance().getTextConfig('login_pass');
                this.edb_retype.placeholder = GameManager.getInstance().getTextConfig('login_re_pass');
                this.edb_username.inputFlag = 1;
                this.lb_Confirm.string = GameManager.getInstance().getTextConfig('register');
                this.lb_Confirm.fontSize = 30;
                this.bkg.height = 600;
            }
            else  {
                this.lb_Title.string = 'Change Password';
                this.lb_Title.fontSize = 35;
                this.text1.node.active = false;
                this.text2.node.active = false;
                this.tagBonus.node.active = false;
                this.edb_password.node.getParent().active = true;
                this.edb_retype.node.getParent().active = true;
                this.edb_username.placeholder = GameManager.getInstance().getTextConfig('old_pw')
                this.edb_password.placeholder = GameManager.getInstance().getTextConfig('new_pw')
                this.edb_retype.placeholder = GameManager.getInstance().getTextConfig('login_re_pass')
                this.edb_username.inputFlag = 0;
                this.lb_Confirm.string = GameManager.getInstance().getTextConfig('ok');
                this.lb_Confirm.fontSize = 37;
                this.bkg.height = 600;
            }

        }
    }
});
