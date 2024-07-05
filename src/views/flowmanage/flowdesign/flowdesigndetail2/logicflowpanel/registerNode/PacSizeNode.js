import IconNode from './IconNode'

import PacSizeicon from '/@/assets/svgicon/pacsize.svg';
// 左上角ICON为消息的节点
class PacSizeNode extends IconNode.view {
  getImageHref () {
    return PacSizeicon;
  }
}
class PacSizeNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
   // this.text.value = "shuj标记"; // 不允许文本被拖动
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
  type: 'pacSize',
  view: PacSizeNode,
  model: PacSizeNodeModel
}