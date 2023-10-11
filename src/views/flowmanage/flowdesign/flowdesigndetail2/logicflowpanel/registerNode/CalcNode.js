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

  }
}

export default {
  type: 'calc',
  view: CalcNode,
  model: CalcNodeModel
}