import IconNode from './IconNode'

// 左上角ICON为消息的节点
class PacparseNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/pacparse.svg';
  }
}


export default {
  type: 'pacparse',
  view: PacparseNode,
  model: IconNode.model
}