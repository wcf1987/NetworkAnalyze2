import IconNode from './IconNode'

import spemarkicon from '/@/assets/svgicon/spemark.svg';
// 左上角ICON为消息的节点
class SpemarkNode extends IconNode.view {
  getImageHref () {
    return spemarkicon;
  }
}
class SpemarkNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "临时变量"; // 不允许文本被拖动
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
  type: 'spemark',
  view: SpemarkNode,
  model: SpemarkNodeModel
}