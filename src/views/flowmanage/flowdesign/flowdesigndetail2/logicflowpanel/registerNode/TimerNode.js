import IconNode from './IconNode'

import timericon from '/@/assets/svgicon/timer.svg';
// 左上角ICON为消息的节点
class TimerNode extends IconNode.view {
  getImageHref () {
    return timericon;
  }
}


export default {
  type: 'timer',
  view: TimerNode,
  model: IconNode.model
}