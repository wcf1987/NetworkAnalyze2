import IconNode from './IconNode'
import messheaderencap from '/@/assets/svgicon/messheaderencap.svg';
// 左上角ICON为消息的节点
class MessheaderencapNode extends IconNode.view {
  getImageHref () {
    return messheaderencap;
  }
}
class MessheaderencapNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "消息头添加";
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
  type: 'messheaderencap',
  view: MessheaderencapNode,
  model: MessheaderencapNodeModel
}