
const FriendSearchList = require('FriendSearchList')
cc.Class({
    extends: cc.Component,

    properties: {
        sp_avatar: {
            default: null,
            type: cc.Sprite
        },
        lb_vip: {
            default: null,
            type: cc.Label
        },
        lb_name: {
            default: null,
            type: cc.Label
        },
        lb_chip: {
            default: null,
            type: cc.Label
        },
        node_GiftView: {
            default: null,
            type: cc.Prefab
        },
        id_fr:0,
        str_type: "",
        name_fr: "",

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    init: function (avaId, name, vip, chip, id_friend, _type,fid) {
        this.name_fr = name;
        this.str_type = _type;
        if (name.length > 12) name = name.substring(0, 12) + "..";
        this.lb_name.string = name;
        this.lb_vip.string =  vip;
        this.lb_chip.string = chip;
        this.id_fr = id_friend;
        this.sp_avatar.node.getComponent("AvatarItem").loadTexture(avaId,this.name_fr,fid);

    },
    onClickFriend() {
        if (this.str_type === 'mail') {
            Global.MailView.onClickShowMessageDetail(this.id_fr, this.name_fr);
        }
        else {
            if (Global.GiftView.node.getParent() === null)
                require('UIManager').instance.onShowGift();
            Global.GiftView.init(this.id_fr);
            FriendSearchList.instance.onClose();
        }
    }
    
    // update (dt) {},
});