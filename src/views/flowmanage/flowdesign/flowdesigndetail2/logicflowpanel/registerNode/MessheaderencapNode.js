import IconNode from './IconNode'
import messheaderencap from '/@/assets/svgicon/messheaderencap.svg';
// 左上角ICON为消息的节点
class MessheaderencapNode extends IconNode.view {
  getImageHref () {
    return messheaderencap;
  }
}
class MessheaderencapNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "消息头添加";

  }
}

export default {
  type: 'messheaderencap',
  view: MessheaderencapNode,
  model: MessheaderencapNodeModel
}