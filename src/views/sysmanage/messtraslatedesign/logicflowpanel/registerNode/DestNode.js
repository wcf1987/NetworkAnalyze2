
import IconCircleNode from './IconCircleNode'

import desticon from '/@/assets/svgicon/dest.svg';
// 左上角ICON为消息的节点
class DestNode extends IconCircleNode.view  {
  getImageHref () {
    return desticon;
  }

}
class DestNodeModel extends IconCircleNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "结束节点"; // 不允许文本被拖动
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
  type: 'dest',
  view: DestNode,
  model: DestNodeModel
}