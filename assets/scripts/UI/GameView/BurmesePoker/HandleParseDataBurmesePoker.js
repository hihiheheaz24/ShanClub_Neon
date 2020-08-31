var HandleParseDataBurmesePoker = cc.Class({
    properties: {
    },

    statics: {
        _handleParseDataGame(strData) {
            cc.NGWlog('--------------------------************************* 0');
            // if (require('GameManager').getInstance().gameView === null) return;
            var gameView = require('GameManager').getInstance().gameView;
            if (gameView === null) {
                cc.NGWlog('--------------------------************************* GOI LAI');
                // listEvt.push(strData);
                return;
            }
            cc.NGWlog('--------------------------************************* 1');

            var data = JSON.parse(strData);
            var evt = data.evt;

            cc.NGWlog('--------------------------************************* ' + evt);
            switch (evt) {
                case 'ctable': // tao ban
                    gameView.handleCTable(data.data);
                    break;
                case 'stable': // ready
                    gameView.handleSTable(data.data);
                    break;
                case 'vtable': //vao ban dang choi
                    gameView.handleVTable(data.data);
                    break;
                case 'jtable': // vao ban chua choi
                    gameView.handleJTable(data.data);
                    break;
                case 'rjtable': // reconnect
                    gameView.handleRJTable(data.data);
                    break;
                case 'cctable': // chuyen chu ban
                    gameView.handleCCTable(data);
                    break;
                case 'ltable': // play? roi ban
                    gameView.handleLTable(data);// {"evt":"ltable","Name":"coast123"}
                    break;
                case 'rtable': //player san sang
                    gameView.handleRTable(data);
                    break;
                case 'finish':
                    gameView.finishGame(data.data);
                    break;

                case 'timeToStart':
                    // string ti = gameData["data"].GetString();
                    gameView.showWaittingInfo(require('GameManager').getInstance().getTextConfig("rummy_starting_new_round"), parseInt(data.data));
                    let time = data.data;
                    break;
                case 'lc': //chia bai
                    // { "evt": "lc", "arr": [30, 42, 2, 7, 4, 36, 17, 3, 18, 43, 32, 31, 24], "nextTurn": "sondt123789", "deckCount": 69 }
                    gameView.chiabai(data);
                    break;
                case 'dc':
                    // { "N": "mya_mhuu", "C": [44], "evt": "dc", "NN": "fb.140872170086612" }
                    gameView.danhBai(data.N, data.C, data.NN);
                    break;
                case 'bc':
                    // { "N": "mya_mhuu", "C": 0, "evt": "bc" }
                    gameView.layBai(data.N, data.C, true);
                    break;
                case 'ac':
                    // { "N": "fb.140872170086612", "C": 44, "evt": "ac" }
                    gameView.layBai(data.N, data.C, false);
                    break;
                case 'ace':
                    //{"evt":"ace","data":"You can\u0027t discard a card which you\u0027ve just take"}
                    let msg = data.data;
                    require('GameManager').getInstance().onShowConfirmDialog(msg);
                    break;

                case 'cfd':
                    // { "evt": "cfd", "confirm": false, "user": xxx, "nextUser": xxx }
                    var nameP = data.user;//gameData["user"].GetString();
                    // //        bool confirm = gameData["confirm"].GetBool();
                    var turnName = data.hasOwnProperty('nextUser') ? data.nextUser : '';// gameData["nextUser"].IsNull() ? "" : gameData["nextUser"].GetString();
                    gameView.onDeclareMsgThisPlayer(nameP, turnName);
                    break;
                case 'NN':
                    gameView.turnName = data.data;
                    gameView.onTurn();
                    break;
                case 'bd':
                    // [Log] GameTransportPacket: { "N": "te.1543827277_21ea37c892f018b1", "NN": "sondt123789", "TotalAG": 14837, "evt": "bd", "agLose": 400, "diem": 40 } (NetworkManager.js, line 63)
                    var turnName = "";
                    if (data.hasOwnProperty("NN"))
                        turnName = data.NN;
                    var time = 20;
                    if (data.hasOwnProperty("T")) {
                        time = data.T;
                    }
                    gameView.upbai(data.N, turnName, data.TotalAG, data.agLose, time);
                    break;
                case 'nd':
                    gameView.showMsgDeclare(data.data);
                    break;
                case 'declare':
                    gameView.showDeclare(data.data, -1);//, gameData["diem"].GetInt());
                    break;
                case 'winner':
                    gameView.winner(data.data);
                    break;
                case 'chattable':
                    gameView.handleChatTable(data);
                    break;
                case 'am':
                    var name = data.N;
                    var m = data.M;
                    // game -> congTienAm(name, m);
                    break;
                case 'autoExit':
                    var isBack = parseInt(data.data);
                    // gameView.showBack(isBack === 1);
                    break;
                case 'tip':
                    break;

            }
        },
        _handleLeave() {
            var gameView = require('GameManager').getInstance().gameView;

            if (gameView !== null) {
                cc.NGWlog('------> ra khoi ban thoi!!!');
                gameView.onLeave();
            }
        }
    }
});

module.export = HandleParseDataBurmesePoker;