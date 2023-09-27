import IconNode from './IconNode'

import starticon from '/@/assets/svgicon/start.svg';
// 左上角ICON为消息的节点
class messtraslateNode extends IconNode.view {
  getImageHref () {
    return starticon;
  }

}


export default {
  type: 'start',
  view: messtraslateNode,
  model: IconNode.model
}