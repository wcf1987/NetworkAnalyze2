
import IconCircleNode from './IconCircleNode'

import firsticon from '/@/assets/svgicon/first.svg';
// 左上角ICON为消息的节点
class FirstNode extends IconCircleNode.view  {
  getImageHref () {
    return firsticon;
  }

}
class FirstNodeModel extends IconCircleNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "开始节点"; // 不允许文本被拖动
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
  type: 'first',
  view: FirstNode,
  model: FirstNodeModel
}