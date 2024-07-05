import IconNode from './IconNode'

import PacNumicon from '/@/assets/svgicon/pacnum.svg';
// 左上角ICON为消息的节点
class PacNumNode extends IconNode.view {
  getImageHref () {
    return PacNumicon;
  }
}
class PacNumNodeModel extends IconNode.model{
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
  type: 'pacNum',
  view: PacNumNode,
  model: PacNumNodeModel
}