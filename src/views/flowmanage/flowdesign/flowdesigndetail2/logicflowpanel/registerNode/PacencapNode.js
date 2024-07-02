import IconNode from './IconNode'

import pacparseicon from '/@/assets/svgicon/pacparse.svg';
// 左上角ICON为消息的节点
class PacencapNode extends IconNode.view {
  getImageHref () {
    return pacparseicon;
  }
}
class PacencapNodeModel extends IconNode.model{
    initNodeData(data) {
    super.initNodeData(data);
    this.text.value = "封装/应用头添加"; // 不允许文本被拖动
    this.properties={

        pacencapID:'',

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
  type: 'pacencap',
  view: PacencapNode,
  model: PacencapNodeModel
}