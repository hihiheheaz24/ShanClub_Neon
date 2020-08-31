var HandleShanKoeMee =  cc.Class({
    extends: cc.Component,
    statics: {
        _handleParseDataGame(strData) {
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView === null) {
                return;
            }
            var data = JSON.parse(strData);
            var evt = data.evt;
            // cc.NGWlog("!>@@ ",evt);
            switch (evt) {
                case 'ctable':
                    cc.NGWlog('ctable ben bork game view');
                    gameView.handleCTable(data.data);
                    break;
                case 'cctable':
                    gameView.handleCCTable(data);
                    break;
                case 'stable':
                    gameView.handleSTable(data.data);
                    break;
                case 'vtable':
                    gameView.handleVTable(data.data);
                    break;
                case 'rjtable':
                    gameView.handleRJTable(data.data);
                    break;
                case 'jtable':
                    gameView.handleJTable(data.data);
                    break;

                //////////////////////////////////////////////
                case 'startdealer':
                    gameView.stateGame = 1;
                    gameView.setupNewGame(data.Dealer, data.T);
                    break;
                case 'lc':
                    gameView.handleLc(data);
                    break;
                case 'bm':
                    gameView.handleBm(data);
                    break;
                case 'bc':
                    gameView.handleBc(data);
                    break;
                case 'ltable':
                    gameView.handleLTable(data);
                    break;
                case 'finish':
                    gameView.handleFinish(data);
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
                case 'tip':
                    gameView.HandleTip(data);
                    break;
                case 'autoExit':
                    gameView.handleAutoExit(data);
                    break;
                case 'result_dealer':
                    gameView.changeDealer(data);
                    break;
                case 'leave_dealer':
                    gameView.cancelDealer(data);
                    break;
                case 'banker_info':
                    gameView.handleBankerInfo(data);
                    break;
                case 'timeToStart':
                    gameView.handleTimeToStart(data);
                    break;
                case 'cdco':
                    gameView.handleCdco(data);
                    break;
                case 'cbc':
                    gameView.handleCbc(data);
                    break;
                case 'finish_opt1':
                    gameView.handleFinishOpt1(data);
                    break;
                case 'banker_old_update ':
                    cc.NGWlog('!>@@@@@@@@@@@ handle Banker old update ',data);
                    break;
                case 'cShan':
                    gameView.handleCShan(data);
                    break;
            }

        },
        
        _handleLeave() {
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView.node !== null) {
                cc.NGWlog('chay vao hamOnleave -------------------------');
                gameView.onLeave();
            }
        },
    },

});
module.exports = HandleShanKoeMee;