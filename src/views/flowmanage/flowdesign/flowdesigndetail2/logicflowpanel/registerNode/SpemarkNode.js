import IconNode from './IconNode'

import spemarkicon from '/@/assets/svgicon/spemark.svg';
// 左上角ICON为消息的节点
class SpemarkNode extends IconNode.view {
  getImageHref () {
    return spemarkicon;
  }
}
class SpemarkNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "特殊标记"; // 不允许文本被拖动

  }
}

export default {
  type: 'spemark',
  view: SpemarkNode,
  model: SpemarkNodeModel
}