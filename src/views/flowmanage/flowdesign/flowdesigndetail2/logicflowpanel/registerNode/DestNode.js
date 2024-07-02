
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
    const NotSelfAsTarget = {
      message: "不允许节点连接自身",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
         // console.log(sourceNode.id);
                        // console.log(targetNode.id);
        return sourceNode.id!= targetNode.id;
      },
    };
    this.sourceRules.push(NotSelfAsTarget);
  }
}

export default {
  type: 'dest',
  view: DestNode,
  model: DestNodeModel
}