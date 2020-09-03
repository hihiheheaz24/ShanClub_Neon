
cc.Class({
    extends: cc.Component,

    properties: {
        upperNode: [cc.Sprite],
        lowerNode: [cc.Sprite],
        itemSuit: cc.Node,
        bigSuit: cc.Sprite,
        suiteParent: cc.Node,
        frameSheet: cc.SpriteAtlas,

    },

    setInfo(suit, value, suitName, frameSuit, frameValue) {
        if (value > 13) value -= 13
        const objNode = this.setElementPos(value);
        this.itemSuit.getComponent(cc.Sprite).spriteFrame = frameSuit;
        this.upperNode[0].spriteFrame = frameValue;
        this.upperNode[1].spriteFrame = frameSuit;
        this.lowerNode[0].spriteFrame = frameValue;
        this.lowerNode[1].spriteFrame = frameSuit;
        if (suit == 2 || suit == 3) {
            this.upperNode[0].node.color = cc.Color.RED;
            this.lowerNode[0].node.color = cc.Color.RED;
        } else {
            this.upperNode[0].node.color = cc.Color.BLACK;
            this.lowerNode[0].node.color = cc.Color.BLACK;
        }
        this.suiteParent.destroyAllChildren();
        if (value <= 10) {
            this.bigSuit.node.active = false;
            this.suiteParent.active = true;
            for (let i = 0; i < value; i++) {
                let tiny = cc.instantiate(this.itemSuit);
                tiny.active = true;
                this.suiteParent.addChild(tiny);
                tiny.position = objNode.pos[i];
                tiny.rotation = objNode.rotate[i];
            }
        } else {
            this.bigSuit.node.active = true;
            this.bigSuit.spriteFrame = this.frameSheet.getSpriteFrame(value + suitName);
            this.suiteParent.active = false;
        }
    },

    showCorner(isShow = false) {
        cc.log('!>>>>>', isShow)
        this.lowerNode[0].node.parent.active = isShow;
    },

    setElementPos(value) {
        let result = {
            pos: [],
            rotate: [],
        };
        switch (value) {
            case 1:
                result.pos = [cc.v2(0, 0)];
                result.rotate = [0];
                break;
            case 2:
                result.pos = [cc.v2(0, 70), cc.v2(0, -70)];
                result.rotate = [0, 180];
                break;
            case 3:
                result.pos = [cc.v2(0, 70), cc.v2(0, 0), cc.v2(0, -70)];
                result.rotate = [0, 180, 180];
                break;
            case 4:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 180, 180];
                break;
            case 5:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(0, 0), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 0, 180, 180];
                break;
            case 6:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(-30, 0), cc.v2(30, 0), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 0, 0, 180, 180];
                break;
            case 7:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(0, 35), cc.v2(-30, 0), cc.v2(30, 0), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 0, 0, 0, 180, 180];
                break;
            case 8:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(0, 35), cc.v2(-30, 0), cc.v2(30, 0), cc.v2(0, -35), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 0, 0, 0, 180, 180, 180];
                break;
            case 9:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(-30, 35), cc.v2(30, 35), cc.v2(0, 0), cc.v2(-30, -35), cc.v2(30, -35), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 0, 0, 0, 180, 180, 180, 180];
                break;
            case 10:
                result.pos = [cc.v2(-30, 70), cc.v2(30, 70), cc.v2(0, 45), cc.v2(-30, 20), cc.v2(30, 20), cc.v2(-30, -20), cc.v2(30, -20), cc.v2(0, -45), cc.v2(-30, - 70), cc.v2(30, - 70)];
                result.rotate = [0, 0, 0, 0, 0, 180, 180, 180, 180, 180];
                break;
        }
        return result;
    }

    // update (dt) {},
});
