

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
const NotSelfAsTarget = {
      message: "不允许节点连接自身",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
         // console.log(sourceNode.id);
                        // console.log(targetNode.id);
        return sourceNode.id!= targetNode.id;
      },
    };
    this.sourceRules.push(NotSelfAsTarget);
    }
}

export default {
    type: 'swich',
    view: SwichNode,
    model: SwichNodeModel
}