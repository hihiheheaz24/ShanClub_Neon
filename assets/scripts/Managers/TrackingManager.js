var TrackingManager = cc.Class({
  statics: {
    listGameIDWithKey: {},
    listBoolTracking: [],

    isTracking(trackingType, isNotOne = false, event = "") {
      cc.NGWlog("event =" + event);
      if (trackingType >= TrackingManager.listBoolTracking.length) {
        return false;
      }
      if (!isNotOne) {
        return TrackingManager.listBoolTracking[trackingType];
      } else {
        if (TrackingManager.listGameIDWithKey.hasOwnProperty(event)) {
          cc.NGWlog("da co roi ne");
          var listID = TrackingManager.listGameIDWithKey[event];
          let index = listID.indexOf(
            require("GameManager").getInstance().curGameId
          );
          if (index >= 0) {
            return false;
          } else {
            TrackingManager.listGameIDWithKey[event].push(
              require("GameManager").getInstance().curGameId
            );
          }
        } else {
          TrackingManager.listGameIDWithKey[event] = [].push(
            require("GameManager").getInstance().curGameId
          );
        }
        return true;
      }
    },
    SendTracking(type, msg = "") {
      if (TrackingManager.listBoolTracking.length <= 0) {
        for (let i = 0; i < TRACKING_TYPE.COUNT; i++) {
          TrackingManager.listBoolTracking.push(true);
        }
      }

      if (!TrackingManager.listBoolTracking[type]) return;
      let params = [];

      let event = TRACKING_TYPE.toString(type);//TrackingManager.toStringTrackingType(type);
      let str = "";

      if (event.slice(-1) === "_") {
        let plat = "WEB";
        if (IS_RUN_INSTANT_FACEBOOK) {
          plat = "FACEBOOK_INSTANT";
        } else if (cc.sys.isNative) {
          if (cc.sys.os === cc.sys.OS_ANDROID) {
            plat = "ANDROID";
          } else if (cc.sys.os === cc.sys.OS_IOS) {
            plat = "IOS";
          }
        }
        event = cc.js.formatStr(
          "%s_%s, %d",
          plat,
          event,
          require("GameManager").getInstance().curGameId
        ); //StringUtils:: format("%s%d", event.c_str(), GPManager -> curGameId);
        //cc.NGWlog('event truyen vao la===' + event);
      }

      // if (event == "ClickDt_FullChip" || event == "ClickDt_NotEnoughChip" || event == "Dt_Succes" || event == "Dt_Fail") {
      //     event += "_";
      //     event += msg;
      // }

      cc.NGWlog("==LOG Event Tracking:   " + event);

      params.push(event);
      params.push(require("GameManager").getInstance().deviceId);
      str += "deviceId,";
      if (
        type != TRACKING_TYPE.AppLauncher &&
        type != TRACKING_TYPE.LoginFail &&
        type != TRACKING_TYPE.ClickPlayNowFail &&
        type != TRACKING_TYPE.ContinueClick &&
        type != TRACKING_TYPE.LoginClick &&
        type != TRACKING_TYPE.LoginPlayNowClick &&
        type != TRACKING_TYPE.RegisterClick
      ) {
        params.push(
          require("GameManager")
            .getInstance()
            .user.id.toString()
        );
        str += "userID,";
      }

      let isCanSend = true;
      let isSendMuti = false;

      switch (type) {
        case TRACKING_TYPE.LoginSuccess:
        case TRACKING_TYPE.LoginPlayNowSuccess:
        case TRACKING_TYPE.FacebookSuccess:
        case TRACKING_TYPE.ContinueSuccess:
        case TRACKING_TYPE.RegisterSuccess: {
          params.push(
            require("GameManager")
              .getInstance()
              .user.vip.toString()
          );
          params.push(
            require("GameManager")
              .getInstance()
              .user.ag.toString()
          );

          str += "vip,";
          str += "ag,";

          break;
        }
        case TRACKING_TYPE.LoginFail: //thong bao fail
        case TRACKING_TYPE.LoginPlayNowFail: //thong bao fail
        case TRACKING_TYPE.FacebookFail: //thong bao fail
        case TRACKING_TYPE.ContinueFail: //thong bao fail
        case TRACKING_TYPE.RegisterFail: {
          //thong bao fail
          if (msg === "") {
            params.push(msg);

            str += "msg,";
          }
          break;
        }
        case TRACKING_TYPE.ClickPlayGame_:
        case TRACKING_TYPE.JoinTable_:
        case TRACKING_TYPE.PlayGame_:
        case TRACKING_TYPE.ClickPlayNow_:
        case TRACKING_TYPE.ClickPlayNowSuccess_:
        case TRACKING_TYPE.ClickPlayNowFail_:
        case TRACKING_TYPE.ClickCreateTable_:
        case TRACKING_TYPE.CreateTableSuccess_:
        case TRACKING_TYPE.CreateTableFail_:
        case TRACKING_TYPE.KickNotEnoughChip_:
        case TRACKING_TYPE.ClickChangeTable_:
        case TRACKING_TYPE.ClickHelpVip:
        case TRACKING_TYPE.ClickGuide_: {
          isSendMuti = true;
          isCanSend = TrackingManager.isTracking(type, true, event);
          if (isCanSend) {
            params.push(
              require("GameManager")
                .getInstance()
                .curGameId.toString()
            );
            str += "gameID,";
          }
          break;
        }
        case TRACKING_TYPE.UserActive:
        case TRACKING_TYPE.ClickPlayNow:
        case TRACKING_TYPE.ClickPlayNowSuccess:
        case TRACKING_TYPE.ClickPlayNowFail:
        case TRACKING_TYPE.ClickCreateTable:
        case TRACKING_TYPE.CreateTableSuccess:
        case TRACKING_TYPE.CreateTableFail: {
          params.push(
            require("GameManager")
              .getInstance()
              .curGameId.toString()
          );

          str += "gameID,";
          break;
        }
        case TRACKING_TYPE.ClickPayment_Button:
        case TRACKING_TYPE.ClickOffer:
        case TRACKING_TYPE.ClickPayment_IAP:
        case TRACKING_TYPE.ClickPC:
        case TRACKING_TYPE.ClickPS:
        case TRACKING_TYPE.PCS: {
          params.push(
            require("GameManager")
              .getInstance()
              .user.vip.toString()
          );
          str += "vip,";
          break;
        }
        case TRACKING_TYPE.IAP_Cancel: //itemid
        case TRACKING_TYPE.IAP_Success: //itemid
        case TRACKING_TYPE.IAP_Fail: //itemid
        case TRACKING_TYPE.ClickPSI: //lq
        case TRACKING_TYPE.PCF: //thong bao fail
        case TRACKING_TYPE.ClickPCI: //lq
        case TRACKING_TYPE.ClickPayment_IAP_Item: {
          //itemid
          params.push(
            require("GameManager")
              .getInstance()
              .user.vip.toString()
          );
          str += "vip,";
          if (msg === "") params.push(msg);
          str += "itemID,";

          break;
        }
        case TRACKING_TYPE.ClickDt:
        case TRACKING_TYPE.ClickDt_FullChip:
        case TRACKING_TYPE.ClickDt_NotEnoughChip:
        case TRACKING_TYPE.Dt_Succes:
        case TRACKING_TYPE.Dt_Fail: {
          isSendMuti = true;
          break;
        }
      }
      if (isCanSend) {
        //     str.pop_back();
        str = str.slice(0, -1);
        params.push(str);
        if (TrackingManager.listBoolTracking[type] || isSendMuti) {
          TrackingManager.listBoolTracking[type] = false;
          // cc.NGWlog('------------>0  ', params);
          // cc.NGWlog('----------->1  ', TrackingManager.listBoolTracking);
          // cc.NGWlog('----------->2  ', TrackingManager.listGameIDWithKey);
          require("Util").sendLogEvent(params);
        }
      }
    },
    /*toStringTrackingType(type)
        toStringTrackingType(type) {
          switch (type) {
            case TRACKING_TYPE.AppLauncher:
              return "AppLauncher";
            case TRACKING_TYPE.RegisterClick:
              return "RegisterClick";
            case TRACKING_TYPE.RegisterFail:
              return "RegisterFail";
            case TRACKING_TYPE.RegisterSuccess:
              return "RegisterSuccess";
            case TRACKING_TYPE.LoginClick:
              return "LoginClick";
            case TRACKING_TYPE.LoginSuccess:
              return "LoginSuccess";
            case TRACKING_TYPE.LoginPlayNowClick:
              return "LoginPlayNowClick";
            case TRACKING_TYPE.LoginPlayNowFail:
              return "LoginPlayNowFail";
            case TRACKING_TYPE.LoginPlayNowSuccess:
              return "LoginPlayNowSuccess";
            case TRACKING_TYPE.ContinueClick:
              return "ContinueClick";
            case TRACKING_TYPE.ContinueFail:
              return "ContinueFail";
            case TRACKING_TYPE.ContinueSuccess:
              return "ContinueSuccess";
            case TRACKING_TYPE.FacebookClick:
              return "FacebookClick";
            case TRACKING_TYPE.FacebookFail:
              return "FacebookFail";
            case TRACKING_TYPE.FacebookSuccess:
              return "FacebookSuccess";
            case TRACKING_TYPE.UserActive:
              return "UserActive";
            case TRACKING_TYPE.LoginFail:
              return "LoginFail";
            case TRACKING_TYPE.ClickPlayGame_:
              return "ClickPlayGame_";
            case TRACKING_TYPE.JoinTable_:
              return "JoinTable_";
            case TRACKING_TYPE.PlayGame_:
              return "PlayGame_";
            case TRACKING_TYPE.ClickChatWorld:
              return "ClickChatWorld";
            case TRACKING_TYPE.ClickTopRick:
              return "ClickTopRick";
            case TRACKING_TYPE.ClickProfile:
              return "ClickProfile";
            case TRACKING_TYPE.ClickRename:
              return "ClickRename";
            case TRACKING_TYPE.ClickBank:
              return "ClickBank";
            case TRACKING_TYPE.ClickFriend:
              return "ClickFriend";
            case TRACKING_TYPE.ClickShareFB:
              return "ClickShareFB";
            case TRACKING_TYPE.ClickShareMesFriend:
              return "ClickShareMesFriend";
            case TRACKING_TYPE.ClickShareLine:
              return "ClickShareLine";
            case TRACKING_TYPE.ClickMailBox:
              return "ClickMailBox";
            case TRACKING_TYPE.ClickFreeChip:
              return "ClickFreeChip";
            case TRACKING_TYPE.ClickVideo:
              return "ClickVideo";
            case TRACKING_TYPE.ClickInvite:
              return "ClickInvite";
            case TRACKING_TYPE.ClickFeedback:
              return "ClickFeedback";
            case TRACKING_TYPE.ClickCode:
              return "ClickCode";
            case TRACKING_TYPE.ClickUrl:
              return "ClickUrl";
            case TRACKING_TYPE.ClickDt:
              return "ClickDt";
            case TRACKING_TYPE.ClickDt_FullChip:
              return "ClickDt_FullChip";
            case TRACKING_TYPE.ClickDt_NotEnoughChip:
              return "ClickDt_NotEnoughChip";
            case TRACKING_TYPE.Dt_Succes:
              return "Dt_Succes";
            case TRACKING_TYPE.Dt_Fail:
              return "Dt_Fail";
            case TRACKING_TYPE.ClickSetting_Button:
              return "ClickSetting_Button";
            case TRACKING_TYPE.ClickSetting_Group:
              return "ClickSetting_Group";
            case TRACKING_TYPE.ClickSetting_Fanpage:
              return "ClickSetting_Fanpage";
            case TRACKING_TYPE.ClickSetting_Quit:
              return "ClickSetting_Quit";
            case TRACKING_TYPE.ClickPayment_Button:
              return "ClickPayment_Button";
            case TRACKING_TYPE.ClickOffer:
              return "ClickOffer";
            case TRACKING_TYPE.ClickPayment_IAP:
              return "ClickPayment_IAP";
            case TRACKING_TYPE.ClickPayment_IAP_Item:
              return "ClickPayment_IAP_Item";
            case TRACKING_TYPE.IAP_Cancel:
              return "IAP_Cancel";
            case TRACKING_TYPE.IAP_Success:
              return "IAP_Success";
            case TRACKING_TYPE.IAP_Fail:
              return "IAP_Fail";
            case TRACKING_TYPE.ClickPC:
              return "ClickPC";
            case TRACKING_TYPE.ClickPS:
              return "ClickPS";
            case TRACKING_TYPE.ClickPCI:
              return "ClickPCI";
            case TRACKING_TYPE.PCS:
              return "PCS";
            case TRACKING_TYPE.PCF:
              return "PCF";
            case TRACKING_TYPE.ClickPSI:
              return "ClickPSI";
            case TRACKING_TYPE.ClickBack_:
              return "ClickBack_";
            case TRACKING_TYPE.ClickCreateInTable_:
              return "ClickCreateInTable_";
            case TRACKING_TYPE.ClickChangeTable_:
              return "ClickChangeTable_";
            case TRACKING_TYPE.ClickGuide_:
              return "ClickGuide_";
            case TRACKING_TYPE.KickNotEnoughChip_:
              return "KickNotEnoughChip_";
            case TRACKING_TYPE.ClickPlayNow:
              return "ClickPlayNow";
            case TRACKING_TYPE.ClickPlayNowSuccess:
              return "ClickPlayNowSuccess";
            case TRACKING_TYPE.ClickPlayNowFail:
              return "ClickPlayNowFail";
            case TRACKING_TYPE.ClickPlayNow_:
              return "ClickPlayNow_";
            case TRACKING_TYPE.ClickPlayNowSuccess_:
              return "ClickPlayNowSuccess_";
            case TRACKING_TYPE.ClickPlayNowFail_:
              return "ClickPlayNowFail_";
            case TRACKING_TYPE.ClickCreateTable:
              return "ClickCreateTable";
            case TRACKING_TYPE.CreateTableSuccess:
              return "CreateTableSuccess";
            case TRACKING_TYPE.CreateTableFail:
              return "CreateTableFail";
            case TRACKING_TYPE.ClickCreateTable_:
              return "ClickCreateTable_";
            case TRACKING_TYPE.CreateTableSuccess_:
              return "CreateTableSuccess_";
            case TRACKING_TYPE.CreateTableFail_:
              return "CreateTableFail_";
            case TRACKING_TYPE.ClickHelpVip:
              return "ClickHelpVip";
            case TRACKING_TYPE.COUNT:
              break;
          }
    
          return "";
        },
    */
    SendTrackingSIO(eventName, data) {
      // require('MySocketIO').emitSIO(eventName, data, handleEvent);
      require("MySocketIO").emitSIO(eventName, data, "");
    },

    sioFireEvenConnectHandle() {
      let data = {
        disid: require("GameManager").getInstance().disId,
        bundle: require("GameManager").getInstance().bundleID,
        app_version: require("GameManager").getInstance().versionGame,
        did: require("GameManager").getInstance().deviceId,
        device_OS_version: "5.0", //de tam
        operator: OPERATOR
      };
      let plat = "WEB";
      if (IS_RUN_INSTANT_FACEBOOK) {
        plat = "FACEBOOK_INSTANT";
      } else {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
          plat = "ANDROID";
        } else if (cc.sys.os === cc.sys.OS_IOS) {
          plat = "IOS";
        }
      }

      data.device_OS = plat;
      let fromLogin = cc.sys.localStorage.getItem("sio_fromlogin");
      if (fromLogin === null) {
        data.scene_name = CURRENT_VIEW.LOGIN_VIEW;
        cc.sys.localStorage.setItem("sio_fromlogin", "0123456789");
      } else {
        data.scene_name = require("GameManager").getInstance().currentView;
      }
      // data.onesignal_projectid = '';
      // data.onesignal_playerid = '';
      // data.onesignal_tokenid = '';

      if (require("GameManager").getInstance().user.uname !== "") {
        data.username = require("GameManager").getInstance().user.uname;
        data.userid = require("GameManager").getInstance().user.id;
        data.logged_in_game_host = require("GameManager").getInstance().curServerIp;
        data.gameid = parseInt(require("GameManager").getInstance().curGameId);
        data.ag = require("GameManager").getInstance().user.ag;
        data.vip = require("GameManager").getInstance().user.vip;
      }

      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("reginfo", strPostData);
    },

    logEvent() {
     
      let data = {
        scene_name: require("GameManager").getInstance().currentView,
        username: require("GameManager").getInstance().user.uname,
        userid: require("GameManager").getInstance().user.id,
        operator: OPERATOR,
        logged_in_game_host: require("GameManager").getInstance().curServerIp,
        gameid: parseInt(require("GameManager").getInstance().curGameId),
        vip: require("GameManager").getInstance().user.vip,
        ag: require("GameManager").getInstance().user.ag,
        lq: require("GameManager").getInstance().user.lq,
        logintype: require("GameManager").getInstance().typeLogin
      };
      cc.NGWlog("TrackingManager: Send log event! data=="+JSON.stringify(data));
      // if (
      //   require("GameManager").getInstance().typeLogin == LOGIN_TYPE.FACEBOOK
      // ) {
      //   data.accesstoken = require("GameManager").getInstance().access_token;
      // }// duy cmt, ko ban accesstoken len server tracking
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("changeScene", strPostData);
    },

    sendLQ(intLq) {
      if (require("GameManager").getInstance().user.uname === "") {
        return;
      }
      let data = {
        event: "sendLQ",
        lq: intLq
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    logEventSuggestBanner(type, idPack) {
      if (type !== 1 && type !== 2) {
        if (require("GameManager").getInstance().user.uname === "") {
          return;
        }
      }
      let strEvent = "";
      switch (type) {
        case 1: {
          strEvent = "clickButtonShowPayment";
          break;
        }
        case 2: {
          strEvent = "closeBanner";
          break;
        }
        case 3: {
          strEvent = "clickButtonIAP";
          break;
        }
        case 4: {
          strEvent = "clickButtonSms";
          break;
        }
        case 5: {
          strEvent = "clickButtonCard";
          break;
        }
        case 6: {
          strEvent = "clickButonViewAd";
          break;
        }
        case 7: {
          strEvent = "clickButtonHaveNothing";
          break;
        }
        case 8: {
          strEvent = "clickButtonOpenUrl";
          break;
        }
        case 9: {
          strEvent = "clickButtonOpenShare";
          break;
        }
        case 10: {
          strEvent = "clickButtonFootball";
          break;
        }
        case 11: {
          strEvent = "clickButtonUpdate";
          break;
        }
        case 12: {
          strEvent = "clickButtonAggift";
          break;
        }
        case 13: {
          strEvent = "clickButtonAgdaily";
          break;
        }
        case 14: {
          strEvent = "clickButtonRateApp";
          break;
        }
        case 15: {
          strEvent = "clickButtonWebView";
          break;
        }
      }
      let data = {
        event: strEvent,
        id: idPack
      };

      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    sendTrackBanner(type, id, number) {
      let strEvent = "";
      switch (type) {
        case 1: {
          strEvent = "showbanner";
          break;
        }
        case 2: {
          strEvent = "clickbutton";
          break;
        }
        case 3: {
          strEvent = "clickpayment";
          break;
        }
      }
      let data = {
        event: strEvent,
        id: id,
        number: number
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    sendLeaveTable(ag, stake) {
      if (require("GameManager").getInstance().user.uname === "") {
        return;
      }
      // //    if(GPManager->earnChips && GPManager->proInfo.gMoney > 0)
      // //        jsonData.AddMember("aggift", GPManager->proInfo.gMoney,allocator);
      // //    else
      // jsonData.AddMember("aggift", 0, allocator);
      // //
      // //    if(GPManager->earnChips && GPManager->proInfo.gOnline > 0)
      // //        jsonData.AddMember("agdaily", GPManager->proInfo.gOnline,allocator);
      // //    else
      // jsonData.AddMember("agdaily", 0, allocator);

      let data = {
        event: "leaveTable",
        ag: ag,
        stake: stake,
        aggift: 0,
        agdaily: 0
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    sendInfoFinish(finishArray) {
      let vectorName = [];
      let vectorVip = [];

      //             for (rapidjson:: SizeType i = 0; i < finishArray.Size(); i++)
      // {
      //     rapidjson:: Value & jpl = finishArray[i];

      //     string name = jpl["N"].GetString();
      //     vectorName.push_back(name);
      //     for (Player * player : GUManager -> gameView -> players)
      //     {
      //         if (name.compare(player -> name) == 0) {
      //             vectorVip.push_back(player -> vip);
      //             break;
      //         }
      //     }
      // }

      // if (!GPManager -> checkSIO()) {
      //     return;
      // }

      // User * user = GPManager -> user;

      // if (user -> name.length() == 0)
      //     return;
      // //

      // rapidjson:: Document document;
      // rapidjson:: Document:: AllocatorType & allocator = document.GetAllocator();
      // rapidjson:: Value jsonData(rapidjson:: kObjectType);

      // jsonData.AddMember("event", "finish", allocator);

      // rapidjson:: Value arr(rapidjson:: kArrayType);
      // for (int i = 0; i < vectorName.size(); i++)
      // arr.PushBack(StringRef(vectorName[i].c_str()), allocator);

      // jsonData.AddMember("player", arr, allocator);
      // //
      // rapidjson:: Value arrVip(rapidjson:: kArrayType);
      // for (int i = 0; i < vectorVip.size(); i++)
      // arrVip.PushBack(vectorVip[i], allocator);

      // jsonData.AddMember("vip", arrVip, allocator);
      // //
      // rapidjson:: StringBuffer strbuf;
      // rapidjson:: Writer < rapidjson:: StringBuffer > writer(strbuf);
      // jsonData.Accept(writer);
      // string strPostData = strbuf.GetString();

      // CCLOG("EVENT LOG: %s", strPostData.c_str());
      // GPManager -> emitSIO("event", strPostData);

      let data = {
        event: "finish"
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    sendVideoCount(vc, vm) {
      if (require("GameManager").getInstance().user.uname === "") {
        return;
      }
      let data = {
        event: "videoCount",
        videoCurrent: vc,
        videoMax: vm
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },
    sendCtable(tableId, stake) {
      if (require("GameManager").getInstance().user.uname === "") {
        return;
      }
      let data = {
        event: "ctable",
        tid: tableId,
        stake: stake
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    logReceiveGift(type, money) {
      if (require("GameManager").getInstance().user.uname === "") {
        return;
      }

      let data = {
        event: "receivegift"
      };
      switch (type) {
        case 0: {
          data.hasnt_money = money;
          break;
        }
        case 1: {
          data.gift_from_admin = money;
          break;
        }
        case 2: {
          data.upvip = money;
          break;
        }
        case 3: {
          data.online = money;
          break;
        }
        case 4: {
          data.facebook = money;
          break;
        }
        case 5: {
          data.video = money;
          break;
        }
        case 6: {
          data.giftcode = money;
          break;
        }
        case 7: {
          data.luckyspin = money;
          break;
        }
      }
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    },

    sendStatePoayment(card, sms, iap, fromconfig) {
      if (require("GameManager").getInstance().user.uname === "") {
        return;
      }
      let data = {
        event: "statepayment",
        card: card,
        sms: sms,
        iap: iap,
        fromconfig: fromconfig
      };
      let strPostData = JSON.stringify(data);
      TrackingManager.SendTrackingSIO("event", strPostData);
    }
  }
});

module.exports = TrackingManager;
