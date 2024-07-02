import IconNode from './IconNode'

import timemarkicon from '/@/assets/svgicon/timemark.svg';
// 左上角ICON为消息的节点
class TimemarkNode extends IconNode.view {
  getImageHref () {
    return timemarkicon;
  }
}
class SpemarkNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "时间标记"; // 不允许文本被拖动
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
  type: 'timemark',
  view: TimemarkNode,
  model: SpemarkNodeModel
}