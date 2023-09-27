import IconNode from './IconNode'
import messparseicon from '/@/assets/svgicon/messparse.svg';
// 左上角ICON为消息的节点
class MessparseNode extends IconNode.view {
  getImageHref () {
    return messparseicon;
  }
}


export default {
  type: 'messparse',
  view: MessparseNode,
  model: IconNode.model
}