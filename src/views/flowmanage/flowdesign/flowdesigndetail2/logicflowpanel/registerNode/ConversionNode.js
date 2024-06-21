import IconNode from './IconNode'

import conver from '/@/assets/svgicon/conver.svg';
// 左上角ICON为消息的节点
class ConversionNode extends IconNode.view {
  getImageHref () {
    return conver;
  }
}
class ConversionNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    //this.text.value = "内置转换方式"; // 不允许文本被拖动

  }
}

export default {
  type: 'conver',
  view: ConversionNode,
  model: ConversionNodeModel
}