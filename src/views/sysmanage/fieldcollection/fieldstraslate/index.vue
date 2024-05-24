<template>
    <div class="workflow-container layout-padding">
        <div class="workflow-mask" v-if="state.isShow"></div>
        <div class="layout-padding-auto layout-padding-view workflow-warp">
            <div class="workflow">
                <!-- 顶部工具栏 -->
                <Tool/>

                <!-- 左侧导航区 -->
                <div class="workflow-content">
                    <div class="workflow-left" v-show="false">

                    </div>

                    <!-- 右侧绘画区 -->
                    <div id="workflow-right" class="workflow-right" ref="workflowRightRef">
                        <div
                                v-for="v in state.pointlist.data"
                                :key="v.ID"
                                :id="v.ID"
                                :data-node-id="v.ID"
                                class="workflow-right-clone"
                                :style="{ left: v.left, top: v.top }"
                                @click="onItemClick(v)"
                        >
                            <div class="workflow-right-box">
                                <div class="workflow-left-item-icon">

                                    <div class="font10 pl5 name">{{ `${v.DFINO}-${v.DUINO}：${v.Name}`}}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div ref="workflow-right2">
                        <el-collapse v-model="activeNames" class="centered-collapse">
                            <el-collapse-item title="流程设计属性" name="1" style="font-size:14px">
                                <template #title>
                                    转换源数据域属性
                                    <el-icon class="header-icon">
                                        <ele-InfoFilled/>
                                    </el-icon>
                                </template>
                                <el-card style="font-size:14px">
                                    <p class="text item">{{ 'DFI标识号：' +state.sourceData.DFINO}}</p>
                                    <p class="text item">{{ 'DFI版本号：' +state.sourceData.DFIVersion}}</p>
                                    <p class="text item">{{ 'DUI标识号：' +state.sourceData.DUINO}}</p>
                                    <p class="text item">{{ 'DUI版本号：' +state.sourceData.DUIVersion}}</p>
                                    <p class="text item">{{ '名称： '+state.sourceData.Name }}</p>
                                    <p class="text item">{{ '类型： '+state.sourceData.Type }}</p>
                                    <p class="text item">{{ '简称： '+state.sourceData.ShortName }}</p>
                                    <p class="text item">{{ '位数: ' +state.sourceData.Length}}</p>
                                </el-card>
                            </el-collapse-item>
                        </el-collapse>
                        <el-collapse v-model="activeNames" class="centered-collapse">
                            <el-collapse-item title="流程设计属性" name="1" style="font-size:14px">
                                <template #title>
                                    转换目的数据域属性
                                    <el-icon class="header-icon">
                                        <ele-InfoFilled/>
                                    </el-icon>
                                </template>
                                <el-card style="font-size:14px">
                                    <p class="text item">{{ 'DFI标识号：' +state.targetData.DFINO}}</p>
                                    <p class="text item">{{ 'DFI版本号：' +state.targetData.DFIVersion}}</p>
                                    <p class="text item">{{ 'DUI标识号：' +state.targetData.DUINO}}</p>
                                    <p class="text item">{{ 'DUI版本号：' +state.targetData.DUIVersion}}</p>

                                    <p class="text item">{{ '名称： '+state.targetData.Name }}</p>
                                    <p class="text item">{{ '类型： '+state.targetData.Type }}</p>
                                    <p class="text item">{{ '简称： '+state.targetData.ShortName }}</p>
                                    <p class="text item">{{ '位数: ' +state.targetData.Length}}</p>
                                </el-card>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </div>


        <!-- 顶部工具栏-帮助弹窗 -->
        <Help ref="helpRef"/>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflow">
    import {defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref} from 'vue';
    import {ElMessage} from 'element-plus';
    import {jsPlumb} from 'jsplumb';
    import Sortable from 'sortablejs';
    import {storeToRefs} from 'pinia';
    import {useThemeConfig} from '/@/stores/themeConfig';
    import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
    import commonFunction from '/@/utils/commonFunction';
    import {leftNavList} from './js/mock';
    import {jsplumbConnect, jsplumbDefaults, jsplumbMakeSource, jsplumbMakeTarget} from './js/config';
    import {useRoute, useRouter} from "vue-router";
    import {fieldsdetailApi} from "/@/api/sysmanage/fieldsdetail";

    const isHide = ref(false);
    const activeNames = ref(['1'])
    // 引入组件
    const Tool = defineAsyncComponent(() => import('./component/tool/index.vue'));
    const Contextmenu = defineAsyncComponent(() => import('./component/contextmenu/index.vue'));
    const Drawer = defineAsyncComponent(() => import('./component/drawer/index.vue'));
    const Help = defineAsyncComponent(() => import('./component/tool/help.vue'));
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
        loading: false,
        id: '',
        sourceid: '',
        targetid: '',
        walkStatus: false,
        connectlist: {
            data: []
        },
        pointlist: {
            data: []
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
        jsplumbData: {
            nodeList: [],
            lineList: [],
        },
    });
    // 初始化元素管理数据
    const getTableData = async () => {
        state.loading = true;

        await fieldsdetailApi().searchAllDUITrans(
            {})
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    state.connectlist.data = res.data['connect'];
                    state.pointlist.data = res.data['point'];
                    let x = 30, y = 30;
                    for (let i of state.pointlist.data) {
                        i['left'] = x + 'px';
                        i['top'] = y + 'px';
                        x = x + 300;
                        if (x > 800) {
                            y = y + 50;
                        }
                    }


                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

            }).finally(() => {

            });


        setTimeout(() => {
            state.loading = false;
        }, 100);
    };


    function walkTreeToList(tree) {
        let node, list = [...tree], nodes = []

        while (node = list.shift()) {
            nodes.push(node)
            node.children && list.unshift(...node.children)
        }

        return nodes
    }

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


    //获取当前页面的缩放值


    //放大缩小处理
    const setClientWidth = () => {
        console.log("重画画布");

        //const scale=getPageZoomRatio();

        //document.getElementById("workflow-right").css({"transform": `scale(${scale})`})
        //document.getElementById("workflow-right").style.transform = "scale(0.75)";
        //state.jsPlumb.setZoom(0.75);

        setTimeout(() => {
            state.jsPlumb.repaintEverything();
        }, 50);


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
                //const v: any = state.jsplumbData.nodeList.find((v) => v.nodeId === targetId);
                //const line: any = state.jsplumbData.lineList.find((v) => v.sourceId === sourceId && v.targetId === targetId);
                //v.type = 'line';
                //v.label = line.label;
                const v = {type: 'line'};
                contextmenuLineRef.value.openContextmenu(v, conn);
            });
            // 连线之前
            state.jsPlumb.bind('beforeDrop', (conn: any) => {

                const {sourceId, targetId} = conn;
                console.log(conn);
                let existingConnections = state.jsPlumb.getConnections({
                    source: sourceId,
                    target: targetId
                });

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
            // 删除连线时回调函数
            state.jsPlumb.bind('connectionDetached', (conn: any) => {
                const {sourceId, targetId} = conn;

            });
                        // 单击连事件
            state.jsPlumb.bind('click', (conn: any,originalevent) => {
                const {sourceId, targetId} = conn;
                console.log("点击线",conn)
                connclick(sourceId, targetId);
            });
        });

        //滚动条重绘
        var container = document.getElementById("workflow-right");
        container.addEventListener("scroll", function () {
            state.jsPlumb.repaintEverything();
        });
        //放大缩小处理
        //state.jsPlumb.setZoom(0.75)
        //设置画布放大缩小级别

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
        console.log("初始化转化目的节点");
        for (let i of state.pointlist.data) {

            const point = document.getElementById(i.ID);


            initLeaf(point);
        }

        initConn();
        state.jsPlumb.repaintEverything();
    };


    // 初始化具体节点
    const initLeaf = (row) => {
        const ins = state.jsPlumb;
        const elem = row


        ins.makeSource(elem, state.jsplumbMakeSource)
        ins.setSourceEnabled(elem, true)

        ins.makeTarget(elem, state.jsplumbMakeTarget, state.jsplumbConnect)
        ins.setTargetEnabled(elem, true)


    }
    //根据转换规则连接元和目的
    const initConn = () => {
        const list = state.connectlist.data;
        state.jsPlumb.deleteEveryConnection();
        for (let i of list) {

            state.jsPlumb.connect(
                {
                    source: i.sourceFieldID,
                    target: i.targetFieldID,
                    label: i.TName
                });
        }


    }


    // 点击元素
    const onItemClick = (val) => {
        console.log(val);
        state.sourceData = val;
    }
    const connclick = (sid,tid) => {
        for(let i of state.pointlist.data){
            if(i.ID==sid){
                  state.sourceData = i;
            }
             if(i.ID==tid){
                  state.targetData = i;
            }
        }

    }

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


    // 页面加载时
    onMounted(async () => {


        await getTableData();

        await initLeftNavList();

        initSortable();
        initJsPlumb();
        //setClientWidth();


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
                    //transform: scale(0.75);
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
