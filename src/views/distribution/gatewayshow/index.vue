<template>
  <div class="workflow-container layout-padding">
    <div class="workflow-mask" v-if="state.isShow"></div>
    <div class="layout-padding-auto layout-padding-view workflow-warp">
      <div class="workflow">
        <!-- 顶部工具栏 -->
        <Tool @tool="onToolClick"/>

        <!-- 左侧导航区 -->
        <div class="workflow-content">
          <div class="workflow-left">
            <el-scrollbar>
              <div

                  v-for="val in state.tableGateway.data"
                  :key="val.ID"
                  :style="{ height:  'auto' }"
                  class="workflow-left-id"
              >
                <div class="workflow-left-item">
                  <div class="flex-warp-item Source" @click="onLeftClick(val)">
                    <div class="flex-warp-item-box">
                      <div class="item-img">
                        <img :src="gateimg"/>
                      </div>
                      <div class="item-txt-title">
                        <span> {{ val.Name }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <!-- 右侧绘画区 -->
          <div id="workflow-right" class="workflow-right" ref="workflowRightRef">
            <el-scrollbar always @scroll="handleWheel">
              <div class="line-box"
                   v-for="v in state.tableDataFlowShow"
                   :key="v.ID"

              >
                <div class="div-box">
                  <div
                      v-for="sl in v.SourceIPList"
                      :key="sl.ID"
                      class="div2-box"
                  >

                    <div class="flex-warp-item2">
                      <div :class="`flex-warp-item-box Target ${sl.ID}`" :id="sl.ID"
                      >
                        <div class="item-img">
                          <img :src="sl.src"/>

                        </div>
                        <div class="item-txt-title">
                          <span> {{ sl.IP }}</span>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
                <div class="div-box">
                  <div :class="`flex-warp-item-box Target ${v.ID}`">
                    <div class="item-img" :id="`MFlow_${v.ID}`">
                      <img :src="flowimg1" v-if="v.Type=='应用层透明传输'"/>
                      <img :src="flowimg2" v-if="v.Type=='混合编排'"/>
                      <img :src="flowimg3" v-if="v.Type=='指定流程'"/>
                      <img :src="flowimg4" v-if="v.Type=='网络层透明传输'"/>
                    </div>
                    <div class="item-txt-title">
                      <span> {{ v.Name }}</span>
                    </div>
                  </div>
                </div>
                <div class="div-box">
                  <div
                      v-for="sl in v.TargetIPList"
                      :key="sl.ID"
                      class="div2-box"
                  >

                    <div class="flex-warp-item2">
                      <div :class="`flex-warp-item-box Target ${sl.ID}`" :id="sl.ID"
                      >
                        <div class="item-img">
                          <img :src="sl.src"/>

                        </div>
                        <div class="item-txt-title">
                          <span> {{ sl.IP }}</span>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </el-scrollbar>

          </div>

        </div>
      </div>
    </div>

    <!-- 节点右键菜单 -->
    <Contextmenu :dropdown="state.dropdownNode" ref="contextmenuNodeRef" @current="onCurrentNodeClick"/>
    <!-- 线右键菜单 -->
    <Contextmenu :dropdown="state.dropdownLine" ref="contextmenuLineRef" @current="onCurrentLineClick"/>
    <!-- 编辑窗口 -->
    <UserDialog ref="userDialogRef" @refresh="getTableDataTarget()"/>
    <!-- 顶部工具栏-帮助弹窗 -->
    <Help ref="helpRef"/>
  </div>
</template>

<script setup lang="ts" name="pagesWorkflow">
import {defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';

import {jsPlumb} from 'jsplumb';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
import commonFunction from '/@/utils/commonFunction';
import {leftNavList} from './js/mock';
import {jsplumbConnect, jsplumbDefaults, jsplumbMakeSource, jsplumbMakeTarget} from './js/config';
import {useRoute, useRouter} from "vue-router";
import {gatewayApi} from "/@/api/distribution/gateway";
import {flowApi} from "/@/api/flowmanage/flow";
import gateassimg from '/@/assets/gateway.jpg';
import flowpng1 from '/@/assets/flow1.png';
import flowpng2 from '/@/assets/flow2.png';
import flowpng3 from '/@/assets/flow3.png';
import flowpng4 from '/@/assets/flow4.png';
import {IPDevicePic} from "/@/utils/common";
import {addressApi} from '/@/api/sysmanage/address';

const gateimg = ref(gateassimg);
const isHide = ref(false);
const activeNames = ref(['1'])
const source_node = ref(null);
// 引入组件
const Tool = defineAsyncComponent(() => import('./component/tool/index.vue'));
const Contextmenu = defineAsyncComponent(() => import('./component/contextmenu/index.vue'));
const Drawer = defineAsyncComponent(() => import('./component/drawer/index.vue'));
const Help = defineAsyncComponent(() => import('./component/tool/help.vue'));
const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messtraslate/detaildialog.vue'));
const userDialogRef = ref();
// 定义变量内容
const leftNavRefs = ref([]);
const TargetTable = ref();
const SourceTable = ref();
const workflowRightRef = ref();
const contextmenuNodeRef = ref();
const contextmenuLineRef = ref();
const drawerRef = ref();
const helpRef = ref();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const {themeConfig} = storeToRefs(storesThemeConfig);
const {copyText} = commonFunction();
const route = useRoute()
const router = useRouter();
const querys = route.query;

const flowimg1 = ref(flowpng1);
const flowimg2 = ref(flowpng2);
const flowimg3 = ref(flowpng3);
const flowimg4 = ref(flowpng4);
const calcIndex = (index) => {
  index = index + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1
  return index
}
// 打开修改转换规则界面弹窗
const onOpenEdit = (row: RowUserType) => {
  userDialogRef.value.openDialog('edit', state.sourceid, row);
};
const state = reactive({
  scrollTop: 0,
  tableStyle: {
    position: 'relative',
    top: '0px'
  },
  walkStatus: false,
  tableDataFlowShow: [],
  gateway: {
    ID: '0',
    Name: '',
    IP: '',
    Describes: '',
  },
  tableGateway: {
    data: [],
    type: '',
    total: 0,

    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
  tableDataDistribute: {
    id: '',
    data: [],
    type: '',
    total: 0,

    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
    history: [],
    nestid: 0,
    search: '',
    searchStr: '',
    ids: [],
    desc: '',
  },
  tableDataNetwork: {
    data: []
  },
  tableDataFlow: {
    id: '',
    data: [],
    type: '',
    total: 0,

    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
    history: [],
    nestid: 0,
    search: '',
    searchStr: '',
    ids: [],
    desc: '',
  },
  leftNavList: [],
  dropdownNode: {x: '', y: ''},
  dropdownLine: {x: '', y: ''},
  isShow: false,
  jsPlumb: null,
  jsPlumbNodeIndex: null,
  jsplumbDefaults,
  jsplumbMakeSource,
  jsplumbMakeTarget,
  jsplumbConnect,
  jsplumbData: {
    nodeList: [],
    lineList: [],
  },
});
// 初始化CLIP列表
const getNetworkIP = async () => {


  await addressApi().searchNetworkInter(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        order: 'ASC',
        orderField: 'id'
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableDataNetwork.data = res.data;

        } else {
          // ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];


};
const getTableGateway = async () => {
  state.tableGateway.loading = true;

  await gatewayApi().searchGateway(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: ''
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableGateway.data = res.data;


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];


  setTimeout(() => {
    state.tableGateway.loading = false;
  }, 200);
};
// 初始化分发连接情况
const getTableDataGatewayDistribute = async () => {
  state.tableDataDistribute.loading = true;

  await gatewayApi().searchGatewayDistributeall(
      {})
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableDataDistribute.data = res.data;

        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];


  setTimeout(() => {
    state.tableDataDistribute.loading = false;
  }, 200);
};
const IPDevicePicOptions = ref(IPDevicePic)
const getPicSrc = (ip) => {
  for (let i of state.tableDataNetwork.data) {
    if (i.IP == ip) {
      for (let k of IPDevicePic) {
        if (k.text == i.Pic) {
          return k.src;
        }
      }
    }
  }
  return '/src/assets/ipdevices/weizhi.png';
}
// 初始化目的消息体表格数据
const getTableDataFlow = async () => {
  state.tableDataFlow.loading = true;

  await flowApi().searchFlow(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableDataFlow.data = res.data;
          for (let obj of state.tableDataFlow.data) {
            obj.TargetIPList = [];
            obj.SourceIPList = [];
            if (obj.SourceIP != null && obj.SourceIP != '') {
              let psrc = getPicSrc(obj.SourceIP.split(":")[0]);
              obj.SourceIPList.push(
                  {
                    ID: obj.ID + "_S_" + obj.SourceIP.split(":")[0],
                    src: psrc,
                    IP: obj.SourceIP.split(":")[0],
                  }
              );
            }
            if (obj.TargetIP != null && obj.TargetIP != '') {
              let ilist = obj.TargetIP.split("|");
              for (let k of ilist) {
                if (k != null && k != '' && k != '-') {
                  let psrc = getPicSrc(k.split(":")[0]);

                  obj.TargetIPList.push(
                      {
                        ID: obj.ID + "_T_" + k.split(":")[0],
                        src: psrc,
                        IP: k.split(":")[0],
                      }
                  );
                }
              }
            }
          }
          // console.log(state.tableDataFlow.data);
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });


  setTimeout(() => {
    state.tableDataFlow.loading = false;
  }, 200);
};
// 设置 宽度小于 768，不支持操
const setClientWidth = () => {
  const clientWidth = document.body.clientWidth;
  clientWidth < 768 ? (state.isShow = true) : (state.isShow = false);
};
// 左侧导航-数据初始化
const initLeftNavList = () => {
  state.leftNavList = leftNavList;
  state.jsplumbData = {
    nodeList: [],
    lineList: [],
  };
};
// 左侧导航-初始化拖动
const initSortable = () => {

};
// 处理滚轮事件的方法
const handleWheel = (event) => {
  // console.log(event);
  state.scrollTop = event.scrollTop;

  nextTick(() => {
    //console.log("滚动触发");

    repaintWithScroll();
  })
}
const repaintWithScroll = () => {
  state.jsPlumb.repaintEverything();
  fix_jsPlumb_offset(state.scrollTop);
  //fix_jsPlumb_offset(state.scrollTop);
}

function fix_jsPlumb_offset(top) {
  var lines = document.getElementsByClassName("jtk-connector");
  var dots = document.getElementsByClassName("jtk-endpoint");
  var overlay = document.getElementsByClassName("jtk-overlay");
  //var drops = document.getElementsByClassName("jtk-endpoint-anchor");

  _fix_left(lines, top);
  _fix_left(dots, top);
  _fix_left(overlay, top);

}

function _fix_left(arr, top) {
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];

    var origin_top = obj.style.top.replace(/px/, "");
    obj.style.top = (parseInt(origin_top) - parseInt(top)) + 'px';
    //
    //console.log(obj.style.top);
  }
}

// 初始化 jsPlumb
const initJsPlumb = () => {
  jsPlumb.ready(() => {
    state.jsPlumb = jsPlumb.getInstance({
      detachable: false,
      Container: 'workflow-right',
    });


    state.jsPlumb.fire('jsPlumbDemoLoaded', state.jsPlumb);
    // 导入默认配置
    state.jsPlumb.importDefaults(state.jsplumbDefaults);
    // 会使整个jsPlumb立即重绘。
    state.jsPlumb.setSuspendDrawing(false, true);


  });
};
// 初始化节点、线的链接
const initJsPlumbConnection = () => {


};

const initNodes = () => {
  console.log("初始化转化目的节点");


  for (let k of state.tableDataFlowShow) {
    let slist = k.SourceIPList;
    let tlist = k.TargetIPList;
    let mflow = "MFlow_" + k.ID;
    let elem = document.getElementById(mflow);
    state.jsPlumb.makeSource(elem, state.jsplumbMakeSource, jsplumbConnect);
    state.jsPlumb.setSourceEnabled(elem, true)
    state.jsPlumb.makeTarget(elem, state.jsplumbMakeTarget, jsplumbConnect);
    state.jsPlumb.setTargetEnabled(elem, true)
    for (let i = 0; i < slist.length; i++) {
      elem = document.getElementById(slist[i].ID);
      initLeaf(elem, 'Source')
    }
    for (let i = 0; i < tlist.length; i++) {
      elem = document.getElementById(tlist[i].ID);
      initLeaf(elem, 'Target')
    }
  }


  console.log("初始化转化目的连接");

};
const makeNodesUnDrag = () => {
  console.log("禁止节点拖拽");


  for (let k of state.tableDataFlowShow) {
    let slist = k.SourceIPList;
    let tlist = k.TargetIPList;
    let mflow = "MFlow_" + k.ID;
    let elem = document.getElementById(mflow);

    state.jsPlumb.setSourceEnabled(elem, false)

    state.jsPlumb.setTargetEnabled(elem, false)
    for (let i = 0; i < slist.length; i++) {
      elem = document.getElementById(slist[i].ID);

      state.jsPlumb.setSourceEnabled(elem, false)
    }
    for (let i = 0; i < tlist.length; i++) {
      state.jsPlumb.setTargetEnabled(elem, false)
    }
  }


};
// 初始化具体节点
const initLeaf = (row, type) => {
  const ins = state.jsPlumb;
  const elem = row;
  if (type == 'Source') {

    //ins.setId(elem, "target_" + elem.classList[2]);
    ins.makeSource(elem, state.jsplumbMakeSource, jsplumbConnect);
    ins.setSourceEnabled(elem, true)

  }
  if (type == 'Target') {

    //ins.setId(elem, "target_" + elem.classList[2]);
    ins.makeTarget(elem, state.jsplumbMakeTarget, jsplumbConnect);
    ins.setTargetEnabled(elem, true)

  }


};
//根据转换规则连接元和目的
const initConn = () => {

  state.jsPlumb.deleteEveryConnection();
  state.jsPlumb.deleteEveryEndpoint();

  for (let k of state.tableDataFlowShow) {
    let slist = k.SourceIPList;
    let tlist = k.TargetIPList;
    let mflow = "MFlow_" + k.ID;
    let elem = document.getElementById(mflow);

    for (let i = 0; i < slist.length; i++) {
      state.jsPlumb.connect(
          {
            source: slist[i].ID,
            target: mflow,
            label: '',
          },
          state.jsplumbConnect
      );
    }
    for (let i = 0; i < tlist.length; i++) {
      state.jsPlumb.connect(
          {
            source: mflow,
            target: tlist[i].ID,
            label: '',
          },
          state.jsplumbConnect
      );
    }
  }


  //state.jsPlumb.setSuspendDrawing(false, true);
  //const sourceitem = document.getElementById("source_node");

  //state.jsPlumb.setSourceEnabled(sourceitem, false);
}
const makeNodesUnable = () => {
  for (let k of state.tableDataFlowShow) {
    let slist = k.SourceIPList;
    let tlist = k.TargetIPList;
    let mflow = "MFlow_" + k.ID;
    let elem = document.getElementById(mflow);
    state.jsPlumb.setSourceEnabled(elem, false)
    state.jsPlumb.setTargetEnabled(elem, false)
    for (let i = 0; i < slist.length; i++) {
      elem = document.getElementById(slist[i].ID);
      state.jsPlumb.setSourceEnabled(elem, false)

    }
    for (let i = 0; i < tlist.length; i++) {
      elem = document.getElementById(tlist[i].ID);
      state.jsPlumb.setTargetEnabled(elem, false)
    }
  }
}

const onLeftClick = (val) => {
  state.gateway.ID = val.ID;
  state.gateway.Name = val.Name
  state.gateway.IP = val.IP;
  state.gateway.Describes = val.Describes;
  //getTableDataGatewayDistribute();
  updatetableDataFlowShow();

}

function getFlowDescribe(id) {
  for (let i of state.tableDataFlow.data) {
    if (i.ID == id) {
      return i.Describes;
    }
  }
  return "";
}

function checkFlowExist(gateid, flowid) {
  for (let i of state.tableDataDistribute.data) {
    if (i.GateID == gateid && i.FlowID == flowid) {
      return true;
    }

  }
  return false;
}

const updatetableDataFlowShow = () => {
  state.tableDataFlowShow.length = 0;
  for (let i of state.tableDataFlow.data) {
    if (checkFlowExist(state.gateway.ID, i.ID)) {
      state.tableDataFlowShow.push(i);
    }
  }
  nextTick(() => {
    initNodes();
    initConn();
      makeNodesUnDrag();
    //makeNodesUnable();
  });


}
// 左侧导航-菜单标题点击
const onTitleClick = (val: any) => {
  val.isOpen = !val.isOpen;
};
// 右侧内容区-当前项点击
const onItemCloneClick = (k: number) => {
  state.jsPlumbNodeIndex = k;
};
// 右侧内容区-当前项右键菜单点击
const onContextmenu = (v: any, k: number, e: MouseEvent) => {
  state.jsPlumbNodeIndex = k;
  const {clientX, clientY} = e;
  state.dropdownNode.x = clientX;
  state.dropdownNode.y = clientY;
  v.type = 'node';
  v.label = '';
  let item: any = {};
  state.leftNavList.forEach((l) => {
    if (l.children) if (l.children.find((c: any) => c.id === v.id)) item = l.children.find((c: any) => c.id === v.id);
  });
  v.from = item.form;
  contextmenuNodeRef.value.openContextmenu(v);
};
// 右侧内容区-当前项右键菜单点击回调(节点)
const onCurrentNodeClick = (item: any) => {
  const {contextMenuClickId, nodeId} = item;
  if (contextMenuClickId === 0) {
    const nodeIndex = state.jsplumbData.nodeList.findIndex((item) => item.nodeId === nodeId);
    state.jsplumbData.nodeList.splice(nodeIndex, 1);
    state.jsPlumb.removeAllEndpoints(nodeId);
    state.jsPlumbNodeIndex = null;
  } else if (contextMenuClickId === 1) {
    drawerRef.value.open(item);
  }
};
// 右侧内容区-当前项右键菜单点击回调(线)
const onCurrentLineClick = (item: any, conn: any) => {
  const {contextMenuClickId} = item;

  if (contextMenuClickId === 0) {
    state.jsPlumb.deleteConnection(conn);
    const {sourceId, targetId} = conn;
    updateNodeByConn(sourceId, targetId, 'del');
  }
};
// 设置线的 label
const setLineLabel = (obj: any) => {
  const {sourceId, targetId, label} = obj;
  const conn = state.jsPlumb.getConnections({
    source: sourceId,
    target: targetId,
  })[0];
  conn.setLabel(label);
  if (!label || label === '') {
    conn.addClass('workflow-right-empty-label');
  } else {
    conn.removeClass('workflow-right-empty-label');
    conn.addClass('workflow-right-label');
  }
  state.jsplumbData.lineList.forEach((v) => {
    if (v.sourceId === sourceId && v.targetId === targetId) v.label = label;
  });
};
// 设置节点内容
const setNodeContent = (obj: any) => {
  const {nodeId, name, icon} = obj;
  // 设置节点 name 与 icon
  state.jsplumbData.nodeList.forEach((v) => {
    if (v.nodeId === nodeId) {
      v.name = name;
      v.icon = icon;
    }
  });
  // 重绘
  nextTick(() => {
    state.jsPlumb.setSuspendDrawing(false, true);
  });
};
// 顶部工具栏-当前项点击
const onToolClick = (fnName: String) => {
  switch (fnName) {
    case 'help':
      onToolHelp();
      break;
    case 'download':
      onToolDownload();
      break;
    case 'submit':
      onToolSubmit();
      break;
    case 'copy':
      onToolCopy();
      break;
    case 'del':
      onToolDel();
      break;
    case 'fullscreen':
      onToolFullscreen();
      break;
    case 'closeWin':
      router.go(-1);
      break;
  }
};
// 顶部工具栏-帮助
const onToolHelp = () => {
  nextTick(() => {
    helpRef.value.open();
  });
};
// 顶部工具栏-下载
const onToolDownload = () => {
  const {globalTitle} = themeConfig.value;
  const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.jsplumbData, null, '\t'));
  const aLink = document.createElement('a');
  aLink.setAttribute('href', href);
  aLink.setAttribute('download', `${globalTitle}工作流.json`);
  aLink.click();
  aLink.remove();
  ElMessage.success('下载成功');
};
// 顶部工具栏-提交
const onToolSubmit = () => {
  // console.log(state.jsplumbData);
  ElMessage.success('数据提交成功');
};
// 顶部工具栏-复制
const onToolCopy = () => {
  copyText(JSON.stringify(state.jsplumbData));
};
// 顶部工具栏-删除
const onToolDel = () => {
  ElMessageBox.confirm('此操作将清空画布，是否继续？', '提示', {
    confirmButtonText: '清空',
    cancelButtonText: '取消',
  })
      .then(() => {
        state.jsplumbData.nodeList.forEach((v) => {
          state.jsPlumb.removeAllEndpoints(v.nodeId);
        });
        nextTick(() => {
          state.jsplumbData = {
            nodeList: [],
            lineList: [],
          };
          ElMessage.success('清空画布成功');
        });
      })
      .catch(() => {
      });
};
// 顶部工具栏-全屏
const onToolFullscreen = () => {
  stores.setCurrenFullscreen(true);
};
// 页面加载时
onMounted(async () => {
  await getNetworkIP();
  await getTableGateway();
  await getTableDataFlow();
  await getTableDataGatewayDistribute();


  console.log(state.tableDataFlow.data);
  console.log(state.tableDataDistribute.data);
  await initLeftNavList();
  initSortable();
  initJsPlumb();
  setClientWidth();
  window.addEventListener('scroll', handleWheel);
  window.addEventListener('resize', setClientWidth);
});
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('scroll', handleWheel);
  window.removeEventListener('resize', setClientWidth);
});
</script>

<style scoped lang="scss">
.workflow-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    .el-table {
      flex: 1;
    }
  }


  :deep(.el-table) {
    /* 替换默认展开收起图片 */
    /* prettier-ignore */
    .el-table__expand-icon {
      width: 12PX;
      height: 12PX;
      //background: ele-Plus no-repeat;
      //ele-Plus
      background: url("/@/assets/public/add-bold.png") no-repeat;
      background-size: 100% 100%;

      .el-icon {
        display: none;
      }
    }

    .el-table__expand-icon--expanded {
      transform: none;
      background: url("/@/assets/public/minus-bold.png") no-repeat;
      //ele-SemiSelect
      background-size: 100% 100%;
    }
  }

  :deep(.el-collapse-item__header) {
    text-align: center;
    font-size: 16px;
    display: block;
    font-weight: bold;
  }

  :deep(.centered-collapse) {
    border: 2px solid #ebeef5;
    margin-bottom: -1px;
  }

  position: relative;

  .workflow-warp {
    position: relative;
  }

  .workflow {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;

    .workflow-content {
      display: flex;
      height: calc(100% - 35px);

      .workflow-left {
        width: 220px;
        height: 100%;
        border-right: 1px solid var(--el-border-color-light, #ebeef5);

        :deep(.el-collapse-item__content) {
          padding-bottom: 0;
        }

        .workflow-left-title {
          height: 50px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          border-top: 1px solid var(--el-border-color-light, #ebeef5);
          color: var(--el-text-color-primary);
          cursor: default;

          span {
            flex: 1;
          }
        }

        .workflow-left-item {
          display: inline-block;
          width: calc(50% - 15px);
          position: relative;
          cursor: move;
          margin: 0 0 10px 10px;

          :deep(.flex-warp-item) {

            align-self: flex-start;
            overflow: auto;

            margin-left: 40%;
            margin-top: 5px;

            width: 100%;

            border-color: black;

            padding: 5px;
            width: 150px;
            height: 150px;

            .flex-warp-item-box {
              border: 1px solid var(--next-border-color-light);
              width: 100%;
              height: 100%;
              border-radius: 2px;
              display: flex;
              flex-direction: column;
              transition: all 0.3s ease;

              .item-txt-title {
                color: var(--el-color-primary) !important;
                font-size: 14px;
                text-align: center;
                transition: all 0.3s ease;
              }

              &:hover {
                cursor: pointer;
                border: 1px solid var(--el-color-primary);
                transition: all 0.3s ease;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);


                .item-img {
                  height: 100%;

                  img {
                    transition: all 0.3s ease;
                    transform: translateZ(0) scale(1.2);
                  }
                }
              }

              .item-img {
                width: 100%;
                height: 215px;
                overflow: hidden;

                img {
                  transition: all 0.3s ease;
                  width: 100%;
                  height: 100%;
                }
              }

              .item-txt {
                flex: 1;
                padding: 15px;
                display: flex;
                flex-direction: column;
                overflow: hidden;

                .item-txt-title {
                  text-overflow: ellipsis;
                  overflow: hidden;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  display: -webkit-box;
                  color: #666666;
                  transition: all 0.3s ease;

                  &:hover {
                    color: var(--el-color-primary);
                    text-decoration: underline;
                    transition: all 0.3s ease;
                  }
                }

                .item-txt-other {
                  flex: 1;
                  align-items: flex-end;
                  display: flex;

                  .item-txt-msg {
                    font-size: 12px;
                    color: #8d8d91;
                  }

                  .item-txt-price {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .font-price {
                      color: #ff5000;

                      .font {
                        font-size: 22px;
                      }
                    }
                  }
                }
              }
            }
          }

          .workflow-left-item-icon {
            height: 35px;
            display: flex;
            align-items: center;
            transition: all 0.3s ease;
            padding: 5px 10px;
            border: 1px dashed transparent;
            background: var(--next-bg-color);
            border-radius: 3px;

            i,
            .name {
              color: var(--el-text-color-secondary);
              transition: all 0.3s ease;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            &:hover {
              transition: all 0.3s ease;
              border: 1px dashed var(--el-color-primary);
              background: var(--el-color-primary-light-9);
              border-radius: 5px;

              i,
              .name {
                transition: all 0.3s ease;
                color: var(--el-color-primary);
              }
            }
          }
        }

        & .workflow-left-id:first-of-type {
          .workflow-left-title {
            border-top: none;
          }
        }
      }

      .workflow-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
        background-image: linear-gradient(90deg, rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%),
        linear-gradient(rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%);
        background-size: 10px 10px;

        .line-box {
          margin: 5px;
          display: flex;
          flex-wrap: wrap;
          width: 100%;

          .div-box {
            flex: 1;
            width: 33.333%;
            display: flex; /* 使用Flexbox布局 */
            flex-direction: column; /* 子元素垂直排列 */
            justify-content: center; /* 垂直居中 */
            align-items: center; /* 如果需要水平居中，可以加上这个属性 */
            .div2-box {
              margin: 5px;

              .flex-warp-item-box {

                width: 70%;
                height: 70%;
                border-radius: 2px;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;

                .item-txt-title {
                  color: var(--el-color-primary) !important;
                  font-size: 12px;
                  text-align: center;
                  transition: all 0.3s ease;
                }

                &:hover {
                  cursor: pointer;
                  border: 1px solid var(--el-color-primary);
                  transition: all 0.3s ease;
                  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);


                  .item-img {
                    img {
                      transition: all 0.3s ease;
                      transform: translateZ(0) scale(1.05);
                    }
                  }
                }

                .item-img {
                  width: 100%;
                  height: 215px;
                  overflow: hidden;

                  img {
                    transition: all 0.3s ease;
                    width: 100%;
                    height: 100%;
                  }
                }

                .item-txt {
                  flex: 1;
                  padding: 15px;
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;

                  .item-txt-title {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    display: -webkit-box;
                    color: #666666;
                    transition: all 0.3s ease;

                    &:hover {
                      color: var(--el-color-primary);
                      text-decoration: underline;
                      transition: all 0.3s ease;
                    }
                  }

                  .item-txt-other {
                    flex: 1;
                    align-items: flex-end;
                    display: flex;

                    .item-txt-msg {
                      font-size: 12px;
                      color: #8d8d91;
                    }

                    .item-txt-price {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;

                      .font-price {
                        color: #ff5000;

                        .font {
                          font-size: 22px;
                        }
                      }
                    }
                  }
                }
              }
            }

            .flex-warp-item-box {
              border: 1px solid var(--next-border-color-light);
              width: 50%;
              height: auto;
              border-radius: 2px;
              display: flex;
              flex-direction: column;
              transition: all 0.3s ease;
              justify-content: center; /* 垂直居中 */
              .item-txt-title {
                color: var(--el-color-primary) !important;
                font-size: 14px;
                text-align: center;
                transition: all 0.3s ease;
              }

              &:hover {
                cursor: pointer;
                border: 1px solid var(--el-color-primary);
                transition: all 0.3s ease;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);


                .item-img {
                  img {
                    transition: all 0.3s ease;
                    transform: translateZ(0) scale(1.05);
                  }
                }
              }

              .item-img {
                width: 100%;
                height: 215px;
                overflow: hidden;

                img {
                  transition: all 0.3s ease;
                  width: 100%;
                  height: 100%;
                }
              }

              .item-txt {
                flex: 1;
                padding: 15px;
                display: flex;
                flex-direction: column;
                overflow: hidden;

                .item-txt-title {
                  text-overflow: ellipsis;
                  overflow: hidden;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  display: -webkit-box;
                  color: #666666;
                  transition: all 0.3s ease;

                  &:hover {
                    color: var(--el-color-primary);
                    text-decoration: underline;
                    transition: all 0.3s ease;
                  }
                }

                .item-txt-other {
                  flex: 1;
                  align-items: flex-end;
                  display: flex;

                  .item-txt-msg {
                    font-size: 12px;
                    color: #8d8d91;
                  }

                  .item-txt-price {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .font-price {
                      color: #ff5000;

                      .font {
                        font-size: 22px;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        :deep(.flex-warp-item) {

          align-self: flex-start;
          overflow: auto;

          margin-left: 5%;
          margin-top: 10%;


          border-color: black;

          padding: 5px;
          width: 150px;
          height: 150px;

          .flex-warp-item-box {
            border: 1px solid var(--next-border-color-light);
            width: 100%;
            height: 100%;
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;

            .item-txt-title {
              color: var(--el-color-primary) !important;
              font-size: 14px;
              text-align: center;
              transition: all 0.3s ease;
            }

            &:hover {
              cursor: pointer;
              border: 1px solid var(--el-color-primary);
              transition: all 0.3s ease;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);


              .item-img {
                img {
                  transition: all 0.3s ease;
                  transform: translateZ(0) scale(1.05);
                }
              }
            }

            .item-img {
              width: 100%;
              height: 215px;
              overflow: hidden;

              img {
                transition: all 0.3s ease;
                width: 100%;
                height: 100%;
              }
            }

            .item-txt {
              flex: 1;
              padding: 15px;
              display: flex;
              flex-direction: column;
              overflow: hidden;

              .item-txt-title {
                text-overflow: ellipsis;
                overflow: hidden;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                display: -webkit-box;
                color: #666666;
                transition: all 0.3s ease;

                &:hover {
                  color: var(--el-color-primary);
                  text-decoration: underline;
                  transition: all 0.3s ease;
                }
              }

              .item-txt-other {
                flex: 1;
                align-items: flex-end;
                display: flex;

                .item-txt-msg {
                  font-size: 12px;
                  color: #8d8d91;
                }

                .item-txt-price {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  .font-price {
                    color: #ff5000;

                    .font {
                      font-size: 22px;
                    }
                  }
                }
              }
            }
          }
        }

        :deep(.rightcolumn) {
          display: flex;
          flex-direction: column;

          justify-content: center;
          flex-wrap: wrap;
        }

        :deep(.flex-warp-item2) {


          align-self: center;
          overflow: auto;

          border-color: black;
          padding: 5px;
          width: 100px;
          height: 100px;

          .flex-warp-item-box {
            border: 1px solid var(--next-border-color-light);
            width: 100%;
            height: 100%;
            border-radius: 2px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;

            .item-txt-title {
              color: var(--el-color-primary) !important;
              font-size: 14px;
              text-align: center;
              transition: all 0.3s ease;
            }

            &:hover {
              cursor: pointer;
              border: 1px solid var(--el-color-primary);
              transition: all 0.3s ease;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);


              .item-img {
                img {
                  transition: all 0.3s ease;
                  transform: translateZ(0) scale(1.05);
                }
              }
            }

            .item-img {
              width: 100%;
              height: 215px;
              overflow: hidden;

              img {
                transition: all 0.3s ease;
                width: 100%;
                height: 100%;
              }
            }

            .item-txt {
              flex: 1;
              padding: 15px;
              display: flex;
              flex-direction: column;
              overflow: hidden;

              .item-txt-title {
                text-overflow: ellipsis;
                overflow: hidden;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                display: -webkit-box;
                color: #666666;
                transition: all 0.3s ease;

                &:hover {
                  color: var(--el-color-primary);
                  text-decoration: underline;
                  transition: all 0.3s ease;
                }
              }

              .item-txt-other {
                flex: 1;
                align-items: flex-end;
                display: flex;

                .item-txt-msg {
                  font-size: 12px;
                  color: #8d8d91;
                }

                .item-txt-price {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  .font-price {
                    color: #ff5000;

                    .font {
                      font-size: 22px;
                    }
                  }
                }
              }
            }
          }
        }

        :deep(.eltableclass) {
          vertical-align: top;
          display: inline-block;
          overflow: auto;

          margin-left: 50px;
          margin-top: 25px;


          width: 16%;
          border: 1px solid black;
          border-color: black
        }


      }
    }
  }

  .workflow-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    &::after {
      content: '手机版不支持 jsPlumb 操作';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      background: rgba(255, 255, 255, 0.9);
      color: #666666;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
