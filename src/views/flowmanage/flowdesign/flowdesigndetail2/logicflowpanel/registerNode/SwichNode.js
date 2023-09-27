import IconNode from './IconNode'

import swichicon from '/@/assets/svgicon/swich.svg';
// 左上角ICON为消息的节点
class SwichNode extends IconNode.view {
  getImageHref () {
    return swichicon;
  }
}


export default {
  type: 'swich',
  view: SwichNode,
  model: IconNode.model
}