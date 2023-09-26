import IconNode from './IconNode'

// 左上角ICON为消息的节点
class SwichNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/swich.svg';
  }
}


export default {
  type: 'swich',
  view: SwichNode,
  model: IconNode.model
}