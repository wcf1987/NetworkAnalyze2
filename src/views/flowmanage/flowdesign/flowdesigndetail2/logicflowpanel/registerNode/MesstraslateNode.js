import IconNode from './IconNode'

// 左上角ICON为消息的节点
class MesstraslateNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/messtraslate.svg';
  }
}


export default {
  type: 'messtraslate',
  view: MesstraslateNode,
  model: IconNode.model
}