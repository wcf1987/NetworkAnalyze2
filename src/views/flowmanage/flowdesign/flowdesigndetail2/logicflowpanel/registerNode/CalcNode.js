import IconNode from './IconNode'

import calcicon from '/@/assets/svgicon/calc.svg';
// 左上角ICON为消息的节点
class CalcNode extends IconNode.view {
  getImageHref () {
    return calcicon;
  }
}
class CalcNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "计算节点"; // 不允许文本被拖动
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
  type: 'calc',
  view: CalcNode,
  model: CalcNodeModel
}