import { RectResize } from '@logicflow/extension'


// 矩形
class RectNewModel extends RectResize.model {
//矩形外框大小设置
initNodeData(data) {
    super.initNodeData(data);
    this.width = 120;
    this.height = 80;

  }

  setToBottom () {
    this.zIndex = 0
  }

  getNodeStyle () {
    const style = super.getNodeStyle()
    const properties = this.getProperties()

    return style
  }
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo);
    style.stroke = "rgb(24, 125, 255)";
    style.r = 6;
    style.hover.r = 10;
    style.hover.fill = "rgb(24, 125, 255)";
    style.hover.stroke = "rgb(24, 125, 255)";
    return style;
  }
  getTextStyle () {
    const style = super.getTextStyle()
    style.fontSize=14;
    const properties = this.getProperties()
    return style
  }

}

export default {
  type: 'pro-rect',
  view: RectResize.view,
  model: RectNewModel
}
