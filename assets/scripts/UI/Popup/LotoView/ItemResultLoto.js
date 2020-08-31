cc.Class({
    extends: cc.Component,

    properties: {
       lb_time : {
           default : null,
           type : cc.Label
       },
       lb_number : {
           default : null,
           type : cc.Label
       },
    },
    start () {

    },

    init(data){
        var time_ = new Date(data.CreateTime);
        let year = time_.getFullYear();
        let month =  time_.getMonth() + 1;
        let day = time_.getDate()
        var _time = year + '-' + ( month < 10 ? "0" + month : month) + '-' + ( day < 10 ? "0" + day : day);

        this.lb_time.string = _time;

        this.lb_number.string =  data.strNumber;
    },

});
