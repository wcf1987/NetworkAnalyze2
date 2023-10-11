import IconNode from './IconNode'

import pacparseicon from '/@/assets/svgicon/pacparse.svg';
// 左上角ICON为消息的节点
class PacencapNode extends IconNode.view {
  getImageHref () {
    return pacparseicon;
  }
}
class PacencapNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "封装/应用头添加"; // 不允许文本被拖动
    this.properties={

        pacencapID:'',

    }
  }
}

export default {
  type: 'pacencap',
  view: PacencapNode,
  model: PacencapNodeModel
}