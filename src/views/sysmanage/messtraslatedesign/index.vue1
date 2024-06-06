<template>
  <div class="workflow-container layout-padding">
    <div class="workflow-mask" v-if="state.isShow"></div>
    <div class="layout-padding-auto layout-padding-view workflow-warp">
      <div class="workflow">
        <!-- 顶部工具栏 -->
        <Tool @tool="onToolClick"/>


        <!-- 左侧导航区 -->
        <div class="workflow-content">


          <!-- 右侧绘画区 -->
          <div id="workflow-right" class="workflow-right" ref="workflowRightRef" @scroll.stop="scrollPaint">
            <el-table :data="state.tableDataSource.data" row-key="ID"
                      ref="SourceTable"
                      v-loading="state.tableDataSource.loading"
                      @row-click="onClickSource"
                      :row-class-name="({row}) => `SourceRow ${row.ID}`"
                      @expand-change="(row, expanded) => !expanded && SourceTable?.toggleRowExpansion(row)"
                      default-expand-all class="eltableclass" id="sourcetable">
              <el-table-column type="selection" width="50" v-if="false"/>
              <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
              <el-table-column prop="parentindex" label="" width="60" v-if="false"/>
              <el-table-column prop="OutType" label="类型" v-if="false"></el-table-column>
              <el-table-column prop="DFIID" label="DFIID" v-if="false"></el-table-column>
              <el-table-column prop="Name" :label="'源:'+state.sourceName"
                               show-overflow-tooltip>
<!--
                <template #default="scope">
                  <div :id="'SourceRow '+scope.row.ID" :class="'SourceRow '+scope.row.ID">{{ scope.row.Name }}</div>
                </template>
-->

              </el-table-column>
              <el-table-column prop="EName" label="引用名" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="ShortName" label="简称" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="Flag" label="数据标识" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="Describes" label="说明" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="OutType" label="特别类型" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="NestID" label="特别类型" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="Length" label="位数" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="Type" label="类型" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip
                               v-if="isHide"></el-table-column>


            </el-table>
            <el-table :data="state.tableDataTranslate.data" row-key="ID"
                      v-loading="state.tableDataTranslate.loading"
                      ref="TargetTable"
                      style="margin-left: 600px;"
                      @row-click="onOpenEdit"
                      :row-class-name="({row}) => `TargetRow ${row.ID}`"
                      @expand-change="(row, expanded) => !expanded && TargetTable?.toggleRowExpansion(row)"
                      default-expand-all class="eltableclass">
              <el-table-column type="selection" width="50" v-if="false"/>
              <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
              <el-table-column prop="parentindex" label="" width="60" v-if="false"/>
              <el-table-column prop="OutType" label="类型" v-if="false"></el-table-column>
              <el-table-column prop="DFIID" label="DFIID" v-if="false"></el-table-column>
              <el-table-column prop="Name" :label="'目的:'+state.targetName"
                               show-overflow-tooltip></el-table-column>
              <el-table-column prop="EName" label="引用名" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="ShortName" label="简称" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="Flag" label="数据标识" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="Describes" label="说明" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="OutType" label="特别类型" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="NestID" label="特别类型" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="Length" label="位数" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip
                               v-if="isHide"></el-table-column>
              <el-table-column prop="Type" label="类型" show-overflow-tooltip
                               v-if="false"></el-table-column>
              <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip
                               v-if="isHide"></el-table-column>


            </el-table>
            <div
                v-for="(v, k) in state.jsplumbData.nodeList"
                :key="v.nodeId"
                :id="v.nodeId"
                :data-node-id="v.nodeId"
                :class="v.class"
                :style="{ left: v.left, top: v.top }"
                @click="onItemCloneClick(k)"
                @contextmenu.prevent="onContextmenu(v, k, $event)"
            >
              <div class="workflow-right-box"
                   :class="{ 'workflow-right-active': state.jsPlumbNodeIndex === k }">
                <div class="workflow-left-item-icon">
                  <SvgIcon :name="v.icon" class="workflow-icon-drag"/>
                  <div class="font10 pl5 name">{{ v.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div ref="workflow-right2" class="workflow-right2">
            <el-collapse v-model="activeNames" class="centered-collapse">
              <el-collapse-item title="流程设计属性" name="1" style="font-size:14px">
                <template #title>
                  源消息体字段属性
                  <el-icon class="header-icon">
                    <ele-InfoFilled/>
                  </el-icon>
                </template>
                <el-card style="font-size:14px">
                  <p class="text item"
                     v-if="state.sourceData!=null &&state.sourceData.OutType=='fields'">{{
                      'DFI标识号：'
                      + state.sourceData.DFINO
                    }}</p>
                  <p class="text item"
                     v-if="state.sourceData!=null &&state.sourceData.OutType=='fields'">{{
                      'DFI版本号：'
                      + state.sourceData.DFIVersion
                    }}</p>
                  <p class="text item"
                     v-if="state.sourceData!=null &&state.sourceData.OutType=='fields'">{{
                      'DUI标识号：'
                      + state.sourceData.DUINO
                    }}</p>
                  <p class="text item"
                     v-if="state.sourceData!=null &&state.sourceData.OutType=='fields'">{{
                      'DUI版本号：'
                      + state.sourceData.DUIVersion
                    }}</p>
                  <p class="text item">{{ '名称： ' + state.sourceData.Name }}</p>
                  <p class="text item">{{ '数据标识： ' + state.sourceData.Flag }}</p>
                  <p class="text item">{{ '类型： ' + state.sourceData.Type }}</p>
                  <p class="text item">{{ '简称： ' + state.sourceData.ShortName }}</p>
                  <p class="text item">{{ '位数 ' + state.sourceData.Length }}</p>
                </el-card>
              </el-collapse-item>
            </el-collapse>
            <el-collapse v-model="activeNames" class="centered-collapse">
              <el-collapse-item title="流程设计属性" name="1" style="font-size:14px">
                <template #title>
                  目的消息体字段属性
                  <el-icon class="header-icon">
                    <ele-InfoFilled/>
                  </el-icon>
                </template>
                <el-card style="font-size:14px">
                  <p class="text item" v-if="state.targetData.OutType=='fields'">{{
                      'DFI标识号：'
                      + state.targetData.DFINO
                    }}</p>
                  <p class="text item" v-if="state.targetData.OutType=='fields'">{{
                      'DFI版本号：'
                      + state.targetData.DFIVersion
                    }}</p>
                  <p class="text item" v-if="state.targetData.OutType=='fields'">{{
                      'DUI标识号：'
                      + state.targetData.DUINO
                    }}</p>
                  <p class="text item" v-if="state.targetData.OutType=='fields'">{{
                      'DUI版本号：'
                      + state.targetData.DUIVersion
                    }}</p>

                  <p class="text item">{{ '名称： ' + state.targetData.Name }}</p>
                  <p class="text item">{{ '数据标识： ' + state.targetData.Flag }}</p>
                  <p class="text item">{{ '类型： ' + state.targetData.Type }}</p>
                  <p class="text item">{{ '简称： ' + state.targetData.ShortName }}</p>
                  <p class="text item">{{ '位数 ' + state.targetData.Length }}</p>
                </el-card>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>

    <!-- 节点右键菜单 -->
    <Contextmenu :dropdown="state.dropdownNode" ref="contextmenuNodeRef" @current="onCurrentNodeClick"/>
    <!-- 线右键菜单 -->
    <Contextmenu :dropdown="state.dropdownLine" ref="contextmenuLineRef" @current="onCurrentLineClick"/>
    <!-- 编辑窗口 -->
    <UserDialog ref="userDialogRef" @refresh="getTableDataTranslate()"/>
    <!-- 顶部工具栏-帮助弹窗 -->
    <Help ref="helpRef"/>
  </div>
</template>

<script setup lang="ts" name="pagesWorkflow">
import {defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
import commonFunction from '/@/utils/commonFunction';
import {leftNavList} from './js/mock';
import {jsplumbConnect, jsplumbDefaults, jsplumbEndpoint, jsplumbMakeSource, jsplumbMakeTarget} from './js/config';
import {useRoute, useRouter} from "vue-router";
import {messdetailApi} from "/@/api/sysmanage/messdetail";
import {messtranslateApi} from "/@/api/sysmanage/messtranslate";
import {fieldsdetailApi} from "/@/api/sysmanage/fieldsdetail";

import {jsPlumb} from 'jsplumb';

const isHide = ref(false);
const activeNames = ref(['1'])
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
const calcIndex = (index) => {
  index = index + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1
  return index
}
// 打开修改转换规则界面弹窗
const onOpenEdit = (row: RowUserType) => {
  state.targetData = findTargetData(row.ID);
  if (row.SourceData != null && row.SourceData.length != 0) {
    state.sourceData = findSourceDataByName(row.SourceData[0]);
    if (state.sourceData == null) {
      state.sourceData = {};
      state.sourceData.Name = '';
      state.sourceData.Flag = '';
      state.sourceData.Type = '';
      state.sourceData.ShortName = '';
      state.sourceData.Length = '';
    }
    if (state.sourceData != null && state.sourceData.OutType == 'fields') {
      addFieldsInfo(state.sourceData)
    }
  } else {
    state.sourceData.Name = '';
    state.sourceData.Flag = '';
    state.sourceData.Type = '';
    state.sourceData.ShortName = '';
    state.sourceData.Length = '';
  }

  if (state.targetData.OutType == 'fields') {
    addFieldsInfo(state.targetData)
  }
  userDialogRef.value.openDialog('edit', state.sourceid, row);
};
// 点击左侧节点
const onClickSource = (row: RowUserType) => {

  state.sourceData = findSourceData(row.ID);
  if (state.sourceData.OutType == 'fields') {
    addFieldsInfo(state.sourceData)
  }
};
// 鼠标划入左侧
const cellMouseEnter = (row: RowUserType) => {

  state.sourceData = findSourceData(row.ID);
  //console.log(row);
  //fix_jsPlumb_offset(state.scrollTop);
  //repaintWithScroll();
};

//追加数据域信息
const addFieldsInfo = (origin) => {
  fieldsdetailApi().getById(
      {id: origin.OutID}
  )
      .then(res => {
        //console.log(res);
        if (res.code == '200') {
          origin.DFINO = res.data.DFINO;
          origin.DFIVersion = res.data.DFIVersion;
          origin.DUINO = res.data.DUINO;
          origin.DUIVersion = res.data.DUIVersion;

          //closeDialog();
          //emit('refresh');
        } else {
          //ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const findTargetData = (id) => {
  const nodes = walkTreeToList(state.tableDataTarget.data)
  for (let i of nodes) {
    if (i.ID == id) {
      return i;
    }
  }
  return null;
}
const findSourceData = (id) => {
  const nodes = walkTreeToList(state.tableDataSource.data)
  for (let i of nodes) {
    if (i.ID == id) {
      return i;
    }
  }
  return null;
}
const findSourceDataByName = (name) => {
  const nodes = walkTreeToList(state.tableDataSource.data)
  for (let i of nodes) {
    if (i.Name == name) {
      return i;
    }
  }
  return null;
}
const state = reactive({
  intervalId: '',
  id: '',
  sourceid: '',
  targetid: '',
  sourceName: '',
  targetName: '',
  walkStatus: false,
  scrollTop: 0,

  tableDataSource: {
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
  tableDataTarget: {
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
  tableDataTranslate: {
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
  sourceData: {
    Name: '',
    Flag: '',
    Type: '',
    ShortName: '',
    Length: ''
  },
  targetData: {
    Name: '',
    Flag: '',
    Type: '',
    ShortName: '',
    Length: ''
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
  jsplumbEndpoint,
  jsplumbData: {
    nodeList: [],
    lineList: [],
  },
});
// 初始化源消息体表格数据
const getTableDataSource = async () => {
  state.tableDataSource.loading = true;

  await messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: state.sourceid,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'body',
        nestid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableDataSource.data = res.data;
          let id = 0;
          for (let i of state.tableDataSource.data) {
            i.parentindex = id + 1;
            id = id + 1;
          }
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];


  setTimeout(() => {
    state.tableDataSource.loading = false;
  }, 200);
};
const getTableDataTarget = async () => {


  await messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: state.targetid,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'body',
        nestid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableDataTarget.data = res.data;
          let id = 0;
          for (let i of state.tableDataTarget.data) {
            i.parentindex = id + 1;
            id = id + 1;
          }
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
  //const data = [];


};


function walkTreeJSONParse(tree) {
  let node, list = [...tree], nodes = []

  while (node = list.shift()) {
    node.SourceData = JSON.parse(node.SourceData)
    node.Funcrule = JSON.parse(node.Funcrule)
    nodes.push(node)
    node.children && list.unshift(...node.children)
  }

  return nodes
}

// 初始化目的消息体表格数据
const getTableDataTranslate = async () => {
  state.tableDataTranslate.loading = true;

  await messtranslateApi().searchMessTranslateDetail(
      {
        uid: 1,
        pid: state.targetid,
        transid: state.id,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'body'
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {
          walkTreeJSONParse(res.data);

          state.tableDataTranslate.data = res.data;
          let id = 0;
          for (let i of state.tableDataTranslate.data) {
            i.parentindex = id + 1;
            id = id + 1;
          }
          initConn();
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });


  setTimeout(() => {
    state.tableDataTranslate.loading = false;
  }, 200);
};
//获取当前页面的缩放值


//放大缩小处理
const setClientWidth = () => {
  console.log("重画画布");

  //const scale=getPageZoomRatio();

  //document.getElementById("workflow-right").css({"transform": `scale(${scale})`})
  //document.getElementById("workflow-right").style.transform = "scale(0.75)";
  //state.jsPlumb.setZoom(0.75);

  setTimeout(() => {
    repaintWithScroll()
  }, 50);


};

const repaintWithScroll = () => {
  state.jsPlumb.repaintEverything();
  fix_jsPlumb_offset(state.scrollTop);
}
const repaintWithScroll2 = () => {

  fix_jsPlumb_offset(state.scrollTop);
}

function handleDrag(event) {
  // 处理drag事件
  console.log('Drag event:', event);
}

function handleDragStart(event) {
  // 处理dragstart事件
  console.log('Drag start event:', event);
}

function handleDragEnd(event) {
  // 处理dragend事件
  console.log('Drag end event:', event);
}

const fixDragScroll = () => {
  setTimeout(() => {
    state.jsPlumb.repaintEverything();
    var dragpoints = document.querySelectorAll(".endpointDrag");
    console.log(dragpoints);
    _fix_left(dragpoints, state.scrollTop);
  }, 200);

}
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
    // state.jsPlumb.setSuspendDrawing(false, true);
    repaintWithScroll();
    // 初始化节点、线的链接
    console.log("初始化节点1");
    initJsPlumbConnection();
    // 点击线弹出右键菜单
    state.jsPlumb.bind('contextmenu', (conn: any, originalEvent: MouseEvent) => {
      originalEvent.preventDefault();
      const {sourceId, targetId} = conn;
      const {clientX, clientY} = originalEvent;
      state.dropdownLine.x = clientX;
      state.dropdownLine.y = clientY;
      //const v: any = state.jsplumbData.nodeList.find((v) => v.nodeId === targetId);
      //const line: any = state.jsplumbData.lineList.find((v) => v.sourceId === sourceId && v.targetId === targetId);
      //v.type = 'line';
      //v.label = line.label;
      const v = {type: 'line'};
      contextmenuLineRef.value.openContextmenu(v, conn);
    });
    state.jsPlumb.bind("beforeDrag", (params) => {
      console.log(params);

      //  state.intervalId = setInterval(repaintWithScroll2, 500);
      //       setTimeout(() => {
      //   repaintWithScroll2();
      // }, 50);
      //  fixDragScroll();
      return true;
    });

    // 连线之前
    state.jsPlumb.bind('beforeDrop', (conn: any) => {

      // clearInterval(state.intervalId);
      const {sourceId, targetId} = conn;
      console.log(conn);
      let existingConnections = state.jsPlumb.getConnections({
        source: sourceId,
        target: targetId
      });
      repaintWithScroll();
      if (existingConnections.length > 0) {
        ElMessage.warning('该源字段已存在，不可重复添加');
        return false;
      } else {
        return true;
      }
    });
    // 连线时
    state.jsPlumb.bind('connection', (conn: any) => {
      console.log(conn);
      const {sourceId, targetId} = conn;


      if (state.walkStatus) {

      } else {
        updateNodeByConn(sourceId, targetId, 'add');
      }
    });
    // endpointClick 端点单击事件
    state.jsPlumb.bind('endpointClick', (endpoint, originalEvent: MouseEvent) => {
      console.log(endpoint);
      repaintWithScroll()
    });
    // 删除连线时回调函数
    state.jsPlumb.bind('connectionDetached', (conn: any) => {
      const {sourceId, targetId} = conn;
      state.jsplumbData.lineList = state.jsplumbData.lineList.filter((line) => {
        if (line.sourceId == sourceId && line.targetId == targetId) {
          return false;
        }
        return true;
      });
    });

  });


  //滚动条重绘
  //  var container = document.getElementById("workflow-right");
  //  container.addEventListener("scroll", function (e) {

  //});

  //放大缩小处理
  //state.jsPlumb.setZoom(0.75)
  //设置画布放大缩小级别

};
const clearJsplumb = () => {
  state.jsPlumb.deleteEveryConnection();
  state.jsPlumb.deleteEveryEndpoint();
  /**
   var lists=walkTreeToList(state.tableDataSource.data);
   var listt= walkTreeToList(state.tableDataTarget.data);
   for(var i of lists){
               state.jsPlumb.remove('source_'+i.ID);
           }
   for(var i of listt){
               state.jsPlumb.remove('target_'+i.ID);
           }
   **/
}
const scrollPaint = (e) => {


  state.scrollTop = e.target.scrollTop;
  //
  //clearJsplumb();

  // initJsPlumbConnection()

  nextTick(() => {
    // console.log("滚动触发");

    // 获取滑动距离，修改锚点、连线位置
    repaintWithScroll();

  })

}

function fix_jsPlumb_offset(top) {
  //console.log('scroll dis:' + top);
  var lines = document.getElementsByClassName("jtk-connector");
  var dots = document.getElementsByClassName("jtk-endpoint");
  var overlay = document.getElementsByClassName("jtk-overlay");
  var drops = document.getElementsByClassName("jtk-endpoint-anchor");

  _fix_left(lines, top);
  _fix_left(dots, top);
  _fix_left(overlay, top);
  // _fix_left(drops, top);
}

function _fix_left(arr, top) {
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];

    var origin_top = obj.style.top.replace(/px/, "");
    obj.style.top = (parseInt(origin_top) + parseInt(top)) + 'px';
    //
    //console.log(obj.style.top);
  }
}

// 初始化节点、线的链接
const initJsPlumbConnection = () => {


  console.log("初始化转化目的节点");
  const SourceElList = document.querySelectorAll('.SourceRow')
  const TargetElList = document.querySelectorAll('.TargetRow')
  state.jsPlumb.batch(() => {

    for (let i = 0; i < SourceElList.length; i++) {
      initLeaf(SourceElList[i], 'Source')
    }
    for (let i = 0; i < TargetElList.length; i++) {
      initLeaf(TargetElList[i], 'Target')
    }
  });
  // 现在我们可以获取所有的Endpoints
  console.log("初始化转化目的连接");
  initConn();

};

//新增连线更新转换节点信息
const updateNodeByConn = (sourceId, targetId, type) => {
  let tid = targetId.split('_')[1];
  let sid = sourceId.split('_')[1];
  let trow;
  let sname;
  console.log('conn change')
  if (type == 'add') {
    trow = findTreeItemById(state.tableDataTranslate.data, tid);
    sname = findTreeItemById(state.tableDataSource.data, sid).Name;
    console.log(trow['SourceData']);
    //trow.SourceData = JSON.parse(trow.SourceData)
    if (trow.SourceData == null) {
      trow.SourceData = [];
    }
    if (Array.isArray(trow.SourceData)) {

    } else {
      trow.SourceData = []
    }

    trow.SourceData.push([sname]);
    updateNodeDB(trow);
    onOpenEdit(trow);
  }
  if (type == 'del') {
    trow = findTreeItemById(state.tableDataTranslate.data, tid);
    sname = findTreeItemById(state.tableDataSource.data, sid).Name;
    for (let k of trow.SourceData) {
      const index = k.indexOf(sname);
      if (index != -1) {
        const i2 = trow.SourceData.indexOf(k);
        trow.SourceData.splice(i2, 1);
        break;
      }
    }


    updateNodeDB(trow);
  }
}
const updateNodeDB = (row) => {
  row['SourceData'] = JSON.stringify(row.SourceData);
  row['Funcrule'] = JSON.stringify(row.Funcrule);
  if (row['Optional'] == null) {
    row['Optional'] = '直接转换';
  }
  messtranslateApi().updateMessTranslateDetail(
      row
  )
      .then(res => {
        //console.log(res);
        if (res.code == '200') {
          row['SourceData'] = JSON.parse(row.SourceData);
          row['Funcrule'] = JSON.parse(row.Funcrule);
          initConn();
        } else {
          row['SourceData'] = JSON.parse(row.SourceData);
          row['Funcrule'] = JSON.parse(row.Funcrule);
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
// 初始化具体节点
const initLeaf = (row, type) => {
  const ins = state.jsPlumb;
  const elem = row

  if (type == 'Source') {
    //console.log(elem.classList[2]);
    let node = findSourceData(elem.classList[2]);
    if (node.OutType == 'nest') {
      return
    }
    ins.setId(elem, "source_" + elem.classList[2]);
    ins.makeSource(elem, state.jsplumbMakeSource)

    ins.setSourceEnabled(elem, true)
    /**
     const endpointsource = ins.addEndpoint(elem, {endpoint: 'Dot', anchor: 'Right',maxConnections: -1,}, state.jsplumbEndpoint);

     endpointsource.bind("mouseover", function (endpoint) {
                console.log("you mouse on ", endpoint);
                repaintWithScroll();
            });
     endpointsource.bind("mouseout", function (endpoint) {
                console.log("you mouse on ", endpoint);
                repaintWithScroll();
            });
     **/
  } else {
    let node = findTargetData(elem.classList[2]);
    if (node.OutType == 'nest') {
      return
    }
    ins.setId(elem, "target_" + elem.classList[2]);
    ins.makeTarget(elem, state.jsplumbMakeTarget, jsplumbConnect)
    ins.setTargetEnabled(elem, true)
  }


}
//根据转换规则连接元和目的
const initConn = () => {
  const list = state.tableDataTranslate.data;
  state.jsPlumb.deleteEveryConnection();
  walkTree(list);
  /*
        state.jsPlumb.connect(
            {
              source: SourceElList[0],
              target: TargetElList[1],
              label: 'test',
            },
            state.jsplumbConnect
        );*/
  //state.jsPlumb.setSuspendDrawing(false, true);
  repaintWithScroll();
}

//遍历树形结构
function walkTree(tree) {
  let node, list = [...tree], nodes = []
  state.walkStatus = true;
  while (node = list.shift()) {
    if (node.Optional == '直接转换' || node.Optional == '系统函数' || node.Optional == '自定义转换计算') {
      //console.log(node);
      if (node.SourceData instanceof Array) {


        for (let i of node.SourceData) {
          let t = findTreeItemByName(state.tableDataSource.data, i)
          //console.log(t);
          if (t == null) {
            continue;
          }

          if (t.OutType == 'nest') {
            continue
          }

          if (node.OutType == 'nest') {
            continue
          }
          let sourceid = "source_" + t.ID;
          let targetid = "target_" + node.ID
          let label = node.TName;
          var connection = state.jsPlumb.connect(
              {
                source: sourceid,
                target: targetid,
                label: label,
              },
              state.jsplumbConnect
          );
          connection.bind("mouseover", function (conn) {
            repaintWithScroll()
            // console.log("you clicked on ", conn);
          });
          connection.bind("mouseout", function (conn) {
            repaintWithScroll()
            // console.log("you clicked on ", conn);
          });
        }
      } else {

      }
    } else {


    }
    nodes.push(node)
    node.children && list.unshift(...node.children)
  }
  state.walkStatus = false;
  return nodes
}

//树形结构返回list
function walkTreeToList(tree) {
  let node, list = [...tree], nodes = []

  while (node = list.shift()) {

    nodes.push(node)
    node.children && list.unshift(...node.children)
  }

  return nodes
}

//树形结构查询指定id
function findTreeItemById(list, id) {
  // 每次进来使用find遍历一次
  let res = list.find((item) => item.ID == id);

  if (res) {
    return res;
  } else {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children instanceof Array && list[i].children.length > 0) {
        res = findTreeItemById(list[i].children, id);

        if (res) return res;
      }
    }

    return null;
  }
};

//树形结构查询指定Name
function findTreeItemByName(list, name) {
  // 每次进来使用find遍历一次
  let res = list.find((item) => item.Name == name);

  if (res) {
    return res;
  } else {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children instanceof Array && list[i].children.length > 0) {
        res = findTreeItemByName(list[i].children, name);

        if (res) return res;
      }
    }

    return null;
  }
};

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
  const {endpoints} = conn;
  const intercourse: any = [];
  endpoints.forEach((v: any) => {
    intercourse.push({
      id: v.element.id,
      innerText: v.element.innerText,
    });
  });
  item.contact = `${intercourse[0].innerText}(${intercourse[0].id}) => ${intercourse[1].innerText}(${intercourse[1].id})`;
  if (contextMenuClickId === 0) {

    ElMessageBox.confirm(
        '您是否确认删除该转换',
        'Warning',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
        .then(() => {
          state.jsPlumb.deleteConnection(conn);
          const {sourceId, targetId} = conn;
          updateNodeByConn(sourceId, targetId, 'del');
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '删除 取消',
          })
        })


  } else if (contextMenuClickId === 1) {
    const {sourceId, targetId} = conn;
    let tid = targetId.split('_')[1];
    let sid = sourceId.split('_')[1];
    let trow = findTreeItemById(state.tableDataTranslate.data, tid);
    onOpenEdit(trow);
    //userDialogRef.value.openDialog('edit', state.sourceid, trow);
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
    //state.jsPlumb.setSuspendDrawing(false, true);
    repaintWithScroll();
  });
};

// 顶部工具栏-当前项点击
const onToolClick = (fnName: String) => {

  switch (fnName) {

    case 'closeWin':
      router.go(-1);
      break;
  }
};

// 页面加载时
onMounted(async () => {
  state.id = querys.id;

  state.sourceid = querys.sourceid;
  state.targetid = querys.targetid;
  state.sourceName = querys.sourceName;
  state.targetName = querys.targetName;
  await getTableDataSource();
  await getTableDataTranslate();
  await initLeftNavList();
  await getTableDataTarget();
  initSortable();
  initJsPlumb();
  //setClientWidth();

// 监听drag相关事件
  window.addEventListener('drag', handleDrag);
  window.addEventListener('dragstart', handleDragStart);
  window.addEventListener('dragend', handleDragEnd);
  window.addEventListener('resize', setClientWidth);
});
// 页面卸载时
onUnmounted(() => {
  window.removeEventListener('resize', setClientWidth);
  // 移除事件监听器
  window.removeEventListener('drag', handleDrag);
  window.removeEventListener('dragstart', handleDragStart);
  window.removeEventListener('dragend', handleDragEnd);
});
</script>

<style scoped lang="scss">
.workflow-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;


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


      .workflow-right {
        flex: 1;
        //position: absolute;


        position: relative;
        //transform: scale(0.75);
        //justify-content: space-between;
        overflow: scroll;
        height: 100%;
        background-image: linear-gradient(90deg, rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%),
        linear-gradient(rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%);
        background-size: 10px 10px;

        :deep(.eltableclass) {
          vertical-align: top;
          display: inline-block;


          margin-left: 50px;
          margin-top: 25px;


          width: 16%;
          border: 1px solid black;
          border-color: black
        }

        .workflow-right-clone {
          position: absolute;

          .workflow-right-box {
            height: 35px;
            align-items: center;
            color: var(--el-text-color-secondary);
            padding: 0 10px;
            border-radius: 3px;
            cursor: move;
            transition: all 0.3s ease;
            min-width: 94.5px;
            background: var(--el-color-white);
            border: 1px solid var(--el-border-color-light, #ebeef5);

            .workflow-left-item-icon {
              display: flex;
              align-items: center;
              height: 35px;
            }

            &:hover {
              border: 1px dashed var(--el-color-primary);
              background: var(--el-color-primary-light-9);
              transition: all 0.3s ease;
              color: var(--el-color-primary);

              i {
                cursor: Crosshair;
              }
            }
          }

          .workflow-right-active {
            border: 1px dashed var(--el-color-primary);
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          }
        }

        :deep(.jtk-overlay):not(.aLabel) {
          padding: 4px 10px;
          border: 1px solid var(--el-border-color-light, #ebeef5) !important;
          color: var(--el-text-color-secondary) !important;
          background: var(--el-color-white) !important;
          border-radius: 3px;
          font-size: 10px;
        }

        :deep(.jtk-overlay.workflow-right-empty-label) {
          display: none;
        }
      }

      .workflow-right2 {


        overflow: scroll;
        width: 200px;
        border-left: 1px solid;
        background-size: 10px 10px;

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
