
cc.Class({
    extends: cc.Component,

    properties: {
        avatar: {
            default: null,
            type: cc.Sprite
        },
        lbName: {
            default: null,
            type: cc.Label
        },
        lbId: {
            default: null,
            type: cc.Label
        },
        lbPhone: cc.Label,
        _id1: null,
        urlContact: null,
        urlMess: "",
        Pnumber: "",
    },

    updateItem(itemData) {
        this._id1 = itemData.id;
        this.lbId.string = itemData.id;
        this.lbName.string = itemData.name;
        this.Pnumer = itemData.tel;
        this.lbPhone.string = itemData.tel;
        this.lbPhoneNum = itemData.tel;
        this.urlContact = itemData.msg_fb
        // urlmes
        // avatar
    },
    onCLickMess() {
        if (this.urlContact == null) this.urlContact = "http://bit.ly/wathana-agency";
        cc.sys.openURL(this.urlContact);
    },
    onClickPhone() {
        if(cc.sys.isNative){
            require("Util").onCallPhone(this.lbPhoneNum);
        }
    },
    onClick() {
        require('NetworkManager').getInstance().sendSearchFriendRequest(parseInt(this._id1));
    }
});
