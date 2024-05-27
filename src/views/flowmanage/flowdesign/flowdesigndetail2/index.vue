<template>
    <div class="workflow-container layout-padding">
        <div class="workflow-mask" v-if="state.isShow"></div>
        <div class="layout-padding-auto layout-padding-view workflow-warp">
            <div class="workflow">
                <!-- 顶部工具栏 -->
                <Tool @tool="onToolClick" :dropdown="state.FlowName" :lasttime="state.LastModified" :type="state.type"/>

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
                                     :data-name="v.name" :data-icon="v.icon" :data-id="v.id"
                                     @mousedown="dragNode(v)">


                                    <div class="workflow-left-item-icon">
                                        <SvgIcon :name="v.icon" class="workflow-icon-drag" :left=0
                                                 :size=16></SvgIcon>
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
                    <!-- 抽屉表单、线 -->
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
        <el-upload

                class="upload-demo"
                action="/"

                :on-progress="uploadfile"
        >
            <el-button type="primary" ref="uploadbutton" v-show="false"></el-button>

        </el-upload>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflow">
    import {flowApi} from "/@/api/flowmanage/flow";
    import '@logicflow/core/dist/style/index.css'
    import '@logicflow/extension/lib/style/index.css'
    import LogicFlow from '@logicflow/core'
    import {Menu, MiniMap, Snapshot} from "@logicflow/extension";
    import conver from '/@/assets/svgicon/conver.svg';
    import inpac from '/@/assets/svgicon/inpac.svg';
    import {defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {storeToRefs} from 'pinia';
    import {useThemeConfig} from '/@/stores/themeConfig';
    import {useTagsViewRoutes} from '/@/stores/tagsViewRoutes';
    import commonFunction from '/@/utils/commonFunction';
    import {leftNavList} from './js/mock';
    import {leftNavListSimple} from './js/mocksimple';
    import {leftNavListSpecial} from './js/mockspecial';
    import {jsplumbConnect, jsplumbDefaults, jsplumbMakeSource, jsplumbMakeTarget} from './js/config';
    // 定义变量内容
    import {
        CalcNode,
        ConversionNode,
        CustomLine,
        DestNode,
        EndNode,
        InpacNode,
        MessbodyencapNode,
        MessbodyparseNode,
        MessheaderencapNode,
        MessheaderparseNode,
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
    import {useRoute} from "vue-router";
    import {builtNodeApi} from "/@/api/flowmanage/builtnode";

    const activeNames = ref(['1'])
    const route = useRoute()
    const querys = route.query
    // 引入组件
    const uploadbutton = ref();
    const Tool = defineAsyncComponent(() => import('./component/tool/index.vue'));
    const Contextmenu = defineAsyncComponent(() => import('./component/contextmenu/index.vue'));
    const Drawer = defineAsyncComponent(() => import('./component/drawer/index.vue'));
    const Help = defineAsyncComponent(() => import('./component/tool/help.vue'));

    const container = ref(null)
    const lf = ref(null)

    function dragNode(item) {
        //console.log(item)
        lf.value.dnd.startDrag({
            type: item.type,
        })
    }

    const getFlowFromDB = () => {
        flowApi().getFlowByID(
            {
                id: state.ID,

            }
        )
            .then(res => {
                //console.log(res);
                if (res.code == '200') {
                    //let temps = decodeURIComponent(res.data.FlowJson)
                    let temps = res.data.FlowJson
                    let xmlStrread = JSON.parse(temps)
                    //console.log(xmlStrread);
                    createFlowFromStr(xmlStrread);
                    // ElMessage.success("修改成功");

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });


    }
    const createFlowFromStr = (flowstr) => {
        lf.value.render(flowstr);
        //LfEvent();
        for (let i = 0; i < flowstr.nodes.length; i++) {
            let temp = flowstr.nodes[i];

            lf.value.setProperties(temp.id, temp.properties);
            lf.value.updateText(temp.id, temp.text.value);
        }
        for (let i = 0; i < flowstr.edges.length; i++) {
            let temp = flowstr.edges[i];

            lf.value.setProperties(temp.id, temp.properties);
            lf.value.updateText(temp.id, temp.text.value);
        }
    }
    const saveScript = (grajson) => {
        //console.log(grajson);
        let scripts = {nodes: [], edges: []};
        let nodes = grajson.nodes;
        for (let i = 0; i < nodes.length; i++) {
            let nodet = nodes[i]
            delete nodet.text;
            delete nodet.x;
            delete nodet.y;
            let tt = nodet.properties;
            if (nodet.type == 'start') {
                if (nodet.properties.interfacetype == '网口') {


                    nodet.properties = {};
                    nodet.properties.interfacetype = '网口'
                    nodet.properties.sourecenetworkID = tt.sourecenetworkID;
                    nodet.properties.sourecenetworkIP = tt.sourecenetworkIP;
                    nodet.properties.sourecenetworkPort = tt.sourecenetworkPort;
                    nodet.properties.localnetworkID = tt.localnetworkID;
                    nodet.properties.IP = tt.sourecenetworkIP;
                    nodet.properties.Port = tt.sourecenetworkIP;

                }
                if (nodet.properties.interfacetype == '串口') {


                    nodet.properties = {};
                    nodet.properties.interfacetype = '串口'
                    nodet.properties.BAUD = tt.BAUD;
                    nodet.properties.SerialNO = tt.SerialNO;
                    nodet.properties.serialID = tt.serialID;

                }

            }
            if (nodet.type == 'end') {
                if (nodet.properties.interfacetype == '网口') {


                    nodet.properties = {};
                    nodet.properties.interfacetype = '网口'
                    nodet.properties.IPlist = tt.IPlist;


                }
                if (nodet.properties.interfacetype == '串口') {


                    nodet.properties = {};
                    nodet.properties.interfacetype = '串口'
                    nodet.properties.BAUD = tt.BAUD;
                    nodet.properties.SerialNO = tt.SerialNO;
                    nodet.properties.serialID = tt.serialID;

                }

            }
            if (nodes[i].type == 'pacparse') {

            }
            if (nodes[i].type == 'pacencap') {

            }
            if (nodes[i].type == 'swich') {
                delete nodet.properties;
            }
            if (nodes[i].type == 'messheaderparse') {
                console.log(tt);
            }
            if (nodes[i].type == 'messheaderencap') {
                if (tt == null || tt.messtranslatedata == null || tt.length == 0) {
                    continue;
                }

                let waitlist = [];
                for (let k = 0; k < tt.messtranslatedata.length; k++) {
                    if (tt.messtranslatedata[k].children != null && tt.messtranslatedata[k].children.length > 0) {

                        waitlist = waitlist.concat(tt.messtranslatedata[k].children);
                        let ns = tt.messtranslatedata[k].Name;
                        let chi = tt.messtranslatedata[k].children;
                        nodet.properties.messtranslatedata[k] = {};
                        nodet.properties.messtranslatedata[k].Name = ns;
                        nodet.properties.messtranslatedata[k].children = chi;
                    } else {
                        waitlist.push(tt.messtranslatedata[k]);
                    }

                }
                while (waitlist.length > 0) {
                    let n = waitlist.pop();
                    if (n.children != null && n.children.length > 0) {


                        waitlist = waitlist.concat(n.children);
                        delete n.OutID;
                        delete n.CreateTime;
                        delete n.Describes;
                        delete n.Funcrule;
                        delete n.NestID;
                        delete n.OutID;
                        delete n.PID;
                        delete n.OutType;
                        delete n.SourceData;
                        delete n.GlobalData;
                        delete n.TransID;
                        delete n.TName;
                        delete n.TransDetailID;

                    } else {
                        delete n.GlobalData;
                        delete n.OutID;
                        delete n.CreateTime;
                        delete n.Describes;
                        delete n.Funcrule;
                        delete n.NestID;
                        delete n.OutID;
                        delete n.PID;
                        delete n.OutType;
                        delete n.SourceData;
                        delete n.sourceData;
                        delete n.globalData;
                        delete n.TransID;
                        delete n.TName;
                        delete n.TransDetailID;
                    }
                }

            }


            if (nodes[i].type == 'messbodyparse') {

            }
            if (nodes[i].type == 'messbodyencap') {

            }
            if (nodes[i].type == 'messtraslate') {

                if (tt == null || tt.messtranslatedata == null || tt.length == 0) {
                    continue;
                }

                let waitlist = [];
                for (let k = 0; k < tt.messtranslatedata.length; k++) {
                    if (tt.messtranslatedata[k].children != null && tt.messtranslatedata[k].children.length > 0) {

                        waitlist = waitlist.concat(tt.messtranslatedata[k].children);
                        let ns = tt.messtranslatedata[k].Name;
                        let chi = tt.messtranslatedata[k].children;
                        nodet.properties.messtranslatedata[k] = {};
                        nodet.properties.messtranslatedata[k].Name = ns;
                        nodet.properties.messtranslatedata[k].children = chi;
                    } else {
                        waitlist.push(tt.messtranslatedata[k]);
                    }

                }
                while (waitlist.length > 0) {
                    let n = waitlist.pop();
                    if (n.children != null && n.children.length > 0) {


                        waitlist = waitlist.concat(n.children);
                        delete n.OutID;
                        delete n.CreateTime;
                        delete n.Describes;
                        delete n.Funcrule;
                        delete n.NestID;
                        delete n.OutID;
                        delete n.PID;
                        delete n.OutType;
                        delete n.SourceData;
                        delete n.TransID;
                        delete n.TName;
                        delete n.TransDetailID;
                        delete n.GlobalData;

                    } else {
                        delete n.OutID;
                        delete n.CreateTime;
                        delete n.Describes;
                        delete n.Funcrule;
                        delete n.NestID;
                        delete n.OutID;
                        delete n.PID;
                        delete n.OutType;
                        delete n.SourceData;
                        delete n.TransID;
                        delete n.TName;
                        delete n.TransDetailID;
                        delete n.GlobalData;

                    }
                }


            }
            if (nodes[i].type == 'spemark') {


                nodet.properties = {};
                nodet.properties.globalVarRule = tt.globalVarRule;
                nodet.properties.globalVarName = tt.globalVarName;


            }


        }
        let edges = grajson.edges;
        for (let i = 0; i < edges.length; i++) {
            let edget = edges[i]
            delete edget.text;
            delete edget.endPoint;
            delete edget.pointsList;
            delete edget.startPoint;
            delete edget.type;
            if (edget.properties.rulestr == null || edget.properties.rulestr == '') {
                delete edget.properties;
            } else {
                let ttt = edget.properties;
                edget.properties = {};
                edget.properties.rulestr = ttt.rulestr;
            }
        }
        console.log(grajson);
        return grajson;
    }
    const checkGraph = (grajson) => {
        let nodes = grajson.nodes;
        for (let i = 0; i < nodes.length; i++) {
            console.log(lf.value.getNodeEdges(nodes[i].id))
            if (lf.value.getNodeEdges(nodes[i].id).length == 0) {
                ElMessage.error('请删除或调整无连接节点');
                return -1
            }
        }
        return 0


    }
    const saveFlow = () => {
        let flowGraphStr = lf.value.getGraphData();
        let s2 = JSON.parse(JSON.stringify(flowGraphStr));
        console.log(flowGraphStr);
        if (checkGraph(s2) == -1) {
            return;
        }
        let scripts = saveScript(s2);

        let data = JSON.stringify(flowGraphStr)
        let data2 = JSON.stringify(scripts)
        //const { href, filename } = setEncoded(type.toUpperCase(), name, data)
        //const encodedData = encodeURIComponent(data)
        const encodedData = data;
        // const encodeJson = JSON.stringify(script)


        flowApi().updateFlowJson(
            {
                ID: state.ID,
                FlowJson: encodedData,
                FlowOutStr: data2
            }
        )
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    // ElMessage.success("修改成功");
                    state.LastModified = res.data.LastModified;
                    ElMessage.success('数据保存成功');
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    // 页面加载时
    onMounted(async () => {
        await initLeftNavList();
        //initSortable();
        //initJsPlumb();
        //setClientWidth();
        initLf();
        getFlowFromDB();
        //window.addEventListener('resize', setClientWidth);
    });

    function initLf() {
        // 画布配置
        //console.log(container.value)

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
                /*  {
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
                  }*/

            ], // 覆盖默认的节点右键菜单
            edgeMenu: [
                /*       {
                           className: "lf-menu-delete",
                           text: "删除",
                           callback(edge) {
                               lf.value.deleteEdge(edge.id);
                           },
                           icon: true,
                       },*/
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
        lf.value.register(MessheaderparseNode);
        lf.value.register(MessheaderencapNode);
        lf.value.register(MessbodyparseNode);
        lf.value.register(MessbodyencapNode);

        lf.value.register(CalcNode);
        lf.value.register(PacparseNode);
        lf.value.register(PacencapNode);
        lf.value.register(SpemarkNode);
        lf.value.register(StatisticsNode);
        lf.value.register(TimerNode);
        lf.value.register(TimemarkNode);
        lf.value.register(ConversionNode);
        lf.value.register(InpacNode);
        lf.value.register(DestNode);
        render()
    }

    function render() {
        lf.value.render()
        //lf.value.render()

        LfEvent()
        //getFromDatabase()
    }

    function LfEvent() {
        lf.value.on('node:click', ({data}) => {
            drawerRef.value.open(data, lf.value);
            console.log('node:click', data)
        })
        lf.value.on('edge:click', ({data}) => {
            const sourenode = lf.value.getNodeModelById(data.sourceNodeId)
            if (sourenode.type == 'swich') {

                drawerRef.value.open(data, lf.value);
            } else {
                ElMessage.success('只有条件分支后续连接可以编辑');
            }

        })
        lf.value.on('element:click', () => {
            //hideAddPanel()
        })
        lf.value.on('edge:add', ({data}) => {
            console.log('edge:add', data)
        })
        lf.value.on('node:add', ({data}) => {
            console.log('node:add', data)

        })
        lf.value.on('node:mousemove', ({data}) => {
            console.log('node:mousemove')

        })
        lf.value.on('blank:click', () => {
            // hideAddPanel()
        })
        lf.value.on('connection:not-allowed', (data) => {
            this.$message({
                type: 'error',
                message: data.msg
            })
        })
        lf.value.on('node:contextmenu', ({data, e, position}) => {
            console.log('节点右键');
            onContextmenu('node', data, e, position);

        })
        lf.value.on('edge:contextmenu', ({data, e, position}) => {
            console.log('连接右键');
            onContextmenu('edge', data, e, position);
        })
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
    const state = reactive({
        FlowName: '',
        ID: 0,
        type: '流程编排',
        LastModified: '',
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
        state.ID = querys.ID;
        state.FlowName = querys.FlowName;
        state.Type = querys.Type;
        state.type='流程编排';
        //console.log(leftNavList)
        //console.log(state.Type);
        if (state.Type == '透明传输') {
            state.leftNavList = leftNavListSimple;

        } else {
            if (state.Type == '指定流程') {
                state.leftNavList = leftNavListSpecial;
            }
            if (state.Type == '混合编排') {
                state.leftNavList = leftNavList;
            }

            //console.log(state.leftNavList);
            builtNodeApi().search(
                {
                    uid: 1,
                    pageNum: 1,
                    pageSize: 1000,
                    name: '',
                })
                .then(res => {
                    //console.log(res);
                    if (res.code == '200') {

                        let convlist = state.leftNavList[3];

                        convlist.children = new Array();
                        for (let i = 0, k = 0; k < res.data.length; k++) {
                            if (res.data[k].Type == '内置转换节点') {
                                convlist.children[i] = {
                                    icon: conver,
                                    name: res.data[k].Name,
                                    type: 'conver',
                                    id: res.data[k].ID,
                                    descrip: res.data[k].Desc,
                                }
                                i++
                            }

                        }
                        convlist = state.leftNavList[4];
                        convlist.children = new Array();

                        for (let i = 0, k = 0; k < res.data.length; k++) {
                            if (res.data[k].Type == '内置封装节点') {
                                convlist.children[i] = {
                                    icon: inpac,
                                    name: res.data[k].Name,
                                    type: 'conver',
                                    id: res.data[k].ID,
                                    descrip: res.data[k].Desc,
                                }
                                i++
                            }

                        }


                    } else {
                        ElMessage.error(res.message);
                    }

                }).catch(err => {

            }).finally(() => {

            });


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
    const onContextmenu = (type, data, e, position) => {
        let loc = container.value.getBoundingClientRect();
        //console.log(loc);

        if (type == 'node') {
            let prope = lf.value.getProperties(data.id);
            console.log(prope);
            state.dropdownNode.x = loc.x + position.domOverlayPosition.x;
            state.dropdownNode.y = loc.y + position.domOverlayPosition.y;
            contextmenuNodeRef.value.openContextmenu('node', data);
        }
        if (type == 'edge') {

            state.dropdownLine.x = loc.x + position.domOverlayPosition.x;
            state.dropdownLine.y = loc.y + position.domOverlayPosition.y;
            contextmenuLineRef.value.openContextmenu('edge', data);

        }
    };
    // 右侧内容区-当前项右键菜单点击回调(节点)
    const onCurrentNodeClick = (contextMenuClickId, item: any) => {
        if (contextMenuClickId == 1) {
            lf.value.deleteNode(item.id);
        }
        if (contextMenuClickId == 0) {
            drawerRef.value.open(item, lf.value);
        }
    };

    // 右侧内容区-当前项右键菜单点击回调(线)
    const onCurrentLineClick = (contextMenuClickId, item: any) => {
        if (contextMenuClickId == 1) {
            lf.value.deleteEdge(item.id);
        }
        if (contextMenuClickId == 0) {
            const sourenode = lf.value.getNodeModelById(item.sourceNodeId)
            if (sourenode.type == 'swich') {

                drawerRef.value.open(item, lf.value);
            } else {
                ElMessage.success('只有条件分支后续连接可以编辑');
            }


        }
    };
    // 设置线的 label
    const setLineLabel = (obj: any) => {
        const {sourceId, targetId, label} = obj;

    };
    // 设置节点内容
    const setNodeContent = (obj: any) => {

    };
    // 顶部工具栏-当前项点击
    const onToolClick = (fnName: String) => {
        switch (fnName) {
            case 'editProp':
                const GraphConfigData = lf.value.getSelectElements(false);
                //GraphConfigData.nodes[0];
                drawerRef.value.open(GraphConfigData.nodes[0], lf.value);
                break;
            case 'zoomIn':
                //const { transformModel1 }=lf.value.graphModel;
                //transformModel1.zoom(true)
                lf.value.zoom(true);
                break;
            case 'zoomOut':
                // const { transformModel2 }=lf.value.graphModel;
               // transformModel2.zoom(false)
                lf.value.zoom(false);
                break;
            case 'zoomReset':
                //       const { transformModel3 }=lf.value.graphModel;
                //transformModel3.resetZoom()
                lf.value.resetZoom();
                break;
            case 'translateRest':
                lf.value.resetZoom();
                lf.value.resetTranslate();
                break;
            case 'undo':
                lf.value.undo();
                break;
            case 'redo':
                lf.value.redo();
                break;
            case 'showMiniMap':
                lf.value.extension.miniMap.show(lf.value.graphModel.width - 150, 40)
                break;
            case 'help':
                onToolHelp();
                break;
            case 'download':
                onToolDownload();
                break;
            case 'upload':
                onToolUpload();
                break;
            case 'submit':
                onToolSubmit();
                break;
            case 'copy':
                onToolCopy();
                break;
            case 'clearMap':
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
        let flowGraphStr = lf.value.getGraphData();
        const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flowGraphStr, null, '\t'));
        const aLink = document.createElement('a');
        aLink.setAttribute('href', href);
        aLink.setAttribute('download', `流程脚本.json`);
        aLink.click();
        aLink.remove();
        ElMessage.success('下载成功');
    };
    //上传
    const onToolUpload = () => {
        uploadbutton.value?.$.vnode.el?.click();

    };
    const uploadfile = (res, file, fileList) => {
        const name = file.name.split('.')[1];
        if (name != 'json' && name != 'json') {
            ElMessage.error("只能上传后缀为json的文件");
            return;
        }
        let reader = new FileReader();
        reader.readAsText(file.raw)
        reader.onload = (e) => {
            // 读取文件内容
            const fileString = e.target.result;
            let xmlStrread = JSON.parse(fileString)
            createFlowFromStr(xmlStrread);
            ElMessage.success('上传成功');
        }
    };
    // 顶部工具栏-提交
    const onToolSubmit = () => {
        // console.log(state.jsplumbData);
        saveFlow();

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
                lf.value.clearData();
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
    });</script>

<style scoped lang="scss">
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
                height: 100%;

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

                .workflow-right2 {


                    width: 30%;
                    height: 50%;
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
            //  background: url("./assets/svgicon/delete.png") no-repeat;
            background-size: 20px;
        }

        .lf-menu-edit {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: editicon;
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
