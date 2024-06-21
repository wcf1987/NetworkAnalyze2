
import IconNode from './IconNode'

import starticon from '/@/assets/svgicon/start.svg';
// 左上角ICON为消息的节点
class StartNode extends IconNode.view  {
  getImageHref () {
    return starticon;
  }

}
class StartNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "源消息节点"; // 不允许文本被拖动
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
  type: 'start',
  view: StartNode,
  model: StartNodeModel
}