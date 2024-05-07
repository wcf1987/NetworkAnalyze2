

import swichicon from '/@/assets/svgicon/swich.svg';
import IconDiamondNode
    from "/@/views/flowmanage/flowdesign/flowdesigndetail2/logicflowpanel/registerNode/IconDiamondNode";
// 左上角ICON为消息的节点
class SwichNode extends IconDiamondNode.view {
    getImageHref () {
        return swichicon;
    }
}
class SwichNodeModel extends IconDiamondNode.model{
    initNodeData(data) {
        super.initNodeData(data);
        this.text.value = "分支选择"; // 不允许文本被拖动

    }
}

export default {
    type: 'swich',
    view: SwichNode,
    model: SwichNodeModel
}