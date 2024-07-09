import IconNode from './IconNode'

import MessQueicon from '/@/assets/svgicon/messque.svg';
// 左上角ICON为消息的节点
class MessQueNode extends IconNode.view {
  getImageHref () {
    return MessQueicon;
  }
}
class MessQueNodeModel extends IconNode.model{
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
  type: 'messque',
  view: MessQueNode,
  model: MessQueNodeModel
}