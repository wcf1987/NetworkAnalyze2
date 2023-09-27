import IconNode from './IconNode'

import spemarkicon from '/@/assets/svgicon/spemark.svg';
// 左上角ICON为消息的节点
class SpemarkNode extends IconNode.view {
  getImageHref () {
    return spemarkicon;
  }
}


export default {
  type: 'spemark',
  view: SpemarkNode,
  model: IconNode.model
}