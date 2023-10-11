import IconNode from './IconNode'

import timemarkicon from '/@/assets/svgicon/timemark.svg';
// 左上角ICON为消息的节点
class TimemarkNode extends IconNode.view {
  getImageHref () {
    return timemarkicon;
  }
}
class SpemarkNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "时间标记"; // 不允许文本被拖动

  }
}

export default {
  type: 'timemark',
  view: TimemarkNode,
  model: SpemarkNodeModel
}