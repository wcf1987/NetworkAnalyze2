import IconNode from './IconNode'
import messbodyencap from '/@/assets/svgicon/messbodyencap.svg';
// 左上角ICON为消息的节点
class MessbodyparseNode extends IconNode.view {
  getImageHref () {
    return messbodyencap;
  }
}
class MessbodyparseNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "消息体添加";

  }
}

export default {
  type: 'messbodyencap',
  view: MessbodyparseNode,
  model: MessbodyparseNodeModel
}