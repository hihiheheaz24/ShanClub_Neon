var handleEvent = function (data) {
  if (IS_CLOSE_SIO_OLD === 2) {
    return;
  }
  cc.NGWlog("-----> SIO data   ", data);
  //   cc.NGWlog("-----> SIO data  2  ", data.event);

  if (cc.sys.isNative) {
    data = JSON.parse(data);
  }
  //hien cmt
  let evt = data.event;
  cc.NGWlog("===============> event la ", evt);
  switch (evt) {
    case "news": {
      // cc.NGWlog("chay vao ham show banner. CO show banner ko?" + require("GameManager").getInstance().isBn);
      if (require("UIManager").instance !== null && require("GameManager").getInstance().isBn === true) { 
        require("UIManager").instance.handleBanner(data.data);
      }
      break;
    }
  }
};

var MySocketIO = cc.Class({
  statics: {
    _socketIO: null,

    startSIO() {
      if (IS_CLOSE_SIO_OLD === 2) {
        return;
      }
      // return;
      if (cc.sys.isNative) {
        window.io = SocketIO.connect;
      }

      cc.NGWlog("=======>1 startSIO:=======================");

      let url = cc.sys.localStorage.getItem('urlLogGame');
      cc.NGWlog("=======>1 startSIOurl:=======================" + url);
      //  url = 'http://192.168.1.156:3000';
      if (url == null || typeof url == 'undefined' || url == '') url = '';
      MySocketIO._socketIO = io(url, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 99999
      }, Global.CApem); //("http://35.240.158.91:3000/clientcam");//require('GameManager').getInstance().urlLogGame);
      // ('http://mycafe.co:3000', { transports: ['websocket'] });//
      // cc.NGWlog("=======> startSIO: ", MySocketIO._socketIO);

      MySocketIO._socketIO.on("connect", function () {
        if (IS_CLOSE_SIO_OLD === 2) {
          return;
        }
        cc.NGWlog("=======> MSG MysocketIO startSIO:  connected");
        require("TrackingManager").sioFireEvenConnectHandle();
        return;
      });
      MySocketIO._socketIO.on("disconnect", function () {
        cc.NGWlog("=======> MSG MysocketIO startSIO:  disconnected");
        MySocketIO._socketIO = null;
        return;
      });
      MySocketIO._socketIO.on("event", handleEvent);
    },
    stopSIO() {
      if (IS_CLOSE_SIO_OLD === 2) {
        return;
      }
      // return;
      MySocketIO._socketIO.close();
    },
    emitSIO(eventName, strData) {
      if (IS_CLOSE_SIO_OLD === 2) {
        return;
      }
      // return;
      cc.NGWlog("=======> MSG emitSIO: eventName: " + eventName + " strData: " + strData);
      if (MySocketIO._socketIO != null) {
        cc.NGWlog("gui duoc emit len roi");
        MySocketIO._socketIO.emit(eventName, strData);
      } else {
        cc.NGWlog("mat ket noi toi mysocket IO==========");
        //  MySocketIO.startSIO();
      }
    }
  }
});

module.export = MySocketIO;
