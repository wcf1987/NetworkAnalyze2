import IconNode from './IconNode'

// 左上角ICON为消息的节点
class MessparseNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/messparse.svg';
  }
}


export default {
  type: 'messparse',
  view: MessparseNode,
  model: IconNode.model
}