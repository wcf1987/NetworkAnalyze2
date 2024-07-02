import IconNode from './IconNode'

import timericon from '/@/assets/svgicon/timer.svg';
// 左上角ICON为消息的节点
class TimerNode extends IconNode.view {
  getImageHref () {
    return timericon;
  }
}
class TimerNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "定时器"; // 不允许文本被拖动
const NotSelfAsTarget = {
      message: "不允许节点连接自身",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
         // console.log(sourceNode.id);
          //              // console.log(targetNode.id);
        return sourceNode.id!= targetNode.id;
      },
    };
    this.sourceRules.push(NotSelfAsTarget);
  }
}

export default {
  type: 'timer',
  view: TimerNode,
  model: TimerNodeModel
}