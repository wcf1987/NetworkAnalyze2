import IconNode from './IconNode'

import pacparseicon from '/@/assets/svgicon/pacparse.svg';
// 左上角ICON为消息的节点
class PacencapNode extends IconNode.view {
  getImageHref () {
    return pacparseicon;
  }
}


export default {
  type: 'pacencap',
  view: PacencapNode,
  model: IconNode.model
}