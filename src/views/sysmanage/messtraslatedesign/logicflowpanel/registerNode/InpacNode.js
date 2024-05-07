import IconNode from './IconNode'

import inpac from '/@/assets/svgicon/inpac.svg';
// 左上角ICON为消息的节点
class InpacNode extends IconNode.view {
  getImageHref () {
    return inpac;
  }
}
class InpacNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "内置封装"; // 不允许文本被拖动

  }
}

export default {
  type: 'inpac',
  view: InpacNode,
  model: InpacNodeModel
}