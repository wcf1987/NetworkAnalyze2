import IconNode from './IconNode'

import messtraslateicon from '/@/assets/svgicon/messtraslate.svg';
// 左上角ICON为消息的节点
class MesstraslateNode extends IconNode.view {
  getImageHref () {
    return messtraslateicon;
  }
}


export default {
  type: 'messtraslate',
  view: MesstraslateNode,
  model: IconNode.model
}