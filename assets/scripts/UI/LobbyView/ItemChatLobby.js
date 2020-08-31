cc.Class({
    extends: cc.Component,

    properties: {
        lb_name :{
            default : null,
            type : cc.Label
        },
        lb_content :{
            default : null,
            type : cc.Label
        },
        lb_lv :{
            default : null,
            type : cc.Label
        },
        ic_end : {
            default : null,
            type : cc.Node
        },
        
    },


    start () {

    },
    init(data){
        //this.lb_lv.string = "Lv."+ data.level;
        let name = data.name_player;
        if (name.length > 12) {
            name = name.substring(0, 10) + "...";
        }
        this.lb_name.string = name;
        if (this.lb_name.string.length > 15)
            this.lb_name.string = this.lb_name.string.substring(0, 12) + '...';
        this.lb_content.string = data.content;
        if (this.lb_content.node.getContentSize().width > 330) {
            this.lb_content.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            this.lb_content.node.setContentSize(cc.size(330, 25));

        }
        this.node.setContentSize(cc.size(this.lb_content.node.getContentSize().width, this.lb_content.node.getContentSize().height + 80));

        this.ic_end.position.y = this.node.getContentSize().height / 2 * (-1);
    },
});
