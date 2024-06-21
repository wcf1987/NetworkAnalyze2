import IconNode from './IconNode'

import targeticon from '/@/assets/svgicon/target.svg';

// 左上角ICON为消息的节点
class EndNode extends IconNode.view {
  getImageHref () {
    return targeticon;
  }
}
class EndNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "目的消息节点"; // 不允许文本被拖动
    this.properties={
        interfacetype:'无',
        serialID:'',
        sourecenetworkID:'',
        localnetworkID:'',
        ip:'',
        port:'',
    }
  }
}

export default {
  type: 'end',
  view: EndNode,
  model: EndNodeModel
}