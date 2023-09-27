import IconNode from './IconNode'

import calcicon from '/@/assets/svgicon/calc.svg';
// 左上角ICON为消息的节点
class CalcNode extends IconNode.view {
  getImageHref () {
    return calcicon;
  }
}


export default {
  type: 'calc',
  view: CalcNode,
  model: IconNode.model
}