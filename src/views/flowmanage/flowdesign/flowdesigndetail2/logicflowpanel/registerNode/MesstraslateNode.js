import IconNode from './IconNode'

import messtraslateicon from '/@/assets/svgicon/messtraslate.svg';
// 左上角ICON为消息的节点
class MesstraslateNode extends IconNode.view {
  getImageHref () {
    return messtraslateicon;
  }
}
class MesstraslateNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "消息转换"; // 不允许文本被拖动
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
  type: 'messtraslate',
  view: MesstraslateNode,
  model: MesstraslateNodeModel
}