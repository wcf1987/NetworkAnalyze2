import IconNode from './IconNode'

import swichicon from '/@/assets/svgicon/swich.svg';
// 左上角ICON为消息的节点
class SwichNode extends IconNode.view {
  getImageHref () {
    return swichicon;
  }
}
class SwichNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "分支选择"; // 不允许文本被拖动

  }
}

export default {
  type: 'swich',
  view: SwichNode,
  model: SwichNodeModel
}