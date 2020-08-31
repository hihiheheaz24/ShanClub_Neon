

cc.Class({
    extends: cc.Component,

    properties: {
      webView:cc.WebView
    },

    start () {

    },
    onClose(){
        this.node.destroy();
    },
    setUrl(url){
        this.webView.url=url;
    }

    // update (dt) {},
});
