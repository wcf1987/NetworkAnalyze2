import IconNode from './IconNode'

import statisticsicon from '/@/assets/svgicon/statistics.svg';
// 左上角ICON为消息的节点
class StatisticsNode extends IconNode.view {
  getImageHref () {
    return statisticsicon;
  }
}
class StatisticsNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "数据统计"; // 不允许文本被拖动

  }
}

export default {
  type: 'statistics',
  view: StatisticsNode,
  model: StatisticsNodeModel
}