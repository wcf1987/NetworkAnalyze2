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

  }
}

export default {
  type: 'timer',
  view: TimerNode,
  model: TimerNodeModel
}