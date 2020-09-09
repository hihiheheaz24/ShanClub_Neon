// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
const GameManager = require("GameManager");
var LoadingGame = cc.Class({
  extends: cc.Component,

  properties: {
    _indexLoad: 0,
    _isOff: false,

  },
  statics: {
    instance: null,
  },
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // cc.sys.localStorage.clear(); //hien cmt
    //   this.baseurl= "http://ttt.dststudio.net/subrequest.php?url=";
    this.cors_url = "https://cors-anywhere.herokuapp.com/";
    //   this.config_links= "https://mobile.tracking.lengbear.com/cf_links.json";
   // this.config_links = 'https://mobile.tracking.shweyang.com/cf/cf_links_138.json'
   this.config_links = 'https://mobile.tracking.shweyang.com/cf/cf_links_js.json' // yangplay
   this.config_1 = "{\"url_dis_register\":\"https://mobile.tracking.shweyang.com/register\",\"url_dis_get_update_info\":\"https://mobile.tracking.shweyang.com/getinfo/%dis_id%/%dev_id%\",\"screen_name\" : \"login\"}";
   this.config_2 = "{\"id\":\"3227\"}";
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      this.config_3 = '{"status":true,"operatorID":"7000","umode":0,"uop1":"OK","uop2":"H\u1ee7y b\u1ecf","umsg":"","utar":"","gamenotification":false,"fidrs":"","publisher":"shanjs_1_43_android","version":"1.43","os":"android_cocosjs","bundleID":"csn.shan.club.online","fbappid":"","fanpageID":"","groupID":"","inviteJoinFBMsg":"Zozo","fanpageURL":"","groupURL":"","u_chat_fb":"","hotline":"","hasInvitableFriends":true,"url_huongdan":"","hashTagShareImage":"","time_loadcf":1800,"avatar_change":2,"newest_version":"1.00","newest_versionUrl":"","show_full_webview":true,"vip_rename":1,"ag_rename":100000,"ag_rename_min":20,"ag_rename_verify":10000,"ag_rename_verify_min":20,"isChatF":true,"chat_game":1,"avatar_count":10,"vchanpho":11,"vsaubanh":11,"multi_lang":true,"url_text_en":"https:\/\/mobile.tracking.shweyang.com\/text\/shanclub\/text_en.json","url_text_myanmar":"https:\/\/mobile.tracking.shweyang.com\/text\/shanclub\/text_myanmar.json","avatar_build":"https:\/\/mobile.tracking.shweyang.com\/av\/%avaNO%.png","avatar_fb":"https:\/\/graph.facebook.com\/v4.0\/%fbID%\/picture?width=200&height=200&redirect=true","u_rate":"","u_benefit":"https:\/\/mobile.tracking.shweyang.com\/benefit.json?u=1","urlLogGame":"","u_SIO":"","listGame":[8802,1001,8044,8803,8808,8818,1111,9500,9501],"rank_list":[8802,1001,8044,8808],"ip_list":[{"id":8801,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,15000000,5000000]},{"id":8802,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8806,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8808,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8807,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8888,"ip":"35.198.236.4","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8819,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8810,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8818,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8044,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8803,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","room":[100000,1,10000000]},{"id":1001,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":1111,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":9500,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":9501,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]}],"delayNoti":[{"time":5,"title":"ShanClub","text":"Have a nice day","ag":100000},{"time":600,"title":"ShanClub","text":"Have a nice day","ag":0},{"time":86400,"title":"ShanClub","text":"Have a nice day","ag":0}],"ket":{"fee_chanpho":[5,5,4,3,2,1,1,1,1,1,1]},"ndealer":"Ozawa","state_net":true,"state_mob":false,"is_reg":false,"is_login_guest":true,"is_login_fb":true,"is_login_apple":true,"is_verify":false,"is_bl_fb":false,"is_bl_salert":false,"allowPushOffline":false,"allowPushOfflineProInfo":false,"is_mission":false,"count_vp":11,"vip_wellplay":10,"v_dt":11,"is_dt":false,"is_agency_shop":false,"ismaqt":false,"ismaiv":false,"isBn":false,"state_list":[414],"url_chip_in_game":"https:\/\/mobile.tracking.shweyang.com\/rateif","use_p":[{"name":"i","state":true}]}';
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      this.config_3 = '{"status":true,"operatorID":"7000","umode":0,"uop1":"OK","uop2":"H\u1ee7y b\u1ecf","umsg":"","utar":"","gamenotification":false,"fidrs":"","publisher":"shanjs_1_43_ios","version":"1.43","os":"ios_cocosjs","bundleID":"csn.shan.club.online","fbappid":"","fanpageID":"","groupID":"","inviteJoinFBMsg":"Zozo","fanpageURL":"","groupURL":"","u_chat_fb":"","hotline":"","hasInvitableFriends":true,"url_huongdan":"","hashTagShareImage":"","time_loadcf":1800,"avatar_change":2,"newest_version":"1.00","newest_versionUrl":"","show_full_webview":true,"vip_rename":1,"ag_rename":100000,"ag_rename_min":20,"ag_rename_verify":10000,"ag_rename_verify_min":20,"isChatF":true,"chat_game":1,"avatar_count":10,"vchanpho":11,"vsaubanh":11,"multi_lang":true,"url_text_en":"https:\/\/mobile.tracking.shweyang.com\/text\/shanclub\/text_en.json","url_text_myanmar":"https:\/\/mobile.tracking.shweyang.com\/text\/shanclub\/text_myanmar.json","avatar_build":"https:\/\/mobile.tracking.shweyang.com\/av\/%avaNO%.png","avatar_fb":"https:\/\/graph.facebook.com\/v4.0\/%fbID%\/picture?width=200&height=200&redirect=true","u_rate":"","u_benefit":"https:\/\/mobile.tracking.shweyang.com\/benefit.json?u=1","urlLogGame":"","u_SIO":"","listGame":[8802,1001,8044,8803,8808,8818,1111,9500,9501],"rank_list":[8802,1001,8044,8808],"ip_list":[{"id":8801,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,15000000,5000000]},{"id":8802,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8806,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8808,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8807,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8888,"ip":"35.198.236.4","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8819,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8810,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8818,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8044,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8803,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","room":[100000,1,10000000]},{"id":1001,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":1111,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":9500,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":9501,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]}],"delayNoti":[{"time":5,"title":"ShanClub","text":"Have a nice day","ag":100000},{"time":600,"title":"ShanClub","text":"Have a nice day","ag":0},{"time":86400,"title":"ShanClub","text":"Have a nice day","ag":0}],"ket":{"fee_chanpho":[5,5,4,3,2,1,1,1,1,1,1]},"ndealer":"Ozawa","state_net":true,"state_mob":false,"is_reg":false,"is_login_guest":true,"is_login_fb":true,"is_login_apple":true,"is_verify":false,"is_bl_fb":false,"is_bl_salert":false,"allowPushOffline":false,"allowPushOfflineProInfo":false,"is_mission":false,"count_vp":11,"vip_wellplay":10,"v_dt":11,"is_dt":false,"is_agency_shop":false,"ismaqt":false,"ismaiv":false,"isBn":false,"state_list":[414],"url_chip_in_game":"https:\/\/mobile.tracking.shweyang.com\/rateif","use_p":[{"name":"i","state":true}]}';
    } else {
      this.config_3 = '{"status":true,"operatorID":"7000","umode":0,"uop1":"OK","uop2":"H\u1ee7y b\u1ecf","umsg":"","utar":"","gamenotification":false,"fidrs":"","publisher":"shanjs_1_43_android","version":"1.43","os":"android_cocosjs","bundleID":"csn.shan.club.online","fbappid":"","fanpageID":"","groupID":"","inviteJoinFBMsg":"Zozo","fanpageURL":"","groupURL":"","u_chat_fb":"","hotline":"","hasInvitableFriends":true,"url_huongdan":"","hashTagShareImage":"","time_loadcf":1800,"avatar_change":2,"newest_version":"1.00","newest_versionUrl":"","show_full_webview":true,"vip_rename":1,"ag_rename":100000,"ag_rename_min":20,"ag_rename_verify":10000,"ag_rename_verify_min":20,"isChatF":true,"chat_game":1,"avatar_count":10,"vchanpho":11,"vsaubanh":11,"multi_lang":true,"url_text_en":"https:\/\/mobile.tracking.shweyang.com\/text\/shanclub\/text_en.json","url_text_myanmar":"https:\/\/mobile.tracking.shweyang.com\/text\/shanclub\/text_myanmar.json","avatar_build":"https:\/\/mobile.tracking.shweyang.com\/av\/%avaNO%.png","avatar_fb":"https:\/\/graph.facebook.com\/v4.0\/%fbID%\/picture?width=200&height=200&redirect=true","u_rate":"","u_benefit":"https:\/\/mobile.tracking.shweyang.com\/benefit.json?u=1","urlLogGame":"","u_SIO":"","listGame":[8802,1001,8044,8803,8808,8818,1111,9500,9501],"rank_list":[8802,1001,8044,8808],"ip_list":[{"id":8801,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,15000000,5000000]},{"id":8802,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8806,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8808,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8807,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,5000000]},{"id":8888,"ip":"35.198.236.4","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8819,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8810,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8818,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8044,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":8803,"ip":"35.197.132.152","ip_dm":"socket.app01.shweyang.com","room":[100000,1,10000000]},{"id":1001,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":1111,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":9500,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]},{"id":9501,"ip":"35.185.182.52","ip_dm":"socket.app02.shweyang.com","vip":[0,0,1],"room":[100000,10000000,10000000]}],"delayNoti":[{"time":5,"title":"ShanClub","text":"Have a nice day","ag":100000},{"time":600,"title":"ShanClub","text":"Have a nice day","ag":0},{"time":86400,"title":"ShanClub","text":"Have a nice day","ag":0}],"ket":{"fee_chanpho":[5,5,4,3,2,1,1,1,1,1,1]},"ndealer":"Ozawa","state_net":true,"state_mob":false,"is_reg":false,"is_login_guest":true,"is_login_fb":true,"is_login_apple":true,"is_verify":false,"is_bl_fb":false,"is_bl_salert":false,"allowPushOffline":false,"allowPushOfflineProInfo":false,"is_mission":false,"count_vp":11,"vip_wellplay":10,"v_dt":11,"is_dt":false,"is_agency_shop":false,"ismaqt":false,"ismaiv":false,"isBn":false,"state_list":[414],"url_chip_in_game":"https:\/\/mobile.tracking.shweyang.com\/rateif","use_p":[{"name":"i","state":true}]}';
    }
    this.config_4 = '{"iap_ios":[{"amount":0.99,"chip":7500000,"localCurency":"USD","gameCurency":"Chips","baseChip":1164000,"percentBonus":87,"mDisplay":"7,500,000 Chips","mDisplayAmount":"0.99 USD","mDisplayBaseChip":"1,164,000 Chips","diamondBonus":0,"cost":1},{"amount":1.99,"chip":15900000,"localCurency":"USD","gameCurency":"Chips","baseChip":2928000,"percentBonus":110,"mDisplay":"15,900,000 Chips","mDisplayAmount":"1.99 USD","mDisplayBaseChip":"2,928,000 Chips","diamondBonus":0,"cost":2},{"amount":4.99,"chip":41250000,"localCurency":"USD","gameCurency":"Chips","baseChip":8020000,"percentBonus":120,"mDisplay":"41,250,000 Chips","mDisplayAmount":"4.99 USD","mDisplayBaseChip":"8,020,000 Chips","diamondBonus":0,"cost":5},{"amount":9.99,"chip":84000000,"localCurency":"USD","gameCurency":"Chips","baseChip":18640000,"percentBonus":140,"mDisplay":"84,000,000 Chips","mDisplayAmount":"9.99 USD","mDisplayBaseChip":"18,640,000 Chips","diamondBonus":0,"cost":10},{"amount":19.99,"chip":171000000,"localCurency":"USD","gameCurency":"Chips","baseChip":43280000,"percentBonus":162,"mDisplay":"171,000,000 Chips","mDisplayAmount":"19.99 USD","mDisplayBaseChip":"43,280,000 Chips","diamondBonus":0,"cost":20},{"amount":49.99,"chip":442500000,"localCurency":"USD","gameCurency":"Chips","baseChip":113200000,"percentBonus":169,"mDisplay":"442,500,000 Chips","mDisplayAmount":"49.99 USD","mDisplayBaseChip":"113,200,000 Chips","diamondBonus":0,"cost":50},{"amount":99.99,"chip":900000000,"localCurency":"USD","gameCurency":"Chips","baseChip":241400000,"percentBonus":181,"mDisplay":"900,000,000 Chips","mDisplayAmount":"99.99 USD","mDisplayBaseChip":"241,400,000 Chips","diamondBonus":0,"cost":100}]}';
    this.url_dis_get_update_info = "";
    this.benefit = '{"benefit":[{"des_en":"UsingSafe","des_mm":"UsingSafe","vip":[false,true,true,true,true,true,true,true,true,true,true]},{"des_en":"DailyGiftcode","des_mm":"DailyGiftcode","vip":[true,true,true,true,true,true,true,true,true,true,true]},{"des_en":"Outofchips","des_mm":"Outofchips","vip":[400,400,10000,20000,30000,50000,100000,200000,300000,400000,1000000]},{"des_en":"Levelup","des_mm":"Levelup","vip":[0,2000,20000,50000,400000,800000,2000000,8000000,16000000,32000000,64000000]},{"des_en":"TotalOnlineChips/Day","des_mm":"TotalOnlineChips/Day","vip":[300,300,1200,6000,30000,60000,120000,180000,240000,300000,600000]},{"des_en":"TotalDaily/Week","des_mm":"TotalDaily/Week","vip":[1400,1400,35000,70000,105000,175000,350000,700000,1050000,1400000,3500000]}],"back_oto":[1000,5000,20000,50000,100000,200000,500000,1000000,1000000,1000000,1000000],"limit_oto":[5,8,5,4,3,3,3,3,3,3,3],"agInvite":20000,"agInviteFr":10000,"agShareImg":500,"agContactAd":500,"agVerify":50000,"agRename":5000,"agSupport":10000,"jackpot":[{"gameid":8044,"mark":[100000,500000,1000000,5000000,10000000],"chip":[500000000,2500000000,5000000000,25000000000,50000000000]},{"gameid":1001,"mark":[1,10,100,1000,10000],"chip":[1000,10000,100000,1000000,10000000]}],"url_img_oto":"https://mobile.tracking.shweyang.com/image/oto/ss1/%d_up%d.jpg","arr_limit_oto":["1-1","1-2","1-3","2-1","2-2","2-3","3-1","3-2","3-3"],"top":[{"gameid":1001,"des_en":"Anbanhtrungthutrungbaocaosu","des_mm":"Phanthuongcuabansela1tuankhoanick","url_img":"https://mobile.tracking.shweyang.com/image/top/1001_7.png?n=2"},{"gameid":8802,"des_en":"Anbanhtrungthutrungbaocaosu","des_mm":"Phanthuongcuabansela1tuankhoanick","url_img":"https://mobile.tracking.shweyang.com/image/top/8802_7.png?n=2"},{"gameid":8044,"des_en":"Anbanhtrungthutrungbaocaosu","des_mm":"Phanthuongcuabansela1tuankhoanick","url_img":"https://mobile.tracking.shweyang.com/image/top/8044_7.png?n=2"},{"gameid":8808,"des_en":"Anbanhtrungthutrungbaocaosu","des_mm":"Mottrangphaotaytubantochuc","url_img":"https://mobile.tracking.shweyang.com/image/top/8808_7.png?n=2"}],"top_sc":[{"gameid":1001,"url_img":"https://mobile.tracking.shweyang.com/image/top_sc/1001_1.png","url_img_js":"https://mobile.tracking.shweyang.com/image/coming_js_1.png"},{"gameid":8802,"url_img":"https://mobile.tracking.shweyang.com/image/top_sc/8802_1.png","url_img_js":"https://mobile.tracking.shweyang.com/image/coming_js_1.png"},{"gameid":8044,"url_img":"https://mobile.tracking.shweyang.com/image/top_sc/8044_1.png","url_img_js":"https://mobile.tracking.shweyang.com/image/coming_js_1.png"},{"gameid":8808,"url_img":"https://mobile.tracking.shweyang.com/image/top_sc/8808_1.png","url_img_js":"https://mobile.tracking.shweyang.com/image/coming_js_1.png"}]}';


    LoadingGame.instance = this;
    this.loadInfo();
    this.setConfigOff();
    this._isOff = true;
    this.getConfig_0();

  },
  setConfigOff() {

    let config2Off = cc.sys.localStorage.getItem("config_2");
    if (config2Off == null || config2Off == '' || typeof config2Off == 'undefined') {
      config2Off = this.config_2;
      cc.sys.localStorage.setItem("config_2", config2Off);
    }

    let config3Off = cc.sys.localStorage.getItem("config_3");
    if (config3Off == null || config3Off == '' || typeof config3Off == 'undefined') {
      config3Off = this.config_3;
      cc.sys.localStorage.setItem("config_3", config3Off);
    }
    this.handleConfig_3(config3Off);

    let config4Off = cc.sys.localStorage.getItem("config_4");
    if (config4Off == null || config4Off == '' || typeof config4Off == 'undefined') {
      config4Off = this.config_4;
      cc.sys.localStorage.setItem("config_4", config4Off);
    }
    this.handleConfig_4(config4Off);

    let configBenefit = cc.sys.localStorage.getItem("benefit_config");
    if (configBenefit == null || configBenefit == '' || typeof configBenefit == 'undefined') {
      configBenefit = this.benefit;
      cc.sys.localStorage.setItem("benefit_config", configBenefit);
    }
    this.handle_benefit_config(configBenefit);

  },
  loadInfo: function () {
    if (cc.sys.isNative) {
      this.cors_url = "";
      let pathSceenShot = cc.sys.localStorage.getItem('pathSceenShot');
      if (pathSceenShot == null || pathSceenShot == '') { require("Util").getPathForScreenshot(); }
      else {
        GameManager.getInstance().pathScreenShot = pathSceenShot;
      }

      var deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
      if (deviceId == null) {
        require("Util").getGetDeviceId();
      } else {
        GameManager.getInstance().deviceId = deviceId;
      }
      var bundleID = cc.sys.localStorage.getItem("GEN_BUNDLEID");
      if (bundleID == null) {
        require("Util").getBundleId();
      } else {
        GameManager.getInstance().bundleID = bundleID;
      }
      var versionGame = cc.sys.localStorage.getItem("GEN_VERSIONGAME");
      // if (versionGame == null) {
      require("Util").getVersionId();
      // } else {
      //  GameManager.getInstance().versionGame = versionGame;
      // }
      if (cc.sys.os === cc.sys.OS_IOS) {
        require("Util").getCarrierName();
      }
    } else {
      let deviceId = cc.sys.localStorage.getItem("GEN_DEVICEID");
      if (deviceId === null) {
        deviceId = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < 6; i++) {
          deviceId += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );
        }
        deviceId += "-";
        for (var _i = 0; _i < 4; _i++) {
          deviceId += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );
        }
        deviceId += "-";
        for (var _i2 = 0; _i2 < 4; _i2++) {
          deviceId += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );
        }
        deviceId += "-";
        for (var _i3 = 0; _i3 < 4; _i3++) {
          deviceId += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );
        }
        deviceId += "-";
        for (var _i4 = 0; _i4 < 8; _i4++) {
          deviceId += possible.charAt(
            Math.floor(Math.random() * possible.length)
          );
        }
        cc.sys.localStorage.setItem("GEN_DEVICEID", deviceId);
      }

      GameManager.getInstance().deviceId = deviceId;
    }
    if (require("GameManager").getInstance().deviceId === "") {
      GameManager.getInstance().deviceId = deviceId;
    }

  },
  getConfig_0: function () {
    var _this = this;
    var request = new XMLHttpRequest();
    request.open("GET", this.cors_url + this.config_links, true);
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.onreadystatechange = function () {

      if (request.readyState === 4 && (request.status >= 200 && request.status < 300)) {
        if (request.responseText.length === 0) {

        } else if (!JSON.parse(request.responseText)) {

        } else {
          cc.NGWlog("cf1 = " + request.responseText);
          cc.sys.localStorage.setItem("config_1", request.responseText);
        }
        _this.handleConfig_1(cc.sys.localStorage.getItem("config_1"));
      }



    }


    request.onerror = function () {
      setTimeout(() => {
        cc.NGWlog("chay vao load lai config 0")
        _this.getConfig_0();
      }, 500)
    }
    request.send();
    // request.onloadend = function () {
    //   //  cc.NGWlog("config_0===test lai la: ", request.responseText);

    // };

    // request.onerror = function () {


    //   // _this.handleConfig_1(cc.sys.localStorage.getItem("config_1"));
    // };

  },
  handleConfig_1: function (result) {
    var _this = this;
    var doc = JSON.parse(result);
    cc.NGWlog("check11 config1: " + result + "");
    if (!doc) {
      cc.NGWlog("handleConfig_1 parse error");
      return;
    }

    var url_dis_register = doc.url_dis_register;
    this.url_dis_get_update_info = doc.url_dis_get_update_info;
    var request = new XMLHttpRequest();
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      GameManager.getInstance().os = "android_cocosjs";
      GameManager.getInstance().publisher = "shanjs_1_43_android";
    } else if (cc.sys.os === cc.sys.OS_IOS) {
      GameManager.getInstance().os = "ios_cocosjs";
      GameManager.getInstance().publisher = "shanjs_1_43_ios";
    }
    else {
      GameManager.getInstance().os = "android_cocosjs"
      GameManager.getInstance().publisher = "shanjs_1_43_android";
    }
    var data = {
      bundleID: GameManager.getInstance().bundleID,
      version: GameManager.getInstance().versionGame,
      operatorID: OPERATOR,
      os: GameManager.getInstance().os,
      publisher: GameManager.getInstance().publisher
    };
    cc.NGWlog("duyydatapost: " + JSON.stringify(data));
    request.open("POST", this.cors_url + url_dis_register, true);
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.setRequestHeader(
      "Content-Type",
      "application/json;charset=UTF-8"
    );


    request.onreadystatechange = function () {
      if (request.readyState === 4 && (request.status >= 200 && request.status < 300)) {
        if (request.responseText.length == 0) {
        }

        else if (!JSON.parse(request.responseText)) {
        } else {
          cc.NGWlog("chay vao load lai config da load xong2 " + request.responseText);
          cc.sys.localStorage.setItem("config_2", request.responseText);
          _this.handleConfig_2(cc.sys.localStorage.getItem("config_2"));
        }
      }

    }

    request.onerror = function () {
      setTimeout(() => {
        console.log("khong load dc congif 2");
        _this.handleConfig_1(result)
      }, 500)
    }
    request.send(JSON.stringify(data));
    // request.onloadend = function () {

    // };
    // request.onerror = function () {


    //   // _this.handleConfig_2(cc.sys.localStorage.getItem("config_2"));
    // };
  },
  handleConfig_2: function handleConfig_2(result) {
    var _this = this;

    cc.NGWlog("check11 config2: " + result + "");
    var doc = JSON.parse(result);

    if (!doc) {
      cc.NGWlog("handleConfig_2 parse error");
      return;
    }
    GameManager.getInstance().disId = doc.id;
    cc.NGWlog("disID game", GameManager.getInstance().disId);


    if (require("GameManager").getInstance().disId.length > 0)
      cc.sys.localStorage.setItem(
        "default_disId",
        GameManager.getInstance().disId
      );
    this.url_dis_get_update_info = this.url_dis_get_update_info.replace(
      "%dis_id%",
      GameManager.getInstance().disId + ""
    );
    this.url_dis_get_update_info = this.url_dis_get_update_info.replace(
      "%dev_id%",
      GameManager.getInstance().deviceId + ""
    );
    // this.url_dis_get_update_info = "https://cfg.ngwcasino.com/getinfo/3161/c1cf5f9eff1c1938?user=jk";//duy test

    cc.NGWlog('link getinfo la=== ' + this.url_dis_get_update_info);

    if (this._isOff) {
      var request = new XMLHttpRequest();

      request.open("GET", this.cors_url + this.url_dis_get_update_info, true);
      request.setRequestHeader("Access-Control-Allow-Origin", "*");


      request.onreadystatechange = function () {
        if (request.readyState === 4 && (request.status >= 200 && request.status < 300)) {
          if (request.responseText.length == 0)
            cc.NGWlog("Load success data config3 ra null rồi :(");
          else if (!JSON.parse(request.responseText)) {
            cc.NGWlog("doc config3 error");

          } else {
            cc.NGWlog('chay vao load lai config da load xong 3 ');
            cc.sys.localStorage.setItem("config_3", request.responseText);
            _this.handleConfig_3(cc.sys.localStorage.getItem("config_3"));

          }
        }

      }
      request.onerror = function () {
        setTimeout(() => {
          cc.NGWlog("load xit config 3");
          _this.handleConfig_2(result);
        }, 500)
      }
      request.send();
      // request.onloadend = function () {

      // };
      // request.onerror = function () {

      //   //  _this.handleConfig_3(cc.sys.localStorage.getItem("config_3"));

      // };


    }

  },
  handleConfig_3: function handleConfig_3(result) {
    cc.NGWlog("handleConfig_3:=========" + result);
    var _this = this;
    var doc = JSON.parse(result);

    if (!doc) {
      cc.NGWlog("handleConfig_3 parse error");
      return;
    }

    if (doc.crash != null) {
      cc.NGWlog("vao crash");
      GameManager.getInstance().onQuitGame();
    }

    GameManager.getInstance().listMc = [];
    GameManager.getInstance().listGold = [];
    GameManager.getInstance().listTl = [];
    if (doc.url_dt != null) {
      this.url_dt = doc.url_dt;
      this.getCashOutInfo();
    }

    if (doc.publisher != null) GameManager.getInstance().publisher = doc.publisher;
    cc.sys.localStorage.removeItem('urlLogGame');
    if (doc.urlLogGame != null) {
      cc.NGWlog("co urlLogGame: " + doc.urlLogGame);
      cc.sys.localStorage.setItem('urlLogGame', doc.urlLogGame);
      // require("MySocketIO").startSIO();
    } else {
      cc.NGWlog("ko co urlLogGame: " + doc.urlLogGame);
    }

    if (doc.u_SIO != null) {
      cc.NGWlog("co u_SIO: " + doc.u_SIO);
      if (cc.sys.localStorage.getItem('u_SIO') != doc.u_SIO) {
        // require('SMLSocketIO').getInstance().stopSIO();
        cc.sys.localStorage.setItem('u_SIO', doc.u_SIO);
        // require('SMLSocketIO').getInstance().startSIO();
      }
    } else {
      cc.sys.localStorage.setItem('u_SIO', "");
      cc.NGWlog("ko co u_SIO: " + doc.u_SIO);
      // require('SMLSocketIO').getInstance().stopSIO();
    }

    if (doc.fanpageID != null) GameManager.getInstance().fanpageID = doc.fanpageID;

    if (doc.groupID != null) GameManager.getInstance().groupID = doc.groupID;



    GameManager.getInstance().listGame = [];
    var isHaveListGame = false;
    var varGameID = cc.sys.localStorage.getItem("curGameIdShanClub");
    cc.NGWlog("curGameId ban dau la " + varGameID);
    for (var i = 0; i < doc.listGame.length; i++) {
      if (i === 0) {
        if (varGameID === null || typeof (varGameID) === "undefined") {
          GameManager.getInstance().curGameId = GAME_ID.SHANKOEMEE;
          cc.sys.localStorage.setItem("curGameIdShanClub", GAME_ID.SHANKOEMEE);
        } else {
          GameManager.getInstance().curGameId = parseInt(varGameID);
        }
      }
      GameManager.getInstance().listGame.push(doc.listGame[i]);
    }
    // // // // // // fix cung game
    // GameManager.getInstance().listGame.push(9008);
    // GameManager.getInstance().listGame.push(1009);
    //mini game config


    var chipsRoomTemp = [];

    if (doc.rank_list != null) {
      Global.TopGameView._rank_list = doc.rank_list;
    }

    if (doc.ip_list != null) {
      GameManager.getInstance().listIp = [];
      var data = doc.ip_list;
      var ipTeen = "";
      for (var i = 0; i < data.length; i++) {
        var gameServerIp = {};
        gameServerIp.gameID = data[i].id;
        gameServerIp.tx = data[i].tx;
        gameServerIp.txlob = data[i].txlob;
        gameServerIp.gameIP = data[i].ip;
        gameServerIp.vip = data[i].vip;
        gameServerIp.chipsRoom = [];
        gameServerIp.domain = data[i].ip_dm;

        if (data[i].room) {
          for (var j = 0; j < data[i].room.length; j++) {
            gameServerIp.chipsRoom.push(data[i].room[j]);
          }
        }
        chipsRoomTemp.push(gameServerIp.chipsRoom);

        GameManager.getInstance().listIp.push(gameServerIp);

        if (gameServerIp.gameID == GameManager.getInstance().curGameId) {
          GameManager.getInstance().curServerIp = gameServerIp.gameIP;
          cc.sys.localStorage.getItem("curServerIp" + NAME_GAME);
        }
      }
    }

    if (doc.allowPushOffline != null)
      GameManager.getInstance().allowPushOffline = doc.allowPushOffline;

    if (doc.u_rate != null) {
      GameManager.getInstance().newest_versionUrl = doc.u_rate;
    }

    if (doc.is_agency_shop != null)
      GameManager.getInstance().is_agency_shop = doc.is_agency_shop;

    if (doc.vsaubanh != null)
      GameManager.getInstance().vsaubanh = doc.vsaubanh;
    else
      GameManager.getInstance().vsaubanh = 11;

    if (doc.fanpageURL != null) GameManager.getInstance().fanpageURL = doc.fanpageURL;
    if (doc.avatar_build != null)
      GameManager.getInstance().avatar_link = doc.avatar_build;
    if (doc.avatar_fb != null)
      GameManager.getInstance().avatarFb_link = doc.avatar_fb;
    if (doc.avatar_count != null)
      GameManager.getInstance().avatar_count = doc.avatar_count;

    if (doc.groupURL != null) GameManager.getInstance().groupURL = doc.groupURL;

    if (doc.u_chat_fb != null) GameManager.getInstance().u_chat_fb = doc.u_chat_fb;

    
    if (doc.isShowLog) {
      cc.NGWlog = console.log;
    } else {
      cc.NGWlog = cc.log;
    }
    //cc.NGWlog = console.log;
    if (doc.is_xs != null)
      GameManager.getInstance().is_xs = doc.is_xs;
    else
      GameManager.getInstance().is_xs = true;

    if (doc.vip_rename != null)
      GameManager.getInstance().vip_rename = doc.vip_rename;

    if (doc.ag_rename != null)
      GameManager.getInstance().ag_rename = doc.ag_rename;

    if (doc.ag_rename_min != null)
      GameManager.getInstance().ag_rename_min = doc.ag_rename_min;


    if (doc.is_login_fb != null)
      GameManager.getInstance().is_login_fb = doc.is_login_fb;

    if (doc.hashTagShareImage != null) {
      GameManager.getInstance().hashTagShareImage = doc.hashTagShareImage;
    }

    if (doc.is_login_guest != null) {
      GameManager.getInstance().is_login_guest = doc.is_login_guest;
    } else {
      GameManager.getInstance().is_login_guest = true;
    }
    Global.LoginView.btn_playnow.node.active = GameManager.getInstance().is_login_guest;

    if (doc.url_rule != null)
      GameManager.getInstance().url_rule = doc.url_rule;

    if (doc.agSauCacTL != null)
      GameManager.getInstance().agSauCacTL = doc.agSauCacTL;

    if (doc.agInvite != null)
      GameManager.getInstance().agInvite = doc.agInvite;

    if (doc.vchanpho != null) {
      GameManager.getInstance().vchanpho_save = doc.vchanpho;
    } else {
      GameManager.getInstance().vchanpho_save = 11;
    }


    if (doc.ismaqt != null) {
      GameManager.getInstance().ismaqt_save = doc.ismaqt;
    } else {
      GameManager.getInstance().ismaqt_save = false;
    }


    if (doc.ismaiv != null) {
      GameManager.getInstance().ismaiv_save = doc.ismaiv;
    } else {
      GameManager.getInstance().ismaiv_save = false
    }
    if (doc.is_dt != null) {
      GameManager.getInstance().is_dt = doc.is_dt;
    } else {
      GameManager.getInstance().is_dt = false;
    }
    if (doc.v_dt != null) {
      GameManager.getInstance().v_dt = doc.v_dt;
    } else {
      GameManager.getInstance().v_dt = 11;
    }
    if (doc.count_vp != null) {
      GameManager.getInstance().request_vip_payment = doc.count_vp;
    } else {
      GameManager.getInstance().request_vip_payment = 11;
    }
    if (doc.is_verify != null) {
      GameManager.getInstance().isVerifyMobile = doc.is_verify;
    }

    if (doc.is_verify != null) {
      GameManager.getInstance().isVerifyMobile = doc.is_verify;
    }

    if (doc.is_bl_fb != null) {
      GameManager.getInstance().is_bl_fb = doc.is_bl_fb;
    }
    else{
      GameManager.getInstance().is_bl_fb = false;
    }

    if (doc.is_mission != null) {
      GameManager.getInstance().is_mission = doc.is_mission;
    }
    else GameManager.getInstance().is_mission = false;

    if (doc.is_bl_salert != null) {
      GameManager.getInstance().is_bl_salert = doc.is_bl_salert;
    }

    if (doc.isBn != null) {
      GameManager.getInstance().isBn = doc.isBn;
      //require("GameManager").getInstance().isBn = true;//duy
    } else {
      GameManager.getInstance().isBn = false;
    }

    if (doc.iap != null) {
      GameManager.getInstance().iap_config = doc.iap;
    } else {
      GameManager.getInstance().iap_config = true;
    }

    if (doc.time_loadcf != null)
      GameManager.getInstance().time_loadcf = doc.time_loadcf;

    //GameManager.getInstance().somoso_ceoda = false;
    //GameManager.getInstance().cearode_ceoda = false;
    //GameManager.getInstance().wayve_ceoda = false;
    //GameManager.getInstance().chamdo_ceoda = false;
    //GameManager.getInstance().diemde = false;
    //GameManager.getInstance().molo_enhipe = false;
    GameManager.getInstance().state_list = [];
    if (doc.state_list != null) {
      for (var i = 0; i < doc.state_list.length; i++) {
        GameManager.getInstance().state_list.push(doc.state_list[i]);
      }
    }

    if (doc.state_net != null) {
      GameManager.getInstance().state_net = doc.state_net;//son
    } else {
      GameManager.getInstance().state_net = true;
    }

    GameManager.getInstance().resetUse_p();
    if (doc.use_p != null) {
      for (let i = 0; i < doc.use_p.length; i++) {
        let namp = doc.use_p[i].name;
        // let state = doc.use_p[i].state;
        if (namp === "p1") {
          // cc.NGWlog('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', doc.use_p[i]);
          GameManager.getInstance().dcb_ceoda_save = doc.use_p[i];
        } else if (namp === "p2") {
          
        } else if (namp === "p3") {
          GameManager.getInstance().wave_save = doc.use_p[i];
          //GameManager.getInstance().wing_ceoda_save = doc.use_p[i];
        } else if (namp === "p4") {
          GameManager.getInstance().reddot_save = doc.use_p[i];
        } else if (namp === "p5") {
          GameManager.getInstance().easy_point_save = doc.use_p[i];
        } else if (namp === "p6") {
         // GameManager.getInstance().paygo_save = doc.use_p[i];
        }

        else if (namp === "i") {
          GameManager.getInstance().iap_config = doc.use_p[i].state;
        }
      }
    }
    if (doc.u_p != null) {
      GameManager.getInstance().u_p = doc.u_p;
    } else {
      GameManager.getInstance().u_p = ""
    }

    if (doc.u_pp != null) {
      GameManager.getInstance().u_pp = doc.u_pp;
    } else {
      GameManager.getInstance().u_pp = ""
    }

    if (doc.u_ep != null) {
      GameManager.getInstance().u_ep = doc.u_ep;
    } else {
      GameManager.getInstance().u_ep = ""
    }

    if (doc.u_e2p_1 != null) {
      GameManager.getInstance().u_e2p_1 = doc.u_e2p_1;
    } else {
      GameManager.getInstance().u_e2p_1 = ""
    }

    if (doc.u_e2p_2 != null) {
      GameManager.getInstance().u_e2p_2 = doc.u_e2p_2;
    } else {
      GameManager.getInstance().u_e2p_2 = ""
    }

    this.checkStateNet();
    this.resetStateNT();

    if (doc.ket != null) {
      var value = doc.ket.fee_chanpho;
      GameManager.getInstance().ketDataConfig = doc.ket;
      GameManager.getInstance().ketDataConfig.fee = [];
      for (var i = 0; i < value.length; i++) {
        GameManager.getInstance().ketDataConfig.fee.push(value[i]);
      }
    }
    if (doc.everyDayNoti != null) {
      GameManager.getInstance().everyDayNoti = doc.everyDayNoti;
    }
    if (doc.hotline != null) {
      cc.sys.localStorage.setItem("hotline", doc.hotline);
    }
    GameManager.getInstance().status = doc.status;
    if (doc.status) {
      // LAY THONG TIN UPDATE
      // khi status==true thi moi ton tai cac truong duoi day.
      GameManager.getInstance().mode = doc.umode;
      cc.sys.localStorage.setItem("mode", GameManager.getInstance().mode);
      GameManager.getInstance().op1 = doc.uop1;
      GameManager.getInstance().op2 = doc.uop2;
      GameManager.getInstance().msg = doc.umsg;
      GameManager.getInstance().link = doc.utar;
    } else {
      GameManager.getInstance().op1 = "";
      GameManager.getInstance().op2 = "";
      GameManager.getInstance().msg = "";
      GameManager.getInstance().link = "";
      GameManager.getInstance().mode = 0;
    }
    if (this._isOff) {
      var url_payment_config = doc.url_chip_in_game;
      var request = new XMLHttpRequest();
      request.open("GET", this.cors_url + url_payment_config, true);
      request.setRequestHeader("Access-Control-Allow-Origin", "*");
      if (cc.sys.isNative) {
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      request.send();
      request.onload = function () {
        //  cc.NGWlog("config_4: ", request.responseText);
        if (request.responseText.length == 0) {

        }
        else if (!JSON.parse(request.responseText)) {
        } else {
          cc.sys.localStorage.setItem("config_4", request.responseText);
          //cc.NGWlog('config4 la=== ' + request.responseText);
        }
        _this.handleConfig_4(cc.sys.localStorage.getItem("config_4"));
      };

      request.onerror = function () {
        // cc.NGWlog("load error");
        //  setTimeout(()=>{
        //   _this.handleConfig_3(result);
        //  },500)
        _this.handleConfig_4(cc.sys.localStorage.getItem("config_4"));
      };
    }


    var url_text_en = doc.url_text_en;
    cc.NGWlog("text en:" + doc.url_text_en);
    var url_text_other = doc.url_text_myanmar;

    if (url_text_en && url_text_en.localeCompare("") != 0) {
      var request111 = new XMLHttpRequest();
      request111.open("GET", this.cors_url + url_text_en, true);
      request111.setRequestHeader("Access-Control-Allow-Origin", "*");
      if (cc.sys.isNative) {
        request111.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      request111.send();


      request111.onloadend = function () {

        if (request111.responseText.length == 0)
          cc.NGWlog("Load success data configtext ra null rồi :(");
        else if (!JSON.parse(request111.responseText)) {
        } else {
          cc.sys.localStorage.setItem(
            "config_text_lang_en",
            request111.responseText
          );
        }


      };

      request111.onerror = function () {
        cc.NGWlog("load error");
      };
    }


    if (url_text_other && url_text_other.localeCompare("") != 0) {
      var request1 = new XMLHttpRequest();

      request1.open("GET", this.cors_url + url_text_other, true);
      request1.setRequestHeader("Access-Control-Allow-Origin", "*");
      if (cc.sys.isNative) {
        request1.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      request1.send();


      request1.onload = function () {
        if (request1.responseText.length == 0)
          cc.NGWlog("Load success data configtext ra null rồi :(");
        else if (!JSON.parse(request1.responseText)) {
          cc.NGWlog("doc configtext error");

        } else {
          cc.NGWlog('set dc text cam');
          cc.sys.localStorage.setItem(
            "config_text_lang_myanmar",
            request1.responseText
          );
        }

      };

      request1.onerror = function () {
        cc.NGWlog("load error");
      };
    }

    // benefit
    if (this._isOff) {
      var url_benefit_config = doc.u_benefit;
      var request_bebefit = new XMLHttpRequest();

      request_bebefit.open("GET", this.cors_url + url_benefit_config, true);
      request_bebefit.setRequestHeader("Access-Control-Allow-Origin", "*");
      if (cc.sys.isNative) {
        request_bebefit.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }
      request_bebefit.send();


      request_bebefit.onload = function () {
        // cc.NGWlog("config_benefit: ", request_bebefit.responseText);
        if (request_bebefit.responseText.length == 0)
          cc.NGWlog("Load success data benefit ra null rồi :(");
        else if (!JSON.parse(request_bebefit.responseText)) {
          cc.NGWlog("doc benefit error");

        } else {
          cc.sys.localStorage.setItem(
            "benefit_config",
            request_bebefit.responseText
          );
          _this.handle_benefit_config(
            cc.sys.localStorage.getItem("benefit_config")
          );
        }
      };

      request_bebefit.onerror = function () {
        cc.NGWlog("load error");
        _this.handle_benefit_config(
          cc.sys.localStorage.getItem("benefit_config")
        );
      };
    }
    if (this._isOff) {
      cc.NGWlog("chay vao setInfoButonWithConfig " + GameManager.getInstance().is_dt);
      Global.MainView.setInfoButonWithConfig();
      if (require("GameManager").getInstance().status) {
        if (require("GameManager").getInstance().mode == 0) { // mode == 0, vao thang ko can hoi
          cc.NGWlog('umode0: show login');
          // showcc.NGWlogin();
        } else if (require("GameManager").getInstance().mode == 1) { // mode == 1, hoi update, 2 lua chon
          cc.NGWlog('umode1');
          GameManager.getInstance().onShowWarningDialog(
            GameManager.getInstance().msg,
            DIALOG_TYPE.TWO_BTN,
            GameManager.getInstance().op1,
            () => {
              cc.sys.openURL(require("GameManager").getInstance().link);
              GameManager.getInstance().onQuitGame();
            },
            GameManager.getInstance().op2
          );

        } else if (require("GameManager").getInstance().mode == 2) { // mode == 2, hoi update, khong lua chon
          cc.NGWlog('umode2');
          GameManager.getInstance().onShowWarningDialog(
            GameManager.getInstance().msg,
            DIALOG_TYPE.ONE_BTN,
            GameManager.getInstance().op1,
            () => {
              cc.sys.openURL(require("GameManager").getInstance().link);
              GameManager.getInstance().onQuitGame();
            }
          );

        }
        else if (require("GameManager").getInstance().mode == 3) { // mode == 3, thong bao, 1 lua chon OK va vao game
          cc.NGWlog('umode3');
          require("UIManager").instance.onShowConfirmDialog(require("GameManager").getInstance().msg);
        }
        else if (require("GameManager").getInstance().mode == 4) { // mode == 4, thong bao, 1 lua chon OK va finish
          cc.NGWlog('umode4');
          GameManager.getInstance().onShowWarningDialog(
            GameManager.getInstance().msg,
            DIALOG_TYPE.ONE_BTN,
            GameManager.getInstance().op1,
            () => {
              GameManager.getInstance().onQuitGame();
            }
          );
        }
      }
    }



  },
  handleConfig_4: function handleConfig_4(result) {
    cc.log("config4 la== " + result);
    try {
      var doc = JSON.parse(result);
    } catch (err) {
      cc.NGWlog("========> handleConfig_4:  " + err);
    }

    if (doc.iap_ios !== null) {
      GameManager.getInstance().listIAP = doc.iap_ios;
      if (IS_RUN_INSTANT_FACEBOOK)
        return;
    }
    if (doc.sms_items !== null) {
      GameManager.getInstance().listDCB = doc.sms_items;
    }
    if (doc.wave !== null) {
      GameManager.getInstance().listWave = doc.wave;
    }
    if (doc.easy_points !== null) {
      GameManager.getInstance().listEasyPoint = doc.easy_points;
    }
    if (doc.red_dot !== null) {
      GameManager.getInstance().listReddot = doc.red_dot;
    }
    
    // if (doc.pay !== null) {
    //  GameManager.getInstance().listAsia = doc.asia;
    // }



    if (this._isOff) {

      let isViewShop = false;
      if (Global.ShopView.node.parent != null) {
        isViewShop = true;
      }
      cc.loader.loadRes('prefabsPopup/ShopView', (er, prefab) => {
        let item = cc.instantiate(prefab).getComponent('ShopView');
        if (isViewShop) {
          require('UIManager').instance.instantiate_parent.addChild(item.node);
          Global.ShopView.node.destroy();
          Global.ShopView = item;
        }
      })
    }

  },

  handle_benefit_config: function handle_benefit_config(result) {
    GameManager.getInstance().list_benefit = [];
    GameManager.getInstance().list_topgamer = [];

    var doc = JSON.parse(result);
    // cc.NGWlog("benefit = " + doc + "type = " + typeof (doc));
    // cc.NGWlog(doc);

    if (!doc) {
      cc.NGWlog("benefit_config parse error");
      return;
    }
    if (doc.benefit != null) {
      var data = doc.benefit;

      for (var i = 0; i < data.length; i++) {
        var item = {};
        item.nameEn = data[i].des_en;
        item.nameMy = data[i].des_mm;
        item.vector_vip_bool = [];
        item.vector_vip_num = [];
        item.vector_vip_percent = [];
        var arr = data[i].vip;
        for (var j = 0; j < arr.length; j++) {
          if (
            item.nameEn.localeCompare("Using Safe") == 0 ||
            item.nameEn.localeCompare("Daily Giftcode") == 0
          )
            item.vector_vip_bool.push(arr[j]);
          else item.vector_vip_num.push(arr[j]);

          if (item.nameEn.localeCompare(" % Bonus Payment") == 0)
            item.vector_vip_percent.push(arr[j]);
        }

        GameManager.getInstance().list_benefit.push(item);
      }

    }
    if (doc.jackpot != null) {
      GameManager.getInstance().binhJPListMark = doc.jackpot[0].mark;
      GameManager.getInstance().binhJPListChip = doc.jackpot[0].chip;
    }
    if (doc.top_sc != null) {
      GameManager.getInstance().list_topgamer = doc.top_sc;
      // var data = doc.top;

      // for (var i = 0; i < data.length; i++) {
      //   var item = {};
      //   item.id_game = data[i].gameid;
      //   item.nameEn = data[i].des_en;
      //   item.nameMy = data[i].des_mm;
      //   item.txt_link = data[i].url_img;
      //   item.txt_link_js = data[i].url_img_js;

      //   cc.NGWlog('TXT_LINK', item.txt_link);
      //   cc.NGWlog('TXT_LINK_JS', item.txt_link_js);
      //  GameManager.getInstance().list_topgamer.push(item);
      // }
    }

    if (doc.agInvite != null) {
      GameManager.getInstance().agInvite = doc.agInvite;
    }
    if (doc.agInviteFr != null) {
      GameManager.getInstance().agInviteFr = doc.agInviteFr;
    }
    if (doc.agShareImg != null) {
      GameManager.getInstance().agShareImg = doc.agShareImg;
    }
    if (doc.agContactAd != null) {
      GameManager.getInstance().agContactAd = doc.agContactAd;
    }
    if (doc.agVerify != null) {
      GameManager.getInstance().agVerify = doc.agVerify;
    }

    if (doc.agRename != null) {
      GameManager.getInstance().agRename = doc.agRename;
    }
  },

  start() {
    if (IS_RUN_INSTANT_FACEBOOK) {
      FBInstant.player.getSignedPlayerInfoAsync().then(function (result) {
        cc.NGWlog("--------> FB ", result);
        GameManager.getInstance().access_token = result.getSignature();
      });
    }
    // this.node.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
  },
  checkStateNet() {
    cc.NGWlog("====D checkStateNet", GameManager.getInstance().state_net, GameManager.getInstance().ishaveSimCam, GameManager.getInstance().disId);
    if (require("GameManager").getInstance().state_net) {
      if (cc.sys.os === cc.sys.OS_IOS) {

        for (var i = 0; i < GameManager.getInstance().state_list.length; i++) {
          if (require("GameManager").getInstance().mccsim1 == GameManager.getInstance().state_list[i] || GameManager.getInstance().mccsim2 == GameManager.getInstance().state_list[i]) {
            GameManager.getInstance().ishaveSimCam = true;
            break;
          }
        }

      }
      else {
        GameManager.getInstance().ishaveSimCam = true;
      }
    }
  },

  resetStateNT() {
    cc.NGWlog("====D reset State", GameManager.getInstance().state_net, GameManager.getInstance().ishaveSimCam, GameManager.getInstance().disId);
    if (require("GameManager").getInstance().state_net && !require("GameManager").getInstance().ishaveSimCam) {
      GameManager.getInstance().statePoay = false;
    } else {
      GameManager.getInstance().statePoay = true;
    }

    if (require("GameManager").getInstance().statePoay) {
      GameManager.getInstance().dcb_ceoda = Object.assign({}, GameManager.getInstance().dcb_ceoda_save)
      GameManager.getInstance().wave = Object.assign({}, GameManager.getInstance().wave_save);
      GameManager.getInstance().easy_point = Object.assign({}, GameManager.getInstance().easy_point_save);
      GameManager.getInstance().reddot = Object.assign({}, GameManager.getInstance().reddot_save);

      GameManager.getInstance().vchanpho = GameManager.getInstance().vchanpho_save;
      GameManager.getInstance().ismaqt = GameManager.getInstance().ismaqt_save;
      GameManager.getInstance().ismaiv = GameManager.getInstance().ismaiv_save;

    } else {
      //   // cc.NGWlog("An payyyyy");
      GameManager.getInstance().dcb_ceoda.state = false;
      GameManager.getInstance().wave.state = false;
      GameManager.getInstance().easy_point.state = false;
      GameManager.getInstance().reddot.state = false;
      GameManager.getInstance().ismaqt = false;
      GameManager.getInstance().ismaiv = false;
      GameManager.getInstance().vchanpho = 11;
      GameManager.getInstance().is_agency_shop = false;
    }
  },
  getCashOutInfo() {
    var _this = this;
    var request = new XMLHttpRequest();
    request.open("GET", this.cors_url + this.url_dt, true);
    request.setRequestHeader("Access-Control-Allow-Origin", "*");
    request.send();
    request.onloadend = function () {
      // cc.NGWlog("Doi Thuong ===test lai la: ", request.responseText);
      if (request.responseText.length === 0) {
      } else if (!JSON.parse(request.responseText)) {
        cc.NGWlog("cashout = " + request.responseText);
      } else {
        cc.sys.localStorage.setItem("cashout", request.responseText);
      }
      _this.handleCashOutInfo(cc.sys.localStorage.getItem("cashout"));
    };

    request.onerror = function () {
      _this.handleCashOutInfo(cc.sys.localStorage.getItem("cashout"));
    };

  },
  handleCashOutInfo(result) {
    var _this = this;
    var doc = JSON.parse(result);
    GameManager.getInstance().listAgDT = doc.dt_list;
    GameManager.getInstance().listAgency = doc.dt_info;
  },

  // update (dt) {},
});
export default LoadingGame;