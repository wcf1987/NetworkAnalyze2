import IconNode from './IconNode'

// 左上角ICON为消息的节点
class PacencapNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/pacencap.svg';
  }
}


export default {
  type: 'pacencap',
  view: PacencapNode,
  model: IconNode.model
}