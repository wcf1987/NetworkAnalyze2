import IconNode from './IconNode'

import Filtericon from '/@/assets/svgicon/filter.svg';
// 左上角ICON为消息的节点
class FilterNode extends IconNode.view {
  getImageHref () {
    return Filtericon;
  }
}
class FilterNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    //this.text.value = "数据统计"; // 不允许文本被拖动
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
  type: 'filter',
  view: FilterNode,
  model: FilterNodeModel
}