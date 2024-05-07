import IconNode from './IconNode'

import pacencapicon from '/@/assets/svgicon/pacencap.svg';
// 左上角ICON为消息的节点
class PacparseNode extends IconNode.view {
  getImageHref () {
    return pacencapicon;
  }
}
class PacparseNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "封装/应用头解析"; // 不允许文本被拖动
    this.properties={

        pacparseID:'',

    }
  }
}

export default {
  type: 'pacparse',
  view: PacparseNode,
  model: PacparseNodeModel
}