<template>
    <div class="workflow-container layout-padding">
        <div class="workflow-mask" v-if="state.isShow"></div>
        <div class="layout-padding-auto layout-padding-view workflow-warp">
            <div class="workflow">
                <!-- 顶部工具栏 -->
                <Tool @tool="onToolClick"/>

                <!-- 左侧导航区 -->
                <div class="workflow-content">
                    <div class="workflow-left" v-show="false">
                        <el-scrollbar>
                            <div
                                    ref="leftNavRefs"
                                    v-for="val in state.leftNavList"
                                    :key="val.id"
                                    :style="{ height: val.isOpen ? 'auto' : '50px', overflow: 'hidden' }"
                                    class="workflow-left-id"
                            >
                                <div class="workflow-left-title" @click="onTitleClick(val)">
                                    <span>{{ val.title }}</span>
                                    <SvgIcon :name="val.isOpen ? 'ele-ArrowDown' : 'ele-ArrowRight'"/>
                                </div>
                                <div class="workflow-left-item" v-for="(v, k) in val.children" :key="k"
                                     :data-name="v.name" :data-icon="v.icon" :data-id="v.id">
                                    <div class="workflow-left-item-icon">
                                        <SvgIcon :name="v.icon" class="workflow-icon-drag"/>
                                        <div class="font10 pl5 name">{{ v.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>

                    <!-- 右侧绘画区 -->
                    <div class="workflow-right" ref="workflowRightRef">
                        <el-table :data="state.tableDataSource.data" row-key="ID"
                                  ref="SourceTable"
                                  v-loading="state.tableDataSource.loading"
                                  :row-class-name="({row}) => `SourceRow ${row.ID}`"
                                  @expand-change="(row, expanded) => !expanded && SourceTable?.toggleRowExpansion(row)"
                                  default-expand-all class="eltableclass">
                            <el-table-column type="selection" width="30" v-if="false"/>
                            <el-table-column prop="ID" label="ID" width="60" />
                            <el-table-column prop="parentindex" label="" width="60" v-if="false"/>
                            <el-table-column prop="OutType" label="类型" v-if="false"></el-table-column>
                            <el-table-column prop="DFIID" label="DFIID" v-if="false"></el-table-column>
                            <el-table-column prop="Name" label="源消息体" width="200"
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
                        <el-table :data="state.tableDataTarget.data" row-key="ID"
                                  v-loading="state.tableDataTarget.loading"
                                  ref="TargetTable"
                                  style="margin-left: 400px;"
                                  :row-class-name="({row}) => `TargetRow ${row.ID}`"
                                  @expand-change="(row, expanded) => !expanded && TargetTable?.toggleRowExpansion(row)"
                                  default-expand-all class="eltableclass">
                            <el-table-column type="selection" width="30" v-if="false"/>
                            <el-table-column prop="ID" label="ID" width="60" />
                            <el-table-column prop="parentindex" label="" width="60" v-if="false"/>
                            <el-table-column prop="OutType" label="类型" v-if="false"></el-table-column>
                            <el-table-column prop="DFIID" label="DFIID" v-if="false"></el-table-column>
                            <el-table-column prop="Name" label="目的消息体" width="200"
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
                    <div ref="workflow-right2">
                        <Drawer ref="drawerRef" @label="setLineLabel" @node="setNodeContent" @save="saveFlow"/>
                        <el-collapse v-model="activeNames" class="centered-collapse">
                            <el-collapse-item title="流程设计属性" name="1" style="font-size:14px">
                                <template #title>
                                    流程设计属性
                                    <el-icon class="header-icon">
                                        <ele-InfoFilled/>
                                    </el-icon>
                                </template>
                                <el-card style="font-size:14px">
                                    <p class="text item">{{ '源IP/端口： '}}</p>
                                    <p class="text item">{{ '消息封装格式： '}}</p>
                                    <p class="text item">{{ '源消息类型： '}}</p>
                                    <p class="text item">{{ '目的消息类型： '}}</p>
                                    <p class="text item">{{ '消息转化规则： '}}</p>
                                    <p class="text item">{{ '转换后封装格式： '}}</p>
                                    <p class="text item">{{ '目的IP/端口： '}}</p>
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


        <!-- 顶部工具栏-帮助弹窗 -->
        <Help ref="helpRef"/>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflow">
    import {defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {jsPlumb} from 'jsplumb';
    import Sortable from 'sortablejs';
    import {storeToRefs} from 'pinia';
    import {useThemeConfig} from '/@/stores/themeConfig';
    import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
    import commonFunction from '/@/utils/commonFunction';
    import {leftNavList} from './js/mock';
    import {jsplumbConnect, jsplumbDefaults, jsplumbMakeSource, jsplumbMakeTarget} from './js/config';
    import {useRoute, useRouter} from "vue-router";
    import {messdetailApi} from "/@/api/sysmanage/messdetail";

    const isHide = ref(false);
    const activeNames = ref(['1'])
    // 引入组件
    const Tool = defineAsyncComponent(() => import('./component/tool/index.vue'));
    const Contextmenu = defineAsyncComponent(() => import('./component/contextmenu/index.vue'));
    const Drawer = defineAsyncComponent(() => import('./component/drawer/index.vue'));
    const Help = defineAsyncComponent(() => import('./component/tool/help.vue'));

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
    const state = reactive({

        id: '',
        sourceid: '',
        targetid: '',
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
    // 初始化源消息体表格数据
    const getTableDataSource = async()  => {
        state.tableDataSource.loading = true;

        await  messdetailApi().searchMessDetail(
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
    // 初始化目的消息体表格数据
    const getTableDataTarget = async () => {
        state.tableDataTarget.loading = true;

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


        setTimeout(() => {
            state.tableDataTarget.loading = false;
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
        leftNavRefs.value.forEach((v) => {
            Sortable.create(v as HTMLDivElement, {
                group: {
                    name: 'vue-next-admin-1',
                    pull: 'clone',
                    put: false,
                },
                animation: 0,
                sort: false,
                draggable: '.workflow-left-item',
                forceFallback: true,
                onEnd: function (evt: any) {
                    const {name, icon, id} = evt.clone.dataset;
                    const {layerX, layerY, clientX, clientY} = evt.originalEvent;
                    const el = workflowRightRef.value!;
                    const {x, y, width, height} = el.getBoundingClientRect();
                    if (clientX < x || clientX > width + x || clientY < y || y > y + height) {
                        ElMessage.warning('请把节点拖入到画布中');
                    } else {
                        // 节点id（唯一）
                        const nodeId = Math.random().toString(36).substr(2, 12);
                        // 处理节点数据
                        const node = {
                            nodeId,
                            left: `${layerX - 40}px`,
                            top: `${layerY - 15}px`,
                            class: 'workflow-right-clone',
                            name,
                            icon,
                            id,
                        };
                        // 右侧视图内容数组
                        state.jsplumbData.nodeList.push(node);
                        // 元素加载完毕时
                        nextTick(() => {
                            // 整个节点作为source或者target
                            state.jsPlumb.makeSource(nodeId, state.jsplumbMakeSource);
                            // // 整个节点作为source或者target
                            state.jsPlumb.makeTarget(nodeId, state.jsplumbMakeTarget, jsplumbConnect);
                            // 设置节点可以拖拽（此处为id值，非class）
                            state.jsPlumb.draggable(nodeId, {
                                containment: 'parent',
                                stop: (el: any) => {
                                    state.jsplumbData.nodeList.forEach((v) => {
                                        if (v.nodeId === el.el.id) {
                                            // 节点x, y重新赋值，防止再次从左侧导航中拖拽节点时，x, y恢复默认
                                            v.left = `${el.pos[0]}px`;
                                            v.top = `${el.pos[1]}px`;
                                        }
                                    });
                                },
                            });
                        });
                    }
                },
            });
        });
    };
    // 初始化 jsPlumb
    const initJsPlumb = () => {
        (<any>jsPlumb).ready(() => {
            state.jsPlumb = (<any>jsPlumb).getInstance({
                detachable: false,
                Container: 'workflow-right',
            });
            state.jsPlumb.fire('jsPlumbDemoLoaded', state.jsPlumb);
            // 导入默认配置
            state.jsPlumb.importDefaults(state.jsplumbDefaults);
            // 会使整个jsPlumb立即重绘。
            state.jsPlumb.setSuspendDrawing(false, true);
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
                const v: any = state.jsplumbData.nodeList.find((v) => v.nodeId === targetId);
                const line: any = state.jsplumbData.lineList.find((v) => v.sourceId === sourceId && v.targetId === targetId);
                v.type = 'line';
                v.label = line.label;
                contextmenuLineRef.value.openContextmenu(v, conn);
            });
            // 连线之前
            state.jsPlumb.bind('beforeDrop', (conn: any) => {
                const {sourceId, targetId} = conn;
                const item = state.jsplumbData.lineList.find((v) => v.sourceId === sourceId && v.targetId === targetId);
                if (item) {
                    ElMessage.warning('关系已存在，不可重复连接');
                    return false;
                } else {
                    return true;
                }
            });
            // 连线时
            state.jsPlumb.bind('connection', (conn: any) => {
                console.log('连线');
                const {sourceId, targetId} = conn;
                state.jsplumbData.lineList.push({
                    sourceId,
                    targetId,
                    label: '',
                });
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
    };
    // 初始化节点、线的链接
    const initJsPlumbConnection = () => {
        // 节点
        state.jsplumbData.nodeList.forEach((v) => {
            // 整个节点作为source或者target
            state.jsPlumb.makeSource(v.nodeId, state.jsplumbMakeSource);
            // 整个节点作为source或者target
            state.jsPlumb.makeTarget(v.nodeId, state.jsplumbMakeTarget, jsplumbConnect);
            // 设置节点可以拖拽（此处为id值，非class）
            state.jsPlumb.draggable(v.nodeId, {
                containment: 'parent',
                stop: (el: any) => {
                    state.jsplumbData.nodeList.forEach((v) => {
                        if (v.nodeId === el.el.id) {
                            // 节点x, y重新赋值，防止再次从左侧导航中拖拽节点时，x, y恢复默认
                            v.left = `${el.pos[0]}px`;
                            v.top = `${el.pos[1]}px`;
                        }
                    });
                },
            });
        });
        // 线
        state.jsplumbData.lineList.forEach((v) => {
            state.jsPlumb.connect(
                {
                    source: v.sourceId,
                    target: v.targetId,
                    label: v.label,
                },
                state.jsplumbConnect
            );
        });
        console.log("初始化节点2");
        const SourceElList = document.querySelectorAll('.SourceRow')
        const TargetElList = document.querySelectorAll('.TargetRow')
        state.jsPlumb.batch(() => {

            for (let i = 0; i < SourceElList.length; i++) {
                initLeaf(SourceElList[i], 'Source')
            }
            for (let i = 0; i < TargetElList.length; i++) {
                initLeaf(TargetElList[i], 'Target')
            }
        })
    };
    // 初始化具体节点
    const initLeaf = (row, type) => {
        const ins = state.jsPlumb;
        const elem = row

        if (type == 'Source') {
            ins.makeSource(elem, state.jsplumbMakeSource)
            ins.setSourceEnabled(elem, true)

        } else {
            ins.makeTarget(elem, state.jsplumbMakeTarget,jsplumbConnect)
            ins.setTargetEnabled(elem, true)
        }


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
        const {endpoints} = conn;
        const intercourse: any = [];
        endpoints.forEach((v: any) => {
            intercourse.push({
                id: v.element.id,
                innerText: v.element.innerText,
            });
        });
        item.contact = `${intercourse[0].innerText}(${intercourse[0].id}) => ${intercourse[1].innerText}(${intercourse[1].id})`;
        if (contextMenuClickId === 0) state.jsPlumb.deleteConnection(conn);
        else if (contextMenuClickId === 1) drawerRef.value.open(item, conn);
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
        state.id = querys.id;

        state.sourceid = querys.sourceid;
        state.targetid = querys.targetid;
        await getTableDataSource();
        await getTableDataTarget();
        await initLeftNavList();
        initSortable();
        initJsPlumb();
        setClientWidth();


        window.addEventListener('resize', setClientWidth);
    });
    // 页面卸载时
    onUnmounted(() => {
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
                    position: relative;
                    justify-content: space-between;
                    overflow: auto;
                    height: 100%;
                    background-image: linear-gradient(90deg, rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%),
                    linear-gradient(rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%);
                    background-size: 10px 10px;

                    :deep(.eltableclass) {
                        vertical-align: top;
                        display: inline-block;
                        overflow: auto;

                        margin-left: 50px;
                        margin-top: 25px;


                        width: 22%;
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
