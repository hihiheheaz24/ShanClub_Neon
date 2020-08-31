cc.Class({
    extends: require('PopupEffect'),

    properties: {
       edbEnterWaveId : {
           default : null,
           type : cc.EditBox
       },
       edbConfirmWaveId : {
        default : null,
        type : cc.EditBox
    },
    },

    start () {

    },
    onClose(){
        this.onPopOff(false);
    },
    onShow(){
        this.onPopOn();
    },
    onClickConfirm(){
        if(this.edbConfirmWaveId.string ===''|| this.edbEnterWaveId.string ==''){
            require("GameManager").getInstance().onShowConfirmDialog("WaveID can not be empty !!!");
        }
        else if(this.edbConfirmWaveId.string === this.edbEnterWaveId.string){
            require("NetworkManager").getInstance().sendDTConfirm(Global.ExchangeView.prov,this.edbConfirmWaveId.string,5);
            require('UIManager').instance.onShowLoad();
        }
        else{
            require("GameManager").getInstance().onShowConfirmDialog("WaveID is not the same");
           // SocketSend::sendDTConfirm(dataItem->m, last_wave_id, 5);
           
        }
    },
});
