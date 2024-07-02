import IconNode from './IconNode'
import messheaderparse from '/@/assets/svgicon/messheaderparse.svg';
// 左上角ICON为消息的节点
class MessheaderparseNode extends IconNode.view {
  getImageHref () {
    return messheaderparse;
  }
}
class MessheaderparseNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "消息头解析";
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
  type: 'messheaderparse',
  view: MessheaderparseNode,
  model: MessheaderparseNodeModel
}