import IconNode from './IconNode'

// 左上角ICON为消息的节点
class EndNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/target.svg';
  }
}


export default {
  type: 'end',
  view: EndNode,
  model: IconNode.model
}