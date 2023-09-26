import IconNode from './IconNode'

// 左上角ICON为消息的节点
class SpemarkNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/spemark.svg';
  }
}


export default {
  type: 'spemark',
  view: SpemarkNode,
  model: IconNode.model
}