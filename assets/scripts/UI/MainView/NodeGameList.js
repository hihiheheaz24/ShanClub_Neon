const GameManager = require('GameManager')
var countFail = 0;
var NodeGameList = cc.Class({
  extends: cc.Component,
  // name: "NodeGameList",
  properties: {
    btn_big_game: {
      default: null,
      type: cc.Button
    },

    // btn_small_game: {
    //     default: null,
    //     type: cc.Button
    // },

    listView: {
      default: null,
      type: cc.ScrollView
    },

    item_game: {
      default: null,
      type: cc.Prefab
    },
    isChoosingGame: false,
    // viewContent: cc.Node


    isHaveUpdate: false,
    ForcedUpdate: true,
    aniUpdate: require("Loadingresource"),
    isInitAssets: true,
    manifest: null,
    isFromBanner: false,


  },
  onLoad() {
    Global.NodeGameListView = this;
    // this.node.setContentSize(cc.size(cc.winSize.width, cc.winSize.height / 1.5));
    // this.node.position = cc.v2(-cc.winSize.width / 2, 0);
  },
  init: function () {
    let ListGame = [...GameManager.getInstance().listGame];      //.slice();
    // che do test------------------------------------------------
    //    ListGame.push(GAME_ID.BACCARAT); //Baccarat:Hien Test;

    //    ListGame.push(GAME_ID.SESKU);
    //   ListGame.push(GAME_ID.SLOT_20_LINE_JP);// hien cmt
    //let listGame_Loc = [GAME_ID.BLACKJACK, GAME_ID.BACCARAT, GAME_ID.ROULETTE];
    let listGame_Loc = [];

    let listTemp = [];
    let length2 = ListGame.length
    cc.NGWlog("dung vao con BlackJack" + JSON.stringify(ListGame));
    for (let i = 0; i < length2; i++) {
      //if (ListGame[i] === GAME_ID.BLACKJACK) cc.NGWlog("dung vao con BlackJack");
      if (listGame_Loc.includes(ListGame[i])) {
        listTemp.push(ListGame[i]);
        ListGame.splice(i, 1);
        i--;
      }
    }
    ListGame = listTemp.concat(ListGame);


    let length = ListGame.length;
    let listGameId = ListGame;
    let scrViewct = this.listView.content;
    let count = 0;

    for (let i = 0; i < length; i++) {
      if (listGameId[i] !== GAME_ID.SHANKOEMEE) {
        let btn_game = scrViewct.children[count];
        if (btn_game == null || typeof btn_game == 'undefined') {
          btn_game = cc.instantiate(this.item_game);
          scrViewct.addChild(btn_game);
        }
        btn_game.active = true;
        let btn_gameComponent = btn_game.getComponent('ItemGameList');
        if (btn_gameComponent.gameId != listGameId[i]) {
          btn_gameComponent.setInfo(listGameId[i]);
        }
        // btn_gameComponent.effStart(i);

        count++;
      }
    }
    // Global.MainView.sendUpdateJackPot();
    let lengtScrView = scrViewct.children.length;
    for (let i = count; i < lengtScrView; i++) {
      scrViewct.children[i].active = false;
    }

    if (cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
      let isHaveUd = cc.sys.localStorage.getItem("updateResource" + GAME_ID.SHANKOEMEE);
      if (isHaveUd != null && typeof isHaveUd != "undefined") {

        if (isHaveUd == true) {
          //  this.HaveUpdate();
        } else {
          this.ForcedUpdate = false;
        }
      } else {
        cc.NGWlog(" ko co nhung gia tri la " + isHaveUd);
        //  this.HaveUpdate();
      }
    } else {
      this.ForcedUpdate = false
    }

    setTimeout(() => {
      require('UIManager').instance.onHideLoad();
    }, 700);
  },
  onClickChooseGame(isFromBanner = false) {
    cc.NGWlog("gia tri isLcickla== " + this.isFromBanner);
    if (!Global.MainView._isClickGame) return;
    this.isFromBanner = isFromBanner;
    // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSelectGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
    if (this.isInitAssets && cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
      cc.NGWlog("init assets============")
      this.initAsset();
      this.getManifest();
      this.isInitAssets = false;
    }
    //  this.ForcedUpdate=false; //hien cmt;
    if (!this.ForcedUpdate) {
      cc.NGWlog('------------ onClickChooseGame');
      if (require("GameManager").getInstance().user.ag <= 0) {
        Global.LobbyView.showPopupWhenLostChip(false, true);
        return;
      }
      // require('GameManager').getInstance().curGameId = parseInt(GAME_ID.SLOT50LINE);
      // require('NetworkManager').getInstance().sendSelectGame(GAME_ID.SLOT50LINE);
      // require('UIManager').instance.onShowLobbyView();
      // require('UIManager').instance.onShowLoad();
      require('TrackingManager').SendTracking(TRACKING_TYPE.ClickPlayGame_);

      require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSelectGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
      require('UIManager').instance.onShowLoad();
      if (require('GameManager').getInstance().user.lastGameID !== 0) // sv trả về # 0 khi đang trong bàn chơi, tránh case nó spam game # khi vừa vào bàn
      {
        cc.NGWlog("SelectG2 with gameid from sv %d" + require('GameManager').getInstance().user.lastGameID);
        require('NetworkManager').getInstance().sendSelectGame(require('GameManager').getInstance().user.lastGameID);
        //require('NetworkManager').getInstance().getChatGame(require('GameManager').getInstance().user.lastGameID);
      }
      else {
        require('NetworkManager').getInstance().sendSelectGame(GAME_ID.SHANKOEMEE);
        // require('NetworkManager').getInstance().getChatGame(GAME_ID.SHANKOEMEE)
      }

      require('UIManager').instance.onShowLobbyView();
      // Global.MainView._isClickGame = false;
      // setTimeout(() => {
      //   Global.MainView._isClickGame = true;
      // }, 2000);
    } else {
      this.btn_big_game.interactable = false;
      this.aniUpdate.node.active = true;
      this.aniUpdate.updateAni();
    }
  },
  setJackPot(gameId, isRun) {
    for (let i = 0; i < this.listView.content.children.length; i++) {
      let item = this.listView.content.children[i].getComponent("ItemGameList");
      if (item.gameId == gameId) {
        item.setJackPot(isRun);
        break;
      }

    }
  },

  onClickGameFromBanner(gameId) {

    if (gameId == GAME_ID.SHANKOEMEE) {
      this.onClickChooseGame(true);
      return;
    }

    let i = 0;
    let size = this.listView.content.children.length;
    for (i; i < size; i++) {
      let item = this.listView.content.children[i].getComponent("ItemGameList");
      if (item.gameId === gameId) {
        item.onClickChooseGame(true);
      }
    }
  },


  initAsset() {
    if (!cc.sys.isNative) {
      return;
    }
    this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "AllGame/" + GAME_ID.SHANKOEMEE;
    cc.NGWlog('thu muc luu la===' + this._storagePath);
    this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
    this._am.setVerifyCallback(function (path, asset) {

      var compressed = asset.compressed;

      var expectedMD5 = asset.md5;

      var relativePath = asset.path;

      var size = asset.size;
      if (compressed) {
        cc.NGWlog("Verification passed : " + relativePath);
        return true;
      } else {
        cc.NGWlog("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
        return true;
      }
    });
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      this._am.setMaxConcurrentTask(2);
    }

  },

  onDestroy() {
    if (this._checkListener) {
      cc.eventManager.removeListener(this._checkListener);
      this._checkListener = null;
    }

    if (this._updateListener) {
      cc.eventManager.removeListener(this._updateListener);
      this._updateListener = null;
    }

    if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
      this._am.release();
    }
  },
  hotUpdate() {
    if (this._am && !this._updating) {
      if (this.isFromBanner == true) {
        require("UIManager").instance.loadingBar.node.active = true;
        require("UIManager").instance.loadingBar.is_load_update = false;
        require("UIManager").instance.loadingBar.setProgress(0);
      }

      this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
      cc.eventManager.addListener(this._updateListener, 1);

      if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
        var url = this.manifest.nativeUrl;
        if (cc.loader.md5Pipe) {
          url = cc.loader.md5Pipe.transformURL(url);
        }
        this._am.loadLocalManifest(url);
      }

      this._failCount = 0;
      this._am.update();

      this._updating = true;
    } else {
      let _this = this;
      this.scheduleOnce(function () {
        _this.hotUpdate();
      }, 0.5)
    }
  },
  checkUpdate() {
    cc.NGWlog("Check Update");
    if (this._updating) {
      cc.NGWlog("Checking or updating ...");
      return;
    }
    if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
      // Resolve md5 url
      var url = this.manifest.nativeUrl;
      if (cc.loader.md5Pipe) {
        url = cc.loader.md5Pipe.transformURL(url);
      }
      this._am.loadLocalManifest(url);
    }

    if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
      cc.NGWlog("Failed to load local manifest ...");
      return;
    }
    this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
    cc.eventManager.addListener(this._checkListener, 1);
    this._am.checkUpdate();
    this._updating = true;
  },
  getManifest() {
    cc.loader.loadRes("resourceManifest/" + GAME_ID.SHANKOEMEE, cc.Asset, (err, manifest) => {
      this.manifest = manifest;
      this.checkUpdate();
    })
  },
  updateCb: function (event) {
    var needRestart = false;
    var failed = false;
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_PROGRESSION:
        if (this.isFromBanner == true) require("UIManager").instance.loadingBar.setProgress(event.getPercent());
        this.aniUpdate.setPercent(event.getPercent());
        var msg = event.getMessage();
        if (msg) {
          cc.NGWlog("Updated file: " + msg);
        }
        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.NGWlog("lo down load == bo qua");

        this.isInitAssets = true;
        failed = true;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        cc.NGWlog("phien ban moi nhat");
        failed = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FINISHED:
        cc.NGWlog("Update finished. " + event.getMessage());
        needRestart = true;
        break;
      case jsb.EventAssetsManager.UPDATE_FAILED:
        cc.NGWlog("Update failed. " + event.getMessage());

        countFail++;
        if (countFail < 5) {
          this._am.downloadFailedAssets();
          this._updating = false;
          this._canRetry = true;
        } else {
          jsb.fileUtils.removeDirectory(this._storagePath);
          this.isInitAssets = true;
          failed = true;
          countFail = 0;
        }

        break;
      case jsb.EventAssetsManager.ERROR_UPDATING:
        cc.NGWlog(
          "Asset update error: " +
          event.getAssetId() +
          ", " +
          event.getMessage()
        );
        break;
      case jsb.EventAssetsManager.ERROR_DECOMPRESS:
        cc.NGWlog("loi la==>" + event.getMessage());
        this.isInitAssets = true;
        failed = true;
        break;
      default:
        break;
    }

    if (failed) {
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }
      // this._am.setEventCallback(null);
      this._updateListener = null;
      this._updating = false;
      this.aniUpdate.node.active = false;
      this.btn_big_game.interactable = true;
      if (this.isFromBanner == true) require("UIManager").instance.loadingBar.node.active = false;
    }
    if (needRestart) {
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this._am.getLocalManifest().getSearchPaths();
      Array.prototype.unshift.apply(searchPaths, newPaths);
      cc.sys.localStorage.setItem(
        "HotUpdateSearchPaths",
        JSON.stringify(searchPaths)
      );
      this.btn_big_game.interactable = true;
      let str = "updateResource" + GAME_ID.SHANKOEMEE;
      this.ForcedUpdate = false;
      cc.sys.localStorage.setItem(str, false);
      this.isHaveUpdate = false;
      this.aniUpdate.node.active = false;
      jsb.fileUtils.setSearchPaths(searchPaths);
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }

      if (this.isFromBanner == true) {
        require("UIManager").instance.loadingBar.node.active = false;
        this.onClickChooseGame();
        this.isFromBanner = false;
      }
    }
  },
  checkCb: function (event) {
    let str = "updateResource" + GAME_ID.SHANKOEMEE;
    cc.NGWlog("Code: " + event.getEventCode());
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        cc.NGWlog("ko tim thay mainfest file");

        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.NGWlog("loi download mainFest");
        // this.aniUpdate.HaveUpdate();
        this.btn_big_game.interactable = true;
        this.isInitAssets = true;
        this.aniUpdate.node.active = false;
        break;
      case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
        cc.NGWlog("Check CB:Phien ban moi nhat");
        this.btn_game.interactable = true;
        cc.sys.localStorage.setItem(str, false);
        this.aniUpdate.node.active = false;
        this.ForcedUpdate = false;
        break;
      case jsb.EventAssetsManager.NEW_VERSION_FOUND:
        cc.NGWlog("bat dau hotupdate");
        if (this.ForcedUpdate) {
          this.aniUpdate.node.active = true;
          this.aniUpdate.updateAni();
          this.hotUpdate();
        }
        else {
          cc.sys.localStorage.setItem(str, true);
          this.aniUpdate.node.active = false;
        }
        break;
      default:
        return;
    }
    // this._am.setEventCallback(null);
    if (this._checkListener) {
      cc.eventManager.removeListener(this._checkListener);
      this._checkListener = null;
    }

    this._checkListener = null;
    this._updating = false;
  },


});
module.exports = NodeGameList;
