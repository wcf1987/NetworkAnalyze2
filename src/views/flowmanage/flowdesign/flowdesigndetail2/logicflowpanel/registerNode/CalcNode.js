import IconNode from './IconNode'

// 左上角ICON为消息的节点
class CalcNode extends IconNode.view {
  getImageHref () {
    return '/src/assets/svgicon/calc.svg';
  }
}


export default {
  type: 'calc',
  view: CalcNode,
  model: IconNode.model
}