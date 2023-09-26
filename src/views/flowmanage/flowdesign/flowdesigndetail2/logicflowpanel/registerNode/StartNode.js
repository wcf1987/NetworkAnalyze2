import IconNode from './IconNode'

// 左上角ICON为消息的节点
class messtraslateNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/start.svg';
  }

}


export default {
  type: 'start',
  view: messtraslateNode,
  model: IconNode.model
}