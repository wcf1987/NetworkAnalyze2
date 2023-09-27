import IconNode from './IconNode'

import targeticon from '/@/assets/svgicon/target.svg';

// 左上角ICON为消息的节点
class EndNode extends IconNode.view {
  getImageHref () {
    return targeticon;
  }
}


export default {
  type: 'end',
  view: EndNode,
  model: IconNode.model
}