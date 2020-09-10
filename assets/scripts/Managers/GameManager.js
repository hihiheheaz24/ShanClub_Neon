const User = require("User");
const UIManager = require("UIManager");
const PromotionInfo = require("PromotionInfo");
const itemJackPotHistory = require('itemJackPotHistory')
var GameManager = cc.Class({
	name: "GameManager",
	ctor: function () {
		this.typeLogin = 1,
			this.dcb_ceoda = {
				name: "p1",
				state: false,
				v: 0,
				p: []
			};
		this.wave = {
			name: "p3",
			state: false,
			v: 0,
			p: []
		};
		this.reddot = {
			name: "p4",
			state: false,
			v: 0,
			p: []
		};
		this.easy_point = {
			name: "p5",
			state: false,
			v: 0,
			p: []
		};

		this.dcb_ceoda_save = {
			name: "p1",
			state: false,
			v: 0,
			p: []
		};
		this.wave_save = {
			name: "p3",
			state: false,
			v: 0,
			p: []
		};
		this.reddot_save = {
			name: "p4",
			state: false,
			v: 0,
			p: []
		};
		this.easy_point_save = {
			name: "p5",
			state: false,
			v: 0,
			p: []
		};
	},
	properties: {
		instance: {
			default: null
		},
		user: {
			default: null,
			type: require("User"),
			serializable: false
		},

		user_name: "",
		user_pass: "",

		ArrServerIP: [],

		storeData: {
			default: [],
			type: [require("StoreData")]
		},
		list_benefit: {
			default: [],
			type: [require("BenefitItem")]
		},

		list_topgamer: {
			default: [],
			type: [require("BenefitItem")]
		},

		ketDataConfig: {
			default: null,
			type: require("KetDataConfig")
		},
		listIp: [],

		listDCB: {
			default: []
			// type: [require('CardItem')]
		},
		listWave: {
			default: []
			//  type: [require('CardItem')]
		},

		listEasyPoint: {
			default: []
			// type: [require('CardItem')]
		},
		listIAP: {
			default: []
		},

		listReddot: {
			default: []
			//  type: [require('CardItem')]
		},

		listAgDT: {
			default: []
		},

		listAgency: {
			default: []
		},

		mail20: {
			default: [],
			type: [require("MailData")]
		},
		mail21: {
			default: [],
			type: [require("MailData")]
		},

		listGame: {
			default: [],
			type: [cc.Integer]
		},

		state_list: {
			default: [],
			type: [cc.Integer]
		},





		listMc: {
			default: [],
			type: [cc.Integer]
		},

		listGold: {
			default: [],
			type: [cc.Integer]
		},

		listTl: {
			default: [],
			type: [cc.Integer]
		},
		list_data_history_safe: {
			default: [],
			type: [require("HistorySafeData")]
		},

		list_data_jackpot_history: {
			default: [],
			type: [require("itemJackPotHistory")]
		},

		ShopProvider: {
			default: [],
			type: [cc.String]
		},

		ShopState: {
			default: [],
			type: [cc.Boolean]
		},

		promotionInfo: {
			default: null,
			type: require("PromotionInfo"),
			serializable: false
		},
		isChangeTable: false,
		// vectorDelay: [],
		checkPassId: 0,
		login_timeout: null,


		///////////////  CONFIG  /////////////
		// string
		fanpageID: "",
		groupID: "",
		urlLogGame: "",
		fanpageURL: "",
		avatar_link: "",
		avatarFb_link: null,
		groupURL: "",
		hashTagShareImage: "#ShanClub #Card #Game",
		hotline: "",
		url_payment_config: "",
		url_text_en: "",
		url_text_other: "",
		url_benefit_config: "",
		disId: "",
		versionGame: "1.43", //fix version
		bundleID: "csn.shan.club.online",
		publisher: "shanjs_1_43_android", // //fix version
		os: "android_cocosjs",
		deviceId: "",
		signdata: "",
		signature: "",
		receipt: "",
		status: false,
		mode: 0,
		op1: "",
		op2: "",
		msg: "",
		link: "",
		number_verify: "",
		language: "",
		devicename: "web",
		//versionGame: "web",
		osversion: "web",
		brand: "web",
		binhJPListMark: [],
		binhJPListChip: [],
		newest_versionUrl: "",



		// number
		request_vip_payment: 11,
		avatar_count: 10,
		vip_rename: 2,
		ag_rename: 10000,
		ag_rename_min: 100,
		ag_rename_verify: 10000,
		ag_rename_verify_min: 20,
		agInvite: 0,
		vchanpho_save: 11,
		vchanpho: 11,
		time_loadcf: 1800,
		numberMail: 0,
		numberMailAdmin: 0,
		agSauCacTL: 5,
		url_rule: '',
		agInvite: 0,
		agInviteFr: 0,
		agShareImg: 0,
		agContactAd: 0,
		agVerify: 0,
		agRename: 0,
		time_out_game: 0,
		mccsim1: 0,
		mccsim2: 0,
		u_chat_fb: "",
		curJackPotBinh: 0,
		curJackPotSlot: 0,

		// boolean
		ishaveSimCam: false,
		checkMobileNetwork: false,
		isVerifyMobile: false,
		is_bl_fb: false,
		is_mission: false,
		is_bl_salert: false,
		isBn: false,
		allowPushOffline: false,
		isLoginSucces: false,
		is_dt: false,
		v_dt: false,
		is_login_fb: true,
		ismaqt_save: false,
		ismaqt: false,
		ismaiv_save: false,
		ismaiv: false,
		state_net: true,
		sms: false,
		iap: false,
		gameNoti: false,
		is_login_guest: true,
		somoso_all: false,
		somoso_ceoda: false,
		cearode_ceoda: false,
		wayve_ceoda: false,
		chamdo_ceoda: false,
		somoso_ceoda_save: false,
		cearode_ceoda_save: false,
		wayve_ceoda_save: false,
		chamdo_ceoda_save: false,
		diemde_save: false,
		molo_enhipe_save: false,
		statePoay: false,
		somoso: false,
		card: false,
		banh: false,
		isFirstClickGame: false,
		showPopConnect: true,
		isShowPermission: false,
		versionA: null,
		versionB: null,
		is_agency_shop: false,
		vsaubanh: 11,
		is_xs: false,
		// is_ltv: false,
		// use_p: null,
		is_xa: false,
		is_send_ltv: false,

		u_p: "",
		u_pp: "",
		u_ep: "",
		u_e2p_1: "",
		u_e2p_2: "",

		wave_save: null,
		reddot_save: null,
		easy_point_save: null,

		iap_config: true,
		///////// END CONFIG ///////////////
		isLogOut: true,  // Check logOut

		list_alert: {
			default: [],
			type: [cc.String]
		},

		cors_url: "https://cors-anywhere.herokuapp.com/",
		isLanguageEnDefault: 0, //0-en, 1-other 1, 2-other 2 .....
		language_en_json: "",
		language_my_json: "",


		isReconnect: false,
		isLoginOnGame: false,
		isChooseGame: false,
		curGameId: 0,
		curGameViewId: 0,
		curServerIp: "",
		tableId: 0,
		table_mark: 0,

		is_show_alert: false,
		is_click_receive_chip_onl: true,
		is_show_confirm_dialog_mail: false,

		is_on_background: false,

		gameView: null,
		userNameRegTempl: "",
		passRegTemple: "",
		passwordToBeChanged: "",
		invitePlayGame: true,
		startLogin: false,
		access_token: "",
		identityTokenAppleID: "",
		currentView: "",
		pathScreenShot: "",
		listVerGame: [],
		dataBetRouletteOffline: [], //roulette off
		totalBetRouletteOffline: 0,

		totalBetBaccaratOff: 0, //Baccarat off
		soLanDatCuocBaccaratOff: 0,
		dataBetBaccaratOff: [],
		dataHistoryBaccaratOff: [],
		bankerWinCountBaccaratOff: 0,
		playerWinCountBaccaratOff: 0,
		tieWinCountBaccaratOff: 0,
		bankerPairCountBaccaratOff: 0,
		playerPairCountBaccaratOff: 0,
		mcbBaccaratOff: 1,
		listCCFS: [],
		isPlayNowBanner: false,
		everyDayNoti: [],
		isDisconnect: false
	},
	statics: {
		getInstance: function () {
			if (this.instance == null) {
				this.instance = new GameManager();
				this.instance.user = new User();
				this.instance.promotionInfo = new PromotionInfo();
				// this.instance.initConfig();
			}
			return this.instance;
		}
	},
	resetUse_p() {
		this.dcb_ceoda = {
			name: "p1",
			state: false,
			v: 0,
			p: []
		};
		this.wave = {
			name: "p3",
			state: false,
			v: 0,
			p: []
		};
		this.reddot = {
			name: "p3",
			state: false,
			v: 0,
			p: []
		};
		this.easy_point = {
			name: "p5",
			state: false,
			v: 0,
			p: []
		};


		this.dcb_ceoda_save = {
			name: "p1",
			state: false,
			v: 0,
			p: []
		};
		this.wave_save = {
			name: "p3",
			state: false,
			v: 0,
			p: []
		};
		this.reddot_save = {
			name: "p3",
			state: false,
			v: 0,
			p: []
		};
		this.easy_point_save = {
			name: "p5",
			state: false,
			v: 0,
			p: []
		};
	},
	initConfig() {
		let text_en_onl = cc.sys.localStorage.getItem("config_text_lang_en");
		let text_my_onl = cc.sys.localStorage.getItem("config_text_lang_myanmar");
		if (text_en_onl == null) {
			this.language_en_json = require('UIManager').instance.text_Config[0].json.ConfigClient;
		} else {
			this.language_en_json = JSON.parse(text_en_onl).ConfigClient
		}
		if (text_my_onl == null) {
			this.language_my_json = require('UIManager').instance.text_Config[1].json.ConfigClient;
		} else {
			this.language_my_json = JSON.parse(text_my_onl).ConfigClient
		}

		this.language_en_json = require('UIManager').instance.text_Config[0].json.ConfigClient;
		this.language_my_json = require('UIManager').instance.text_Config[1].json.ConfigClient;
	},
	setPromotionInfo(jsonData) {
		this.promotionInfo.notEnoughMoney = jsonData.P;
		this.promotionInfo.adminMoney = jsonData.A;
		this.promotionInfo.upVip = jsonData.UV;
		this.promotionInfo.online = jsonData.O;
		this.promotionInfo.video = jsonData.V;
		this.promotionInfo.giftCode = jsonData.C;
		this.promotionInfo.time = jsonData.T;
		this.promotionInfo.videoCurrent = jsonData.VC;
		this.promotionInfo.videoMax = jsonData.VM;
		this.promotionInfo.onlineCurrent = jsonData.OC;
		this.promotionInfo.onlineMax = jsonData.OM;
		this.promotionInfo.agViewVideo = jsonData.NV;
		this.promotionInfo.agOnline = jsonData.NO;
		this.promotionInfo.agInviteFriend = jsonData.NIV;
		this.promotionInfo.inviteMark = jsonData.InviteMark;
		this.promotionInfo.inviteNum = jsonData.InviteNum;

		//this.promotionInfo.numberP = jsonData.OnlinePolicy.numberP;
		if (jsonData.OnlinePolicy) {
			let OnlinePolicy = JSON.parse(jsonData.OnlinePolicy);
			this.promotionInfo.numberP = OnlinePolicy.numberP;
			this.promotionInfo.timeWaiting = OnlinePolicy.timeWaiting;
			this.promotionInfo.chipBonus = OnlinePolicy.chipBonus;
		}
	},
	initUser(jsonData) {

		var jsonValue = JSON.parse(jsonData.data);
		cc.NGWlog("data login tra ve== " + JSON.stringify(jsonValue));
		let objData = {};
		if (jsonData.hasOwnProperty('evt')) {
			objData.evt = jsonData.evt;
		}
		objData.data = JSON.stringify(jsonData);

		this.user.id = jsonValue.Userid;
		this.user.lq = jsonValue.LQ;
		this.user.ag = jsonValue.AG;
		this.user.agSafe = jsonValue.Userid;

		if (this.isDisconnect) {
			this.user.lastGameID = 0;
			cc.NGWlog(' chay vao truong hop 1111111111');
		}
		else {
			this.user.lastGameID = jsonValue.gameid;
			cc.NGWlog(' chay vao truong hop 2222222222');
		}

		this.user.onlineDay = jsonValue.OD;
		this.user.promotionDay = jsonValue.PD;
		this.user.listPromotionDay = [];
		// this.user.vipPoint = jsonValue.vippoint;
		this.user.mvip = jsonValue.MVip;
		this.user.vip = jsonValue.VIP;
		// this.user.level = jsonValue.Userid;
		this.user.avt = jsonValue.LQ;
		this.user.nm = jsonValue.NM % 100;
		this.user.nmAg = parseInt(jsonValue.NM / 100);
		this.user.avtId = jsonValue.A;
		if (IS_RUN_INSTANT_FACEBOOK) {
			this.user.userNameLQ = FBInstant.player.getName();
		} else {
			this.user.userNameLQ = jsonValue.UsernameLQ;
		}

		this.user.uname = jsonValue.Username;
		if (jsonValue.UsernameLQ == "") {
			this.user.displayName = jsonValue.Username;
		} else {
			this.user.displayName = jsonValue.UsernameLQ;
		}

		this.user.tinyURL = jsonValue.Tinyurl;
		// this.user.avatarUrl = jsonValue.Userid;
		// this.user.status = jsonValue.Userid;
		this.user.auth = jsonValue.auth;
		this.user_name = this.user.uname;
		this.user.co = parseFloat(jsonValue.CO);
		this.user.co0 = parseFloat(jsonValue.CO0);
		this.user.lqsms = parseFloat(jsonValue.LQSMS);
		this.user.lqiap = parseFloat(jsonValue.LQIAP);
		this.user.lqother = parseFloat(jsonValue.LQOther);
		this.user.blq1 = parseFloat(jsonValue.BLQ1);
		this.user.blq3 = parseFloat(jsonValue.BLQ3);
		this.user.blq5 = parseFloat(jsonValue.BLQ5);
		this.user.blq7 = parseFloat(jsonValue.BLQ7);
		this.user.avg7 = parseFloat(jsonValue.AVG7);
		this.user.group = parseInt(jsonValue.Group);

		// if(jsonValue.gameid != 0){
		//  Global.LobbyView.isReconnectGame = true;
		let gameId = GameManager.getInstance().curGameId;
		///let gameId = GameManager.getInstance().user.lastGameID;
		setTimeout(() => {
			require('NetworkManager').getInstance().sendSelectG2(gameId);

			// Si test banner
			// let arrayData = [
			//   {
			//     "arrButton": [
			//       {
			//         "type": "playnow",
			//         "urlBtn": "https://storage.googleapis.com/cdn.ngwcasino.com/NewBanner/LQ0/Lqsms/20191126/btn_buynow_0_5.png",
			//         "pos": [0.5, 0.1], "gameID": 1001, "urlLink": "https://pm.ngwcasino.com/coda/?userid=2175615&price=0.5&paytype=1"
			//       }
			//     ],
			//     "_id": "5e44ab55b901b86d099cb788",
			//     "id": "5e01c72159084b6ac37127c6",
			//     "title": "1. [01-03] [SMS 0.5$ lần đầu 200% - crt1]",
			//     "isClose": true,
			//     "urlImg": "https://storage.googleapis.com/cdn.ngwcasino.com/NewBanner/LQ0/Lqsms/20191126/s_0_5.png",
			//     "isOnList": false,
			//     "showByActionType": 0,
			//     "priority": 6,
			//     "isShowGameView": false
			//   }
			// ]
			// require("UIManager").instance.handleBannerIO(arrayData);
		}, 1000);


		if (this.typeLogin === LOGIN_TYPE.NORMAL || this.typeLogin === LOGIN_TYPE.REG_ACC) {
			this.typeLogin = LOGIN_TYPE.NORMAL;
			cc.sys.localStorage.setItem(
				"user_name",
				this.user_name
			);
			cc.sys.localStorage.setItem(
				"password",
				this.user_pass
			);
		} else if (this.typeLogin === LOGIN_TYPE.PLAYNOW) {
			cc.sys.localStorage.setItem("USER_PLAYNOW", this.user_name);
			cc.sys.localStorage.setItem("PASS_PLAYNOW", this.user_pass);
		}

		if (typeof jsonValue.Mobile === "string") {
			this.number_verify = jsonValue.Mobile;
		}
		if (typeof jsonValue.ListDP === "string") {
			let listdp = jsonValue.ListDP;
			this.user.listPromotionDay = [];
			do {
				if (listdp.indexOf(";") !== -1) {
					let sub = listdp.substring(0, listdp.indexOf(";"));
					listdp = listdp.substring(listdp.indexOf(";") + 1, listdp.length);
					this.user.listPromotionDay.push(sub);
				} else {
					break;
				}
			} while (true);
		}

		if (cc.sys.isNative) {
			require("Util").sendTagOneSignal("deviceid", this.deviceId);
			require("Util").sendTagOneSignal("publisher", this.publisher);
			require("Util").sendTagOneSignal("username", this.user.uname);
			require("Util").sendTagOneSignal("uservip", this.user.vip.toString());
			require("Util").sendTagOneSignal("userid", this.user.id.toString());
			require("Util").sendTagOneSignal("usergold", this.user.ag.toString());
			require("Util").sendTagOneSignal("gameport", OPERATOR.toString());
			require("Util").sendTagOneSignal("pkgname", this.bundleID);
			require("Util").sendTagOneSignal("version", this.versionGame);
			require("Util").sendTagOneSignal("userlq", this.user.lq.toString());
			require("Util").sendTagOneSignal("co", this.user.co.toString());
			require("Util").sendTagOneSignal("co0", this.user.co0.toString());
			require("Util").sendTagOneSignal("lqsms", this.user.lqsms.toString());
			require("Util").sendTagOneSignal("lqiap", this.user.lqiap.toString());
			require("Util").sendTagOneSignal("lqother", this.user.lqother.toString());
			require("Util").sendTagOneSignal("blq1", this.user.blq1.toString());
			require("Util").sendTagOneSignal("blq3", this.user.blq3.toString());
			require("Util").sendTagOneSignal("blq5", this.user.blq5.toString());
			require("Util").sendTagOneSignal("blq7", this.user.blq7.toString());
			require("Util").sendTagOneSignal("avg7", this.user.avg7.toString());
			require("Util").sendTagOneSignal("group", this.user.group.toString());
		}

		var data = {
			evt: "ref",
			data: this.publisher,
			email: "",
			version: this.versionGame
		};
		require("NetworkManager").getInstance().sendService(JSON.stringify(data));
		if (require("LoadingGame").instance !== null) {
			require("LoadingGame").instance.checkStateNet();
			require("LoadingGame").instance.resetStateNT();
		}
		require('SMLSocketIO').getInstance().isSendFirst = true;
		require('SMLSocketIO').getInstance().emitLogin();
		require('SMLSocketIO').getInstance().emitSIOWithValue(objData, "LoginPacket", false);


		if (this.typeLogin === LOGIN_TYPE.PLAYNOW) {
			if (require("NetworkManager").getInstance().isPlayNow) {
				require("TrackingManager").SendTracking(
					TRACKING_TYPE.LoginPlayNowSuccess
				);
			} else {
				require("TrackingManager").SendTracking(
					TRACKING_TYPE.ContinueSuccess
				);
			}
		} else {
			if (this.typeLogin === LOGIN_TYPE.FACEBOOK) {
				require("TrackingManager").SendTracking(
					TRACKING_TYPE.FacebookSuccess
				);
			} else {
				if (!require("TrackingManager").isTracking(TRACKING_TYPE.RegisterClick)) {
					require("TrackingManager").SendTracking(
						TRACKING_TYPE.RegisterSuccess
					);
				} else {
					require("TrackingManager").SendTracking(TRACKING_TYPE.LoginSuccess);
				}
			}
		}
	},

	initIAP() {
		var key_iap = require("GameManager").getInstance().user.id.toString() + "_iap_count";
		var countIAP = cc.sys.localStorage.getItem(key_iap);
		if (countIAP === null || typeof (countIAP) === "undefined") {
			countIAP = 0;
		}
		cc.NGWlog("Tien su:   " + countIAP);
		if (countIAP > 0) {
			for (var i = 0; i < countIAP; i++) {

				if (cc.sys.os === cc.sys.OS_ANDROID) {
					var key_signdata = require("GameManager").getInstance().user.id.toString() + "_signdata_" + i;
					var key_signature = require("GameManager").getInstance().user.id.toString() + "_signature_" + i;
					var signdata = cc.sys.localStorage.getItem(key_signdata);
					var signature = cc.sys.localStorage.getItem(key_signature);
					if (signdata != "" && signature != "" && signdata != null && signature != null && typeof (signdata) !== "undefined" && signature !== "undefined") {
						countIAP--;
						cc.sys.localStorage.setItem(key_iap, countIAP);
						NetworkManager.getInstance().sendIAPResult(signdata, signature);
					}
				} else if (cc.sys.os === cc.sys.OS_IOS) {
					var key_receipt = require("GameManager").getInstance().user.id.toString() + "_receipt_" + i;
					var receipt = cc.sys.localStorage.getItem(key_receipt);
					if (receipt != "" && receipt != null && typeof (receipt) !== "undefined") {
						countIAP--;
						cc.sys.localStorage.setItem(key_receipt, countIAP);
						NetworkManager.getInstance().validateIAPReceipt(receipt);
					}
				}

			}
		}
	},

	onLoginFBInstant() {
		this.typeLogin = LOGIN_TYPE.FACEBOOK_INSTANT;
		cc.sys.localStorage.setItem("lastLogin", LOGIN_TYPE.FACEBOOK_INSTANT);

		if (require('NetworkManager').getInstance().statusConnect != 2) {
			require('NetworkManager').getInstance().connect_sv(cc.sys.localStorage.getItem("curServerIp" + NAME_GAME), '');
			GameManager.isReconnect = true;
			return;
		}

		if (this.access_token === "") {
			cc.NGWlog("k có access_token");
			FBInstant.player.getSignedPlayerInfoAsync().then((result) => {
				cc.NGWlog("----------------=================DEMO 2");
				cc.NGWlog(result.getSignature());
				this.access_token = result.getSignature();
				require("NetworkManager")
					.getInstance()
					.onLogin("1", result.getSignature(), false);
			});
		} else {
			cc.NGWlog("có access_token");
			require("NetworkManager")
				.getInstance()
				.onLogin("1", this.access_token, false);
		}
	},

	onQuitGame() {
		cc.game.end();
		if (IS_RUN_INSTANT_FACEBOOK) FBInstant.quit();
	},


	onReconnect() {
		cc.NGWlog('chay vao ham reconnect game==============================')
		this.isReconnect = true;
		require("UIManager").instance.onLogout();
	},

	getTextConfig(key) {
		let curLang = cc.sys.localStorage.getItem("language_save_2");
		if (curLang === null) curLang = 0;
		switch (parseInt(curLang)) {
			case 0:
				if (this.language_en_json.hasOwnProperty(key)) {
					return this.language_en_json[key];
				} else {
					cc.NGWlog("Missing key " + key)
					return "Missing key " + key;
				}
			case 1:
				if (this.language_my_json.hasOwnProperty(key)) {
					return this.language_my_json[key];
				} else {
					cc.NGWlog("Missing key " + key)
					return "Missing key " + key;
				}
		}
	},

	onShareFacebook() {
		if (IS_RUN_INSTANT_FACEBOOK) {
			cc.NGWlog("---------------------------> onShareFacebook");
			FBInstant.shareAsync({
				intent: "REQUEST",
				text: "Play game with me!!!"
			});
		} else {
			FB.ui(
				{
					method: 'share',
					hashtag: this.hashTagShareImage,
					//href: window.location.href
					href: 'https://sss.serveo.net/build/',
				},
				function (response) {
					cc.NGWlog("gia tri cua response la " + response);
					if (response == '') {
						require("NetworkManager").getInstance().sendShareImageFb();
					} else {
						this.onShowToast("cancel shared");
					}
				}
			);
		}
	},

	formatNumber(number, width = 3) {
		return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//String(number).replace(/(.)(?=(\d{3})+$)/g, '$1,');
	},

	formatMoney(money) {
		// char k[] = { 'K', '\0'};
		// char m[] = { 'M', '\0'};
		// char b[] = { 'B', '\0'};
		// char u[] = { '\0'};
		let isNeg = money < 0 ? true : false;
		let format = "";
		let mo = Math.abs(money);
		money = Math.abs(money);
		//int cha;
		if (mo >= 1000000000) {
			mo /= 1000000000;
			format = "B";
		} else if (mo >= 1000000) {
			mo /= 1000000;
			format = "M"; // vidu money bang 20,000,000
		} else {
			return (isNeg == true ? "-" : "") + this.formatNumber(money);
		}

		let str = money.toString() + "0"; // str length se la 200000000
		let str1 = mo.toString() + "a"; // str1 length se la  20a

		let idex = 0;
		for (let i = 0; i < str.length; i++) {
			if (str[i] !== str1[i]) {
				idex = i;
				break;
			}

		}

		return (isNeg == true ? "-" : "") + Math.floor(mo) + ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : ",") + ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : str.toString()[idex])
			+ (str.toString()[idex + 1] === '0' ? "" : str.toString()[idex + 1]) + format;
	},
	formatMoneyAg(money) {
		// char k[] = { 'K', '\0'};
		// char m[] = { 'M', '\0'};
		// char b[] = { 'B', '\0'};
		// char u[] = { '\0'};
		let format = "";
		let mo = Math.abs(money);
		//int cha;
		if (mo >= 1000000000) {
			mo /= 1000000000;
			format = "B";
		} else if (mo >= 1000000) {
			mo /= 1000000;
			format = "M"; // vidu money bang 20,000,000
		}
		else if (mo >= 1000) {
			mo /= 1000;
			format = "K";
		}
		else {
			return this.formatNumber(money);
		}

		let str = money.toString() + "0"; // str length se la 200000000
		let str1 = mo.toString() + "a"; // str1 length se la  20a

		let idex = 0;
		for (let i = 0; i < str.length; i++) {
			if (str[i] !== str1[i]) {
				idex = i;
				break;
			}

		}

		return (money < 0 ? "-" : "") + Math.floor(mo) + ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : ",") + ((str.toString()[idex] === '0' && str.toString()[idex + 1] === '0') ? "" : str.toString()[idex])
			+ (str.toString()[idex + 1] === '0' ? "" : str.toString()[idex + 1]) + format;
	},
	formatMoneyChip(money) { // hoi duc va hien truoc khi su dung.thanks!
		let format = "";
		let mo = Math.abs(money);
		//int cha;
		if (mo >= 1000000000) {
			mo /= 1000000000;
			format = "b";
		} else if (mo >= 1000000) {
			mo /= 1000000;
			format = "m";
		} else if (mo >= 1000) {
			mo /= 1000;
			format = "k";
		} else {
			return this.formatNumber(money);
		}

		return money < 0 ? "-" + mo + format : mo + format;
	},
	cutString(string, maxLength) {
		if (string.length > maxLength) {
			if (maxLength > 3) {
				return string.substring(0, maxLength - 3) + "...";
			} else {
				return string.substring(0, maxLength);
			}
		}
		return string;
	},

	onShowHideWaiting(isShow, timeShow = 20) {
		if (UIManager.instance == null) return;
		if (isShow) {
			UIManager.instance.onShowLoad();
		} else {
			cc.NGWlog('hide load ben game Manager');
			UIManager.instance.onHideLoad();
		}
	},

	onShowToast(message) {
		if (UIManager.instance == null) return;
		UIManager.instance.showToast(message);
	},

	onShowConfirmDialog(message, func_1 = null) {
		if (UIManager.instance == null) return;
		return UIManager.instance.onShowConfirmDialog(message, func_1);
	},

	/**
	 *
	 * message - Noi dung
	 * dialogType - Kieu dialog: 1 Nut, 2 Nut, 3 Nut
	 * nameBtn1 - Nhan~ Nut 1
	 * func_1 - function callback Nut 1
	 * nameBtn2 = '' - Nhan~ Nut 2
	 * func_2 = null - function callback Nut 2
	 * nameBtn3 = '' - Nhan~ Nut 3
	 * func_3 = null - function callback Nut 3
	 *
	 */
	onShowWarningDialog(
		message,
		dialogType,
		nameBtn1,
		func_1,
		nameBtn2 = "",
		func_2 = null,
		nameBtn3 = "",
		func_3 = null
	) {
		if (UIManager.instance == null) return;
		return UIManager.instance.onShowWarningDialog(
			message,
			dialogType,
			nameBtn1,
			func_1,
			nameBtn2,
			func_2,
			nameBtn3,
			func_3
		);
	},

	/**
	 *
	 * message - Noi dung
	 * dialogType - Kieu dialog: 1 Nut, 2 Nut, 3 Nut
	 * nameBtn1 - Nhan~ Nut 1
	 * func_1 - function callback Nut 1
	 * nameBtn2 = '' - Nhan~ Nut 2
	 * func_2 = null - function callback Nut 2
	 * nameBtn3 = '' - Nhan~ Nut 3
	 * func_3 = null - function callback Nut 3
	 * timeDelay = -1 - Thoi gian delay dialog, < 0 la ko lam gi
	 * delayType = 0 - Het thoi gian de lay se goi function: 1, 2, 3, = 0 la close
	 *
	 */
	onShowWarningDialogHasDelayTime(
		message,
		dialogType,
		nameBtn1,
		func_1,
		nameBtn2 = "",
		func_2 = null,
		nameBtn3 = "",
		func_3 = null,
		timeDelay = 0,
		delayType = 0
	) {
		if (UIManager.instance == null) return;
		return UIManager.instance.onShowWarningDialogHasDelayTime(
			message,
			dialogType,
			nameBtn1,
			func_1,
			nameBtn2,
			func_2,
			nameBtn3,
			func_3,
			timeDelay,
			delayType
		);
	},

	loadTexture(sprite, res) {
		// cc.NGWlog( typeof sprite);
		cc.loader.loadRes(res, cc.SpriteFrame, function (err, spriteFrame) {
			if (err) {
				cc.NGWlog(err);
				return;
			}
			if (sprite.getComponent(cc.Sprite) !== null) {
				sprite.getComponent(cc.Sprite).spriteFrame = spriteFrame;
			}
		});
	},

	loadTextureFromUrl(sprite, url) {
		//let avtlink="https://graph.facebook.com/v2.4/100004625341827/picture?width=200&height=200&redirect=true";
		let urlCor = this.cors_url;
		if (cc.sys.isNative || IS_RUN_INSTANT_FACEBOOK) {
			urlCor = "";
		}
		if (url.indexOf(".png") === -1) {
			cc.loader.load({ url: urlCor + url, type: "png" }, (err, tex) => {
				if (err || sprite === null || typeof (sprite.spriteFrame) == "undefined") {
					cc.NGWlog("loadTextureFromUrl FB error:" + err);
					return;
				}
				sprite.spriteFrame = new cc.SpriteFrame(tex);
			});
		} else {
			cc.loader.load(urlCor + url, (err, tex) => {
				if (err || sprite === null || typeof (sprite.spriteFrame) === "undefined") {
					cc.NGWlog('Error Load Image')
					return;
				}
				sprite.spriteFrame = new cc.SpriteFrame(tex);
			});
		}
	},
	effRunNumber(lb, curValue, lastValue, timeRun) {
		lb.node.stopAllActions();
		if (curValue === lastValue) return;
		lb.string = curValue;
		let deltaNum = lastValue - curValue;
		let numPerTime = deltaNum / (timeRun * 20);
		let acPlus = cc.repeat(cc.sequence(cc.callFunc(() => {
			curValue += numPerTime;
			if (deltaNum > 0) {
				if (curValue >= lastValue) {
					curValue = lastValue;
					lb.node.stopActionByTag(0);
				}
			} else {
				if (curValue <= lastValue) {
					curValue = lastValue;
					lb.node.stopActionByTag(0);
				}
			}
			lb.string = require("GameManager").getInstance().formatNumber(Math.round(curValue));
		}), cc.delayTime(timeRun / 20)), 20 * timeRun);
		acPlus.setTag(0);
		let acScale1 = cc.scaleTo(timeRun * (2 / 3), 1.1).easing(cc.easeSineOut());
		let acScale2 = cc.scaleTo(timeRun * (1 / 3), 1.0).easing(cc.easeSineIn());
		let acScale = cc.sequence(acScale1, acScale2);
		//lb.node.runAction(cc.spawn(acPlus, acScale));
		lb.node.runAction(acPlus);
	},
	setCurView(curView) {
		cc.NGWlog("------> setCurView ", curView);
		this.currentView = curView.toString();
		if (this.isLoginSucces) {
			require("TrackingManager").logEvent();
			require('SMLSocketIO').getInstance().emitUpdateInfo();
			cc.NGWlog("------> setCurView1 dmmm ", curView);
		}
	},
	getCurrentSceneName() {
		var sceneName = "";
		if (this.currentView == this.curGameViewId.toString()) {
			sceneName = "GAMEVIEW_" + this.curGameId;
		}
		else {
			switch (this.currentView) {
				case CURRENT_VIEW.LOGIN_VIEW:
					sceneName = "LOGINVIEW";
					break;

				case CURRENT_VIEW.LOBBY:
					sceneName = "LOBBYVIEW";
					break;
				case CURRENT_VIEW.LOTOVIEW:
					sceneName = "LOTOVIEW";
					break;

				case CURRENT_VIEW.PAYMENT:
					sceneName = cc.js.formatStr("%s%s", "PA", "YMENTVIEW");
					break;

				case CURRENT_VIEW.MAIL:
					sceneName = "MAILVIEW";
					break;

				case CURRENT_VIEW.PERSONAL:
					sceneName = "PERSONALVIEW";
					break;

				case CURRENT_VIEW.CHAT_FRIEND:
					sceneName = "CHATFRIENDVIEW";
					break;

				case CURRENT_VIEW.RULE_VIEW:
					sceneName = "RULEVIEW";
					break;

				case CURRENT_VIEW.GAMELIST_VIEW:
					sceneName = "GAMELISTVIEW";
					break;

				case CURRENT_VIEW.FEEDBACK_VIEW:
					sceneName = "FEEDBACKVIEW";
					break;

				case CURRENT_VIEW.NEWS_VIEW:
					sceneName = "NEWSVIEW";
					break;

				case CURRENT_VIEW.SETTING_VIEW:
					sceneName = "SETTINGVIEW";
					break;

				case CURRENT_VIEW.JACKPOT_VIEW:
					sceneName = "JACKPOTVIEW";
					break;

				case CURRENT_VIEW.GUIDE_INGAME:
					sceneName = "GUIDEINGAMEVIEW";
					break;

				case CURRENT_VIEW.COUNTDOWN:
					sceneName = "COUNTDOWNVIEW";
					break;

				case CURRENT_VIEW.REGISTER_VIEW:
					sceneName = "REGISTERVIEW";
					break;

				case CURRENT_VIEW.RANK_VIEW:
					sceneName = "RANKVIEW";
					break;
				case CURRENT_VIEW.DT_VIEW:
					sceneName = "DTVIEW";
					break;

				case CURRENT_VIEW.KET_VIEW:
					sceneName = "KETVIEW";
					break;

				case CURRENT_VIEW.CHATWORLD:
					sceneName = "CHATWORLDVIEW";
					break;

				case CURRENT_VIEW.TOP_VIEW:
					sceneName = "TOPVIEW";
					break;

				case CURRENT_VIEW.FRIEND_VIEW:
					sceneName = "FRIENDVIEW";
					break;

				case CURRENT_VIEW.CREATE_TABLE_GAME:
					sceneName = "CREATETABLEVIEW";
					break;

				case CURRENT_VIEW.GIFT_CODE_VIEW:
					sceneName = "GIFTCODEVIEW";
					break;

				case CURRENT_VIEW.MISSION_VIEW:
					sceneName = "MISSIONVIEW";
					break;

				case CURRENT_VIEW.TOPRICH_VIEW:
					sceneName = "TOPRICHVIEW";
					break;

				case CURRENT_VIEW.SEND_GIFT_VIEW:
					sceneName = "SENDGIFTVIEW";
					break;

				case CURRENT_VIEW.MAIL_CHIP_VIEW:
					sceneName = "MAILVIEW";
					break;

				case CURRENT_VIEW.FREECHIP_VIEW:
					sceneName = "FREECHIPVIEW";
					break;

				case CURRENT_VIEW.PROFILE_VIEW:
					sceneName = "PROFILEVIEW";
					break;
				case CURRENT_VIEW.INFO_FRIEND_VIEW:
					sceneName = "INFOFRIENDVIEW";
					break;

				default:
					break;
			}
		}
		cc.NGWlog("------> Return sceneName ", sceneName);
		return sceneName;
	},
	userChangePass() {
		this.onShowConfirmDialog(this.getTextConfig('change_pass_succes'), () => {
			UIManager.instance.onLogout();
		});

		if (this.user_name == cc.sys.localStorage.getItem("USER_PLAYNOW")) {
			cc.sys.localStorage.setItem("PASS_PLAYNOW", this.passwordToBeChanged);
		}

		if (this.user_name == cc.sys.localStorage.getItem("user_name")) {
			cc.sys.localStorage.setItem("password", this.passwordToBeChanged);
		}

		Global.RegisterPopup.onClose();
	},
	userUpVip(jsonData) {
		this.user.vip = 1;
		this.user.ag += jsonData.AG;
		//console.log("this.user.ag",this.gameView.thisPlayer.ag);
		Global.MainView.setInfo();
		Global.MainView.isUpVip = true;
		Global.ProfileView.updateVip();
		Global.InfoPlayerView.updateVip();
		this.user.vip = 1;
		this.onShowConfirmDialog(this.getTextConfig('archive_vip1'));
		console.log()
		if (this.gameView === null) {
			Global.MainView.isUpVip = false;
		} else {
			//this.gameView.thisPlayer.ag=this.user.ag;
			if (this.gameView.thisPlayer !== null && this.curGameId != GAME_ID.ROULETTE) {
				this.gameView.thisPlayer.vip = 1;
				if (this.gameView.thisPlayer._playerView !== null) {
					this.gameView.thisPlayer.updateVip();
					if (this.curGameId !== GAME_ID.SHOW)
						this.gameView.thisPlayer.ag += jsonData.AG;
				}
			}
		}
		if (require("LoadingGame").instance !== null) {
			require("LoadingGame").instance.resetStateNT();
		}
	},
	userChangename(jsonData) {
		this.user.uname = jsonData.U;
		this.user.displayName = jsonData.U;
		Global.MainView.updateName();
		Global.ProfileView.updateName();
		this.onShowWarningDialog(
			this.getTextConfig('change_name_success') + " " + jsonData.U,
			DIALOG_TYPE.ONE_BTN, this.getTextConfig('ok'),
			() => {
				this.onReconnect();
			}
		);
	},
	userRegister(jsonData) {
		if (jsonData.hasOwnProperty("data")) {
			this.onShowConfirmDialog(jsonData.data);
			Global.ProfileView.updateChip();
			require('SMLSocketIO').getInstance().emitUpdateInfo();
		}
		if (jsonData.status === true) {
			cc.sys.localStorage.setItem("isReg", 'false');

			cc.sys.localStorage.setItem("USER_PLAYNOW", this.userNameRegTempl);
			cc.sys.localStorage.setItem("PASS_PLAYNOW", this.passRegTemple);
			this.user.uname = this.userNameRegTempl;
			this.user_pass = this.passRegTemple;
			this.user_name = this.userNameRegTempl;

			this.onShowWarningDialog(
				this.getTextConfig('change_name_success'),
				DIALOG_TYPE.ONE_BTN, this.getTextConfig('ok'),
				() => {
					this.onReconnect();
				}
			);
		} else
			this.onShowConfirmDialog(jsonData.msg);
	},
	userHasNewMailAdmin() {
		require('NetworkManager').getInstance().getMail(12);
		let isInGame = false;
		if (require("GameManager").getInstance().gameView != null) isInGame = true;
		let typeBTN = isInGame ? DIALOG_TYPE.ONE_BTN : DIALOG_TYPE.TWO_BTN;
		let textShow = this.getTextConfig("has_mail_show_gold");
		if (isInGame) {
			textShow = textShow.split(",")[0];
		}
		this.onShowWarningDialog(
			textShow,
			typeBTN,
			this.getTextConfig("ok"),
			() => {
				if (!isInGame)
					Global.MainView.onClickFreechip();
			},
			this.getTextConfig("label_cancel")
		);
	},
	handleJackPot(jsonData) {
		if (this.gameView.node != null) {
			if (this.curGameId === GAME_ID.BINH)
				this.gameView.setJackPot(jsonData.G);
		}
	},
	handleJackPotWin(jsonData) {
		let jackpot = jsonData.G;
		let name = jsonData.N;
		let jpwin = jsonData.M;

		if (this.gameView != null && this.gameView.node != null) {
			if (this.curGameId === GAME_ID.BINH) {
				this.gameView.setJackPot(jackpot);
				this.gameView.showJackpotWin(name, jpwin);
			}
		}
	},
	handleUpdateJackPot(jsonData) {
		// if (jsonData.gameId === GAME_ID.BINH)
		//   this.curJackPotBinh = jsonData.M;
		// if (jsonData.gameId === GAME_ID.SLOT_20_LINE_JP)
		//   this.curJackPotSlot = jsonData.M;
		// if (this.gameView) {
		//   if (this.curGameId === GAME_ID.BINH) {
		//     this.gameView.setJackPot(jsonData.M);
		//   }
		//   if (this.curGameId === GAME_ID.SLOT_20_LINE_JP && this.gameView != null)
		//     this.gameView.handleJackpot(jsonData.M);
		// }
		// Global.MainView.onUpdateJackPot(jsonData.gameId);
		if (jsonData.M == null) this.curJackPotBinh = 0;
		else this.curJackPotBinh = jsonData.M;

		if (this.gameView) {
			if (this.curGameId === GAME_ID.BINH && this.gameView != null) {
				this.gameView.setJackPot(jsonData.M);
			}
		}
		Global.MainView.onUpdateJackPot(GAME_ID.BINH);
	},
	handleJackPotHis(jsonData) {
		this.list_data_jackpot_history = [];
		if (!jsonData.data) return;
		var listwin = JSON.parse(jsonData.data);
		var data = listwin.lswin;
		for (var i = 0; i < data.length; i++) {
			var item = new itemJackPotHistory();
			item.timeWin = data[i].timeWin;
			item.userName = data[i].username;
			item.reward = data[i].markWin;
			item.chipBet = data[i].markUnit;
			item.userID = data[i].userid;
			this.list_data_jackpot_history.push(item);
		}
	},
	handlePromotion(jsonData) {
		var agPro = jsonData.NO;
		var timeO = jsonData.TO;
		var type = jsonData.T;
		// gift code

		if (type == 6)
			this.promotionInfo.giftCode = agPro;

		// 0            1           2           3           4              5
		// CHIP_MONEY, CHIP_ADMIN, CHIP_UPVIP, CHIP_ONLINE, CHIP_VIDEO, CHIP_GIFTCODE
		switch (type) {
			case 0:
				this.promotionInfo.notEnoughMoney = agPro;
				break;
			case 1:
				this.promotionInfo.adminMoney = agPro;
				break;
			case 2:
				this.promotionInfo.upVip = agPro;
				break;
			case 3:
				this.promotionInfo.agOnline = agPro;
				this.promotionInfo.time = timeO;
				break;
			case 4:
				this.promotionInfo.video = agPro;
				break;
			case 5:
				this.promotionInfo.giftCode = agPro;
				break;
		}
		if (type == 3) {
			Global.MainView.setTimeGetMoney();
			Global.MainView.MoneyBonusFly(agPro);
			require('NetworkManager').getInstance().sendPromotionInfo();
			if (GameManager.getInstance().user.nmAg > 0 || Global.FreeChipView.countMailAg > 0)
				Global.MainView.lbFreeChip.node.color = new cc.Color(255, 255, 0);
			else
				Global.MainView.lbFreeChip.node.color = new cc.Color(255, 255, 255);
		}
		else {
			Global.MainView.updateChipAndSafe();
			require('NetworkManager').getInstance().sendPromotionInfo();
		}
		if (Global.FreeChipView.node.getParent() !== null)
			Global.FreeChipView.loadFreeChip();

		require('SMLSocketIO').getInstance().emitUpdateInfo();
	},
	userNapTienSuccess(jsonData) {
		if (jsonData != null) {
			this.onShowConfirmDialog(jsonData.msg);
		}
		// require('NetworkManager').getInstance().sendUAG();
		// require('SMLSocketIO').getInstance().emitUpdateInfo();
	}
});
module.exports = GameManager;
