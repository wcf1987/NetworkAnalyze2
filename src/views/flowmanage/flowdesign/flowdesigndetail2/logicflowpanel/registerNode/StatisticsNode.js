import IconNode from './IconNode'

// 左上角ICON为消息的节点
class StatisticsNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/statistics.svg';
  }
}


export default {
  type: 'statistics',
  view: StatisticsNode,
  model: IconNode.model
}