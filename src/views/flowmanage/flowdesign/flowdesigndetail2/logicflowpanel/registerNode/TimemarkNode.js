import IconNode from './IconNode'

import timemarkicon from '/@/assets/svgicon/timemark.svg';
// 左上角ICON为消息的节点
class TimemarkNode extends IconNode.view {
  getImageHref () {
    return timemarkicon;
  }
}


export default {
  type: 'timemark',
  view: TimemarkNode,
  model: IconNode.model
}