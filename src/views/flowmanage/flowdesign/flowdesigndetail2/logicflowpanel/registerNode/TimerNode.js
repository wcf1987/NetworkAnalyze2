import IconNode from './IconNode'

// 左上角ICON为消息的节点
class TimerNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/timer.svg';
  }
}


export default {
  type: 'timer',
  view: TimerNode,
  model: IconNode.model
}