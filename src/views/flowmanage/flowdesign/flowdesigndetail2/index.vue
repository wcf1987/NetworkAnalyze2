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
                                     :data-name="v.name" :data-icon="v.icon" :data-id="v.id" @mousedown="dragNode(v)">
                                    <div class="workflow-left-item-icon">
                                        <SvgIcon :name="v.icon" class="workflow-icon-drag" left="0" size="16"/>
                                        <div class="font10 pl5 name">{{ v.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>

                    <!-- 右侧绘画区 -->
                    <div class="workflow-right" ref="workflowRightRef">
                        <div id="LF-view" ref="container" class="containerstyle"></div>
                    </div>
                </div>
            </div>
        </div>


        <!-- 抽屉表单、线 -->
        <Drawer ref="drawerRef" @label="setLineLabel" @node="setNodeContent"/>

        <!-- 顶部工具栏-帮助弹窗 -->
        <Help ref="helpRef"/>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflow">
    import '@logicflow/core/dist/style/index.css'
    import '@logicflow/extension/lib/style/index.css'
    import LogicFlow from '@logicflow/core'
    import {Menu, MiniMap, Snapshot} from "@logicflow/extension";


    import {defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {storeToRefs} from 'pinia';
    import {useThemeConfig} from '/@/stores/themeConfig';
    import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
    import commonFunction from '/@/utils/commonFunction';
    import {leftNavList} from './js/mock';
    import {jsplumbConnect, jsplumbDefaults, jsplumbMakeSource, jsplumbMakeTarget} from './js/config';
    // 定义变量内容
    import {
        CalcNode,
        CustomLine,
        EndNode,
        MessparseNode,
        MesstraslateNode,
        PacencapNode,
        PacparseNode,
        SpemarkNode,
        StartNode,
        StatisticsNode,
        SwichNode,
        TimemarkNode,
        TimerNode,
    } from './logicflowpanel/registerNode/index.js'

    // 引入组件

    const Tool = defineAsyncComponent(() => import('./component/tool/index.vue'));

    const Drawer = defineAsyncComponent(() => import('./component/drawer/index.vue'));
    const Help = defineAsyncComponent(() => import('./component/tool/help.vue'));

    const container = ref(null)
    const lf = ref(null)

    function dragNode(item) {
        lf.value.dnd.startDrag({
            type: item.type,
        })
    }

    // 页面加载时
    onMounted(async () => {
        await initLeftNavList();
        //initSortable();
        //initJsPlumb();
        //setClientWidth();
        initLf();
        //window.addEventListener('resize', setClientWidth);
    });

    function initLf() {
        // 画布配置
        console.log(container.value)
        lf.value = new LogicFlow({
            background: {
                //backgroundColor: '#f7f9ff',
            },
            grid: {
                size: 20,
                visible: true,
                type: 'dot'
            },
            keyboard: {
                enabled: true
            },
            edgeTextDraggable: true,
            hoverOutline: false,
            edgeType: "bezier",
            plugins: [
                Menu,
                MiniMap,
                Snapshot
            ],
            container: container.value,

        });
        lf.value.extension.menu.setMenuConfig({
            nodeMenu: [
                {
                    className: "lf-menu-delete",
                    text: "删除",
                    callback(node) {
                        lf.value.deleteNode(node.id);
                    },
                    icon: true,
                },
                {
                    className: "lf-menu-edit",
                    text: "编辑",
                    callback(node: any) {
                        drawerRef.value.open(node);
                    },
                    icon: true,
                }

            ], // 覆盖默认的节点右键菜单
            edgeMenu: [
                {
                    className: "lf-menu-delete",
                    text: "删除",
                    callback(edge) {
                        lf.value.deleteEdge(edge.id);
                    },
                    icon: true,
                },
            ], // 删除默认的边右键菜单
            graphMenu: [], // 覆盖默认的边右键菜单，与false表现一样
        });
        // 设置主题
        lf.value.setTheme({
            circle: {
                stroke: '#000000',
                strokeWidth: 1,
                outlineColor: '#88f',
            },
            rect: {
                outlineColor: '#88f',
                strokeWidth: 1
            },
            polygon: {
                strokeWidth: 1
            },
            polyline: {
                stroke: '#000000',
                hoverStroke: '#000000',
                selectedStroke: '#000000',
                outlineColor: '#88f',
                strokeWidth: 1
            },
            nodeText: {
                color: '#000000'
            },
            edgeText: {
                color: '#000000',
                background: {
                    fill: '#f7f9ff'
                }
            },
            anchor: {
                stroke: "#fcfcfc",
                fill: "#FFFFFF",
                r: 4,
                hover: {
                    fill: "#fdfdfd",
                    fillOpacity: 0.5,
                    stroke: "#fbfbfb",
                    r: 10,
                },
            },
        })

        registerNode()
    }

    // 自定义
    function registerNode() {


        //registerConnect(lf.value)
        lf.value.register(CustomLine)

        lf.value.register(StartNode);
        lf.value.register(EndNode);
        lf.value.register(SwichNode);
        lf.value.register(MesstraslateNode);
        lf.value.register(MessparseNode);

        lf.value.register(CalcNode);
        lf.value.register(PacparseNode);
        lf.value.register(PacencapNode);
        lf.value.register(SpemarkNode);
        lf.value.register(StatisticsNode);
        lf.value.register(TimerNode);
        lf.value.register(TimemarkNode);

        render()
    }

    function render() {
        lf.value.render()
        //lf.value.render()

        //LfEvent()
        //getFromDatabase()
    }


    const leftNavRefs = ref([]);
    const workflowRightRef = ref();
    const contextmenuNodeRef = ref();
    const contextmenuLineRef = ref();
    const drawerRef = ref();
    const helpRef = ref();
    const stores = useTagsViewRoutes();
    const storesThemeConfig = useThemeConfig();
    const {themeConfig} = storeToRefs(storesThemeConfig);
    const {copyText} = commonFunction();
    const state = reactive<WorkflowState>({
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

    // 设置 宽度小于 768，不支持操
    const setClientWidth = () => {
        const clientWidth = document.body.clientWidth;
        clientWidth < 768 ? (state.isShow = true) : (state.isShow = false);
    };
    // 左侧导航-数据初始化
    const initLeftNavList = () => {
        state.leftNavList = leftNavList;

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
        drawerRef.value.open(item);
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

                nextTick(() => {

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

    // 页面卸载时
    onUnmounted(() => {
        window.removeEventListener('resize', setClientWidth);
    });
</script>

<style scoped lang="scss">

    img {
        //   left: 0px !important;
    }


    .workflow-container {
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
                        user-select: none;

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
                    overflow: hidden;
                    height: 100%;
                    background-image: linear-gradient(90deg, rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%),
                    linear-gradient(rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%);
                    background-size: 10px 10px;

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

        .containerstyle {
            height: 900px;
            width: 100%;

        }

        .lf-menu-delete .lf-menu-item-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("./delete.png") no-repeat;
            background-size: 20px;
        }

        .lf-menu-edit {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("./edit.png") no-repeat;
            background-size: 20px;
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
