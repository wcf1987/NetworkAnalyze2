import IconNode from './IconNode'

// 左上角ICON为消息的节点
class TimemarkNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/timemark.svg';
  }
}


export default {
  type: 'timemark',
  view: TimemarkNode,
  model: IconNode.model
}