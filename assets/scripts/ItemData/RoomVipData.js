
var RoomVipData = cc.Class({
    name: 'RoomVipData',

    ctor: function () {
    },
    properties: ({
        mark: 0,
        player: 0,
        chip_require: 0,
        table_id: 0,
        isPrivate: false,
        maxAgCon : 0,
        cur_user : 0,
        ag : 0,
        room : 0
    }),
});
module.exports = RoomVipData;