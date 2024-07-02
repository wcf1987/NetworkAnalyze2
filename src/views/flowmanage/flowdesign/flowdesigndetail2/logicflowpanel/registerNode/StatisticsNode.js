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
  type: 'statistics',
  view: StatisticsNode,
  model: StatisticsNodeModel
}