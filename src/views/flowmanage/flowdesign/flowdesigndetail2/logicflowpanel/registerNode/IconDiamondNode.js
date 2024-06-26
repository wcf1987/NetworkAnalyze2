import { h } from '@logicflow/core'

import DiamondsNode from "./DiamondsNode";

// 左上角带ICON的节点
class IconDiamondNode extends DiamondsNode.view {
  getImageHref () {
    return;
  }
  getResizeShape() {
    const { x, y, width, height } = this.props.model
    //const style = this.props.model.getNodeStyle()
    const href = this.getImageHref()
    const iconAttrs = {
      x: x -  1/2 * width + 5,
      y: y - 1/2 * height + 5, // icon在左上角
      width: 20,
      height: 20,
      href,
      // 根据宽高缩放
      preserveAspectRatio: 'none meet'
    }
    const rectAttrs = {
      strokeWidth: 2,
      fill:'#FFFFFF',
      stroke: "#000000",

      rx: 5,
      ry: 5,
      x: x- 1/2 * width,
      y: y - 1/2 * height,
      width:width,
      height,
    }
    return h('g', {}, [
       h('rect', { ...rectAttrs }),
       h('image', { ...iconAttrs })
    ]
    );
  }
}

export default {
  type: 'image-node',
  view: IconDiamondNode,
  model: DiamondsNode.model
}