import IconNode from './IconNode'
import messbodyparse from '/@/assets/svgicon/messbodyparse.svg';
// 左上角ICON为消息的节点
class MessbodyparseNode extends IconNode.view {
  getImageHref () {
    return messbodyparse;
  }
}
class MessbodyparseNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "消息体解析";
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
  type: 'messbodyparse',
  view: MessbodyparseNode,
  model: MessbodyparseNodeModel
}