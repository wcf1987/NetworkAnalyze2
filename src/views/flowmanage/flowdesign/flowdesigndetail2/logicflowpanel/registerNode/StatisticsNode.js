import IconNode from './IconNode'

import statisticsicon from '/@/assets/svgicon/statistics.svg';
// 左上角ICON为消息的节点
class StatisticsNode extends IconNode.view {
  getImageHref () {
    return statisticsicon;
  }
}


export default {
  type: 'statistics',
  view: StatisticsNode,
  model: IconNode.model
}