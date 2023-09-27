import IconNode from './IconNode'

import pacencapicon from '/@/assets/svgicon/pacencap.svg';
// 左上角ICON为消息的节点
class PacparseNode extends IconNode.view {
  getImageHref () {
    return pacencapicon;
  }
}


export default {
  type: 'pacparse',
  view: PacparseNode,
  model: IconNode.model
}