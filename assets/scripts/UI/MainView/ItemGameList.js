var countFail = 0;
cc.Class({
  extends: cc.Component,
  // name: "ItemGameList",

  properties: {
    btn_game: cc.Button,
    // ic_name: {
    //   default: null,
    //   type: cc.Sprite
    // },
    ani: sp.Skeleton,
    ic_ComingSoon: cc.Sprite,
    this_Result: 0,
    gameId: 0,
    idPrefab: null,
    gameView: null,
    bkg_JackPot: cc.Node,
    lb_JackPot: cc.Label,
    isHaveJP: false,
    isHaveUpdate: false,
    ForcedUpdate: true,
    aniUpdate: require("Loadingresource"),
    isInitAssets: true,
    manifest: null,
    isFromBanner: false,
  },
  onLoad() {
    this.curJackPotNum = 0;
    this.isFromBanner = false;
  },
  effStart(index) {
    this.node.stopAllActions();
    this.node.scale = 0;
    this.node.runAction(cc.sequence(cc.delayTime(index * 0.1), cc.scaleTo(0.2, 1).easing(cc.easeBackOut())));
  },

  setInfo: function (gameId) {
    cc.NGWlog("setinfo itemGameList");
    this.isHaveJP = false;
    this.bkg_JackPot.active = false;
    this.ic_ComingSoon.node.active = false;
    this.btn_game.interactable = true;
    this.gameId = gameId;
    if (gameId === 1010) gameId = 9008;
    // var _res_text = cc.js.formatStr("logo/text/%d_en", gameId);
    var _res_btn = cc.js.formatStr("logo/anim_iconJS/%d/skeleton", gameId);
    // require('GameManager').getInstance().loadTexture(this.ic_name, _res_text);
    //require('GameManager').getInstance().loadTexture(this.node, _res_btn);
    //if(this)
    cc.loader.loadRes(_res_btn, sp.SkeletonData, (err, skeleton) => {
      if (err) {
        this.node.destroy();
        return;
      }
      let cp = this.ani;
      cp.skeletonData = skeleton;
      cp.premultipliedAlpha = false;
      cp.animation = "animation";
      cc.NGWlog("chay dc vao setStartAnimation");
      if (gameId === GAME_ID.BINH) {
        this.isHaveJP = true;
        this.bkg_JackPot.active = true;
        this.lb_JackPot.string = require("GameManager").getInstance().formatNumber(require("GameManager").getInstance().curJackPotBinh);
      }
    });
    //   let listGameId = [GAME_ID.BAUCUA, GAME_ID.BORK, GAME_ID.SLOT100LINE, GAME_ID.SLOT_20_LINE_JP];
    // if (listGameId.includes(gameId))
    //   this.ic_name.node.position = cc.v2(0, -50);
    let listGameView = require("GameManager").getInstance().listGame;
    for (let i = 0; i < listGameView.length; i++) {
      if (this.gameId == listGameView[i]) {
        this.idPrefab = i;
        break;
      }
    }
    if (gameId === GAME_ID.SLOT_20_LINE_JP || gameId === GAME_ID.SLOT50LINE) {
      this.node.setContentSize(cc.size(247, 248));
    }


    this.listGame_Loc = [GAME_ID.BLACKJACK, GAME_ID.BACCARAT, GAME_ID.ROULETTE]
    if (cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS) {
      //   this.getVerCheck = this.versionCompareHandle(require("GameManager").getInstance().versionGame, "1.02");
      if (!this.listGame_Loc.includes(gameId) /*&& this.getVerCheck > 0*/) {
        let isHaveUd = cc.sys.localStorage.getItem("updateResource" + this.gameId);
        cc.NGWlog("isHaveUpdate RESOURCE la:" + isHaveUd + "GameID=" + this.gameId);
        if (isHaveUd != null && typeof isHaveUd != "undefined") {

          if (isHaveUd == true) {
            //  this.HaveUpdate();
          } else {
            this.ForcedUpdate = false;
            console.log("Chay vao set ForcedUpdate1: " + this.gameId);
          }

        } else {
          cc.NGWlog(" ko co nhung gia tri la " + isHaveUd);
          this.ForcedUpdate = true;
          //  this.HaveUpdate();
        }
      } else {
        this.ForcedUpdate = false
        console.log("Chay vao set ForcedUpdate2: " + this.gameId);
      }
    } else {
      this.ForcedUpdate = false;
    }
    
  },
  effRunNumber(timeShow, label, curNum, endNum, numPerSec) {
    let delta = numPerSec / 20;
    if (delta < 0) delta = 1;
    let acPlus = cc.callFunc(() => {
      curNum += delta;
      if (curNum >= endNum) {
        curNum = endNum;
        this.curJackPotNum = endNum;
      }
      label.string = require("GameManager").getInstance().formatNumber(Math.round(curNum));
    });
    let acCheck = cc.callFunc(() => {
      if (this.curJackPotNum >= endNum) {
        curNum = endNum;
        this.node.stopAllActions();
      }
    });
    this.bkg_JackPot.stopAllActions();
    this.bkg_JackPot.runAction(cc.repeat(cc.sequence(acPlus, cc.delayTime(0.05), acCheck), timeShow * 20));
  },
  updateJackPot() {
    let jackPotEndNum = 0;
    switch (this.gameId) {
      case GAME_ID.BINH:
        jackPotEndNum = require("GameManager").getInstance().curJackPotBinh;
        break;
    }
    let delta = jackPotEndNum - this.curJackPotNum;
    this.numPerSec = delta / 5;
    this.effRunNumber(5, this.lb_JackPot, this.curJackPotNum, jackPotEndNum, this.numPerSec);
  },
  setJackPot() {
    if (this.curJackPotNum === 0) {
      let jackPotEndNum = 0;
      switch (this.gameId) {
        case GAME_ID.BINH:
          jackPotEndNum = require("GameManager").getInstance().curJackPotBinh;
          break;
      }
      this.lb_JackPot.string = require("GameManager").getInstance().formatNumber(jackPotEndNum);
      this.curJackPotNum = jackPotEndNum;
    }
    else {
      if (this.isHaveJP)
        this.updateJackPot();
    }
  },
  onClickChooseGame(isFromBanner = false) {
    cc.NGWlog("gia tri isLcickla== " + this.isFromBanner);
    if (!Global.MainView._isClickGame) return;
    this.isFromBanner = isFromBanner;

    // require('SMLSocketIO').getInstance().emitSIOCCC(cc.js.formatStr("ClickSelectGame_%s", require('GameManager').getInstance().getCurrentSceneName()));
    if (this.isInitAssets && cc.sys.isNative && !this.listGame_Loc.includes(this.gameId) && cc.sys.os != cc.sys.OS_WINDOWS) {
      cc.NGWlog("init assets============")
      this.initAsset();
      this.getManifest();
      this.isInitAssets = false;
    }

     this.ForcedUpdate = false; //hien cmt;
    if (!this.ForcedUpdate) {
      cc.NGWlog('------------ onClickChooseGame');
      if (require("GameManager").getInstance().user.ag <= 0) {
        Global.LobbyView.showPopupWhenLostChip(false, true);
        return;
      }
      Global.MainView._isClickGame = false;
      require('GameManager').getInstance().curGameId = parseInt(this.gameId);
      // require('NetworkManager').getInstance().sendSelectGame(this.gameId);
      if (require('GameManager').getInstance().user.lastGameID !== 0) // sv trả về # 0 khi đang trong bàn chơi, tránh case nó spam game # khi vừa vào bàn
      {
        cc.NGWlog("SelectG2 with gameid from sv %d lastGameID la: " + require('GameManager').getInstance().user.lastGameID);
        require('NetworkManager').getInstance().sendSelectGame(require('GameManager').getInstance().user.lastGameID);
        //require('NetworkManager').getInstance().getChatGame(require('GameManager').getInstance().user.lastGameID);
      }
      else {
        cc.NGWlog("SelectG2 with gameid from sv %d gameId la: " + this.gameId);
        require('NetworkManager').getInstance().sendSelectGame(this.gameId);
        //require('NetworkManager').getInstance().getChatGame(this.gameId);
      }
      require('UIManager').instance.onShowLobbyView();
      require('UIManager').instance.onShowLoad();
      require('TrackingManager').SendTracking(TRACKING_TYPE.ClickPlayGame_);
      setTimeout(() => {
        Global.MainView._isClickGame = true;
      }, 2000);
    } else {
      cc.log("Updating game sub");
      this.btn_game.interactable = false;
      this.aniUpdate.node.active = true;
      this.aniUpdate.updateAni();
    }
  },
  versionCompareHandle(versionA, versionB) {
    cc.NGWlog(
      "JS Custom Version Compare: version A is " +
      versionA +
      ", version B is " +
      versionB
    );
    var vA = versionA.split(".");
    var vB = versionB.split(".");

    for (var i = 0; i < vA.length; ++i) {
      var a = parseInt(vA[i]);
      var b = parseInt(vB[i] || 0);
      if (a === b) {
        continue;
      } else {
        return a - b;
      }
    }
    if (vB.length > vA.length) {
      return -1;
    } else {
      return 0;
    }
  },
  initAsset() {
    if (!cc.sys.isNative) {
      return;
    }
    this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "AllGame/" + this.gameId;
    cc.NGWlog('thu muc luu la===' + this._storagePath);
    this._am = new jsb.AssetsManager(
      "",
      this._storagePath,
      this.versionCompareHandle
    );
    this._am.setVerifyCallback(function (path, asset) {

      var compressed = asset.compressed;

      var expectedMD5 = asset.md5;

      var relativePath = asset.path;

      var size = asset.size;
      if (compressed) {
        cc.NGWlog("Verification passed : " + relativePath);
        return true;
      } else {
        cc.NGWlog(
          "Verification passed : " + relativePath + " (" + expectedMD5 + ")"
        );
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

    if (
      !this._am.getLocalManifest() ||
      !this._am.getLocalManifest().isLoaded()
    ) {
      cc.NGWlog("Failed to load local manifest ...");
      return;
    }
    this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
    cc.eventManager.addListener(this._checkListener, 1);
    this._am.checkUpdate();
    this._updating = true;
  },
  getManifest() {
    cc.loader.loadRes("resourceManifest/" + this.gameId, cc.Asset, (err, manifest) => {
      if (err) console.log("Error manifest" + err);
      this.manifest = manifest;
      this.checkUpdate();
    })
  },
  updateCb: function (event) {
    var needRestart = false;
    var failed = false;
    cc.NGWlog("Code: " + event.getEventCode());
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

        // countFail++;
        // if (countFail < 5) {
        //   this._am.downloadFailedAssets();
        //   this._updating = false;
        //   this._canRetry = true;
        // } else {
          jsb.fileUtils.removeDirectory(this._storagePath);
          this.isInitAssets = true;
          failed = true;
        //  countFail = 0;
        // }

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
      console.log("=> Hotupdate: Vao day la failed");
      if (this._updateListener) {
        cc.eventManager.removeListener(this._updateListener);
        this._updateListener = null;
      }
      // this._am.setEventCallback(null);
      this._updateListener = null;
      this._updating = false;
      this.aniUpdate.node.active = false;
      this.btn_game.interactable = true;
      if (this.isFromBanner == true) require("UIManager").instance.loadingBar.node.active = false;
    }
    if (needRestart) {
      console.log("=> Hotupdate: Vao day la needRestart");
      var searchPaths = jsb.fileUtils.getSearchPaths();
      var newPaths = this._am.getLocalManifest().getSearchPaths();
      Array.prototype.unshift.apply(searchPaths, newPaths);
      cc.sys.localStorage.setItem(
        "HotUpdateSearchPaths",
        JSON.stringify(searchPaths)
      );
      this.btn_game.interactable = true;
      let str = "updateResource" + this.gameId;
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
    let str = "updateResource" + this.gameId;
    cc.NGWlog("Code: " + event.getEventCode());
    switch (event.getEventCode()) {
      case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
        cc.NGWlog("ko tim thay mainfest file");

        break;
      case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
      case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
        cc.NGWlog("loi download mainFest");
        // this.aniUpdate.HaveUpdate();
        this.btn_game.interactable = true;
        this.aniUpdate.node.active = false;
        this.isInitAssets = true;
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