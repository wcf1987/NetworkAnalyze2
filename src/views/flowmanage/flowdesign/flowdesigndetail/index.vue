<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="logic-flow-view">
                <Control
                        class="demo-control"
                        v-if="lf"
                        :lf="lf"
                        @catData="catData"
                ></Control>
                <div class="save-alert">
                    <p>上次保存时间：{{timeStr}}</p>

                </div>
                <!-- 节点面板 -->
                <NodePanel v-if="lf" :lf="lf" :nodeList="nodeList"></NodePanel>
                <!-- 画布 -->

                <div id="LF-view" ref="container"></div>
                <AddPanel
                        v-if="showAddPanel"
                        class="add-panel"
                        :style="addPanelStyle"
                        :lf="lf"
                        :nodeData="addClickNode"
                        @addNodeFinish="hideAddPanel"
                >
                </AddPanel>
                <!-- 属性面板 -->
                <el-drawer
                        title="设置节点属性"
                        :visible.sync="dialogVisible"
                        direction="rtl"
                        size="500px"
                        :before-close="closeDialog">
                    <PropertyDialog
                            v-if="dialogVisible"
                            :nodeData="clickNode"
                            :lf="lf"
                            @setPropertiesFinish="closeDialog"
                    ></PropertyDialog>
                </el-drawer>
                <!-- 数据查看面板 -->
                <el-dialog
                        title="数据"
                        :visible.sync="dataVisible"
                        width="50%">
                    <DataDialog :graphData="graphData"></DataDialog>
                </el-dialog>

            </div>
        </el-card>
    </div>
   <appDialogBpmn ref="appDialog" @addAppDataExp='addappData'></appDialogBpmn>
    <messageDialogBpmn ref="messageDialog" @addMessageDataExp='addmessageData'></messageDialogBpmn>
    <interfaceDialogBpmn ref="interfaceDialog" @addInterfaceDataExp='addinterfaceData'></interfaceDialogBpmn>
    <packageDialogBpmn ref="packageDialog" @addPackageDataExp='addpackageData'></packageDialogBpmn>
    <endDialogBpmn ref="endDialog" @addEndDataExp='addendData'></endDialogBpmn>
    <conditionLineDialogLogicFlow ref="conditionLineDialog"
                                  @addConditionLineDataExp='addconditionLineData'></conditionLineDialogLogicFlow>

</template>

<script setup lang="ts">
    import {onMounted, ref} from 'vue';
    import '@logicflow/core/dist/style/index.css'
    import '@logicflow/extension/lib/style/index.css'
    import LogicFlow from '@logicflow/core'

    import {useRoute} from "vue-router"
    import {nodeList} from './logicflowpanel/config'
    import {Menu, MiniMap, Snapshot} from "@logicflow/extension";
    import NodePanel from '/@/views/flowmanage/flowdesign/flowdesigndetail/logicflowpanel/LFComponents/NodePanel.vue'
    import Control from './logicflowpanel/LFComponents/Control.vue'
    //import PropertyDialog from '/@/views/flowmanage/flowdesign/flowdesigndetail/logicflowpanel/PropertySetting/PropertyDialog.vue'
    //import DataDialog from '/@/views/flowmanage/flowdesign/flowdesigndetail/logicflowpanel/LFComponents/DataDialog.vue'
         import appDialogBpmn from './attridialog/AppDialogBpmn.vue'
    import interfaceDialogBpmn from './attridialog/InterfaceDialogBpmn.vue'

    import packageDialogBpmn from './attridialog/PackageDialogBpmn.vue'
    import endDialogBpmn from './attridialog/EndDialogBpmn.vue'
    import messageDialogBpmn from './attridialog/MessageDialogBpmn.vue'
    import conditionLineDialogLogicFlow from './attridialog/ConditionLineDialogLogicFlow.vue'
      import {
        AppNode,
        MessageNode,
        PackageNode,
        StartNode,
        EndNode,
        SwichNode,
        CustomLine
    } from './logicflowpanel/registerNode/index.js'
    const demoData = './logicflowpanel/data.json'
    const route = useRoute()
    // import '@/css/logicflowstyle.css'
    const container = ref(null)

    const lf = ref(null)


    const appDialog = ref()
    const messageDialog = ref()
    const interfaceDialog = ref()
    const packageDialog = ref()
    //const conditionDialog = ref()
    const conditionLineDialog = ref()
    const appList = ref([])
    const messageList = ref([])
    const interfaceList = ref([])
    const packageList = ref([])
    const endList = ref([])
    const conditionList = ref([])
    const allList = ref([messageList, interfaceList, packageList, appList])

    const querys = route.query
    const flowID = querys.flowid
    const name = 'LF'
    //  components: {NodePanel, AddPanel, Control, PropertyDialog, DataDialog},
    const showAddPanel = ref(false)
    const addPanelStyle = {
        top: 0,
        left: 0
    }
    const nodeData = null
    const addClickNode = ref(null)
    const clickNode = ref(null)
    const dialogVisible = ref(false)
    const graphData = ref(null)
    const dataVisible = ref(false)
    const config = {}


    onMounted(() => {
        initLf();
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
            edgeType: "line",
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
        })

        registerNode()
    }
 // 自定义
    function registerNode() {


        //registerConnect(lf.value)
        lf.value.register(CustomLine)
        lf.value.register(AppNode);
        lf.value.register(MessageNode);
        lf.value.register(PackageNode);
        lf.value.register(StartNode);
        lf.value.register(EndNode);
        lf.value.register(SwichNode);
        render()
    }
    function render() {
        lf.value.render(demoData)
        //lf.value.render()

        //LfEvent()
        //getFromDatabase()
    }


    function getData() {
        const data = lf.value.getGraphData()
        console.log(JSON.stringify(data))
    }

    function LfEvent() {
        lf.value.on('node:click', ({data}) => {
            console.log('node:click', data)


            if (data.type === 'package') {
                packageDialog.value.showD(data.id, packageList);

            }
            if (data.type === 'message') {
                messageDialog.value.showD(data.id, messageList);
                //console.log(appList)

            }
            if (data.type === 'app') {
                appDialog.value.showD(data.id, appList);
                //console.log(appList)


            }
            if (data.type === 'bpmn:ScriptTask') {
                interfaceDialog.value.showD(data.id, interfaceList);

            }
            if (data.type === 'bpmn:ExclusiveGateway') {
                //conditionDialog.value.showD(shape.id, conditionList,state,allList);

            }
            if (data.type === 'bpmn:SequenceFlow') {
                //conditionLineDialog.value.showD(data.id, conditionList, state, allList);

            }
            if (data.type === 'end') {
                interfaceDialog.value.showD(data.id, interfaceList);

            }
            if (data.type === 'start') {
                interfaceDialog.value.showD(data.id, interfaceList);

            }


        })
        lf.value.on('edge:click', ({data}) => {
            console.log('edge:click', data)
            clickNode.value = data
            dialogVisible.value = true
            var temp2 = lf.value.getEdgeDataById(data.id)
            var sourid = temp2.sourceNodeId
            var tempr = lf.value.getNodeDataById(sourid)
            if (tempr.type == 'swich') {
                conditionLineDialog.value.showD(data.id, conditionList, lf.value, allList);
            }
        })
        lf.value.on('element:click', () => {
            //hideAddPanel()
        })
        lf.value.on('edge:add', ({data}) => {
            console.log('edge:add', data)
        })
        lf.value.on('node:mousemove', ({data}) => {
            console.log('node:mousemove')
            moveData.value = data
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
        lf.value.on('node:mousemove', () => {
            console.log('on mousemove')
        })
    }

    function clickPlus(e, attributes) {
        e.stopPropagation()
        console.log('clickPlus', e, attributes)
        const {clientX, clientY} = e
        console.log(clientX, clientY)
        addPanelStyle.top = (clientY - 40) + 'px'
        addPanelStyle.left = clientX + 'px'
        //showAddPanel.value = true
        addClickNode.value = attributes
    }

    function mouseDownPlus(e, attributes) {
        e.stopPropagation()
        console.log('mouseDownPlus', e, attributes)
    }

    function hideAddPanel() {
        //showAddPanel.value = false
        addPanelStyle.top = 0
        addPanelStyle.left = 0
        addClickNode.value = null
    }

    function closeDialog() {
        dialogVisible.value = false
    }

    function saveDatabase() {
        let jsArry = createScriptStr()
        createDatabaseStr(jsArry)

    }

    function createScriptStr() {
        //let modeler = state.bpmnModeler
        //const {err, xml} = await modeler.saveXML({format: true})
        //let data = xml + '|' + JSON.stringify(appList.value) + '|' + JSON.stringify(messageList.value) + '|' + JSON.stringify(interfaceList.value) + '|' + JSON.stringify(packageList.value) + '|' + JSON.stringify(conditionList.value)
        //const { href, filename } = setEncoded(type.toUpperCase(), name, data)

        let alleles = lf.value.getGraphRawData();
        //console.log(alleles)
        let jsonArray = []
        for (let i = 0; i < alleles['nodes'].length; i++) {
            let t1 = alleles['nodes'][i]
            let t2 = {}
            if (t1.type == 'start') {
                t2 = {}
                t2['id'] = t1.id
                t2['type'] = t1.type

                let t3 = interfaceList.value.find(item => item.id == t1.id)
                if (t3 != undefined) {
                    t2['interfaceID'] = t3.interfaceID
                }
                jsonArray.push(t2)
                continue
            }
            if (t1.type == 'end') {
                t2 = {}
                t2['id'] = t1.id
                t2['type'] = t1.type
                let t3 = interfaceList.value.find(item => item.id == t1.id)
                if (t3 != undefined) {
                    t2['interfaceID'] = t3.interfaceID
                }
                jsonArray.push(t2)
                continue
            }
            if (t1.type == 'package') {
                t2 = {}
                t2['id'] = t1.id
                t2['type'] = t1.type
                let t3 = packageList.value.find(item => item.id == t1.id)
                if (t3 != undefined) {
                    t2['packageID'] = t3.packageID
                    t2['action'] = t3.rulestr
                }
                jsonArray.push(t2)
                continue
            }
            if (t1.type == 'app') {
                t2 = {}
                t2['id'] = t1.id
                t2['type'] = t1.type
                let t3 = appList.value.find(item => item.id == t1.id)
                if (t3 != undefined) {
                    t2['appID'] = t3.appID
                    t2['action'] = t3.rulestr
                }
                jsonArray.push(t2)
                continue
            }

            if (t1.type == 'message') {
                t2 = {}
                t2['id'] = t1.id
                t2['type'] = t1.type
                let t3 = messageList.value.find(item => item.id == t1.id)
                if (t3 != undefined) {
                    t2['messageID'] = t3.messageID
                }
                jsonArray.push(t2)
                continue
            }
            if (t1.type == 'swich') {
                t2 = {}
                t2['id'] = t1.id
                t2['type'] = t1.type
                //let t3 = messageList.value.find(item => item.id == t1.id)
                //t2['messageID'] = t3.messageID
                jsonArray.push(t2)
                continue
            }
        }
        for (let i = 0; i < alleles['edges'].length; i++) {
            let t1 = alleles['edges'][i]
            let t2 = {}

            t2 = {}
            t2['id'] = t1.id
            t2['type'] = t1.type
            t2['sourceID'] = t1.sourceNodeId
            t2['targetID'] = t1.targetNodeId
            let t3 = conditionList.value.find(item => item.id == t1.id)

            if (t3 != undefined) {
                t2['sourcestr'] = t3.source
                t2['rulestr'] = t3.rulestr
            }

            jsonArray.push(t2)

        }


        console.log(jsonArray)
        return jsonArray
        //const encodedData = encodeURIComponent(data)
        //HTTPRequest.post('/flowDetail/add',
        // {
        //   'flowID': flowID,
        //   'bpmnstr': encodedData,

        //}).then(res => {
        //tableData.value.splice(index, 1);
        // tableData.value.push({'id':fo.id,'name':fo.name,'type':fo.type,'children':JSON.parse(JSON.stringify(getInterfaceParallel()))})

        // })
    }

    async function createDatabaseStr(script) {
        let flowGraphStr = lf.value.getGraphData();
        let data = JSON.stringify(flowGraphStr) + '|' + JSON.stringify(appList.value) + '|' + JSON.stringify(messageList.value) + '|' + JSON.stringify(interfaceList.value) + '|' + JSON.stringify(packageList.value) + '|' + JSON.stringify(conditionList.value)
        //const { href, filename } = setEncoded(type.toUpperCase(), name, data)
        const encodedData = encodeURIComponent(data)
        const encodeJson = JSON.stringify(script)
        HTTPRequest.post('/flowDetail/add',
            {
                'flowID': flowID,
                'bpmnstr': encodedData,
                'bpmnjsonstr': encodeJson

            }).then(res => {
            //tableData.value.splice(index, 1);
            // tableData.value.push({'id':fo.id,'name':fo.name,'type':fo.type,'children':JSON.parse(JSON.stringify(getInterfaceParallel()))})
            timeStr.value = formatTime(new Date(), false)
            //timeStr.value=new Date()


        })
    }

    function formatTime(data, flag) {
        console.log(data)
        const date = new Date(data);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = date.getDate();
        d = d < 10 ? '0' + d : d;
        let h = date.getHours();
        h = h < 10 ? '0' + h : h;
        let minute = date.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;
        let second = date.getSeconds();
        second = second < 10 ? '0' + second : second;
        if (flag) {
            return y + '-' + m + '-' + d;
        }
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }

    function StringToDate(DateStr) {
        var converted = Date.parse(DateStr);
        var myDate = new Date(converted);
        if (isNaN(myDate)) {
            //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';
            var arys = DateStr.split('-');
            myDate = new Date(arys[0], --arys[1], arys[2]);
        }
        return myDate;
    }

    function DateDiff(strInterval, dtEnd) {
        var dtStart = this;
        if (typeof dtEnd == 'string')//如果是字符串转换为日期型
        {
            dtEnd = StringToDate(dtEnd);
        }
        switch (strInterval) {
            case 's' :
                return parseInt((dtEnd - dtStart) / 1000);
            case 'n' :
                return parseInt((dtEnd - dtStart) / 60000);
            case 'h' :
                return parseInt((dtEnd - dtStart) / 3600000);
            case 'd' :
                return parseInt((dtEnd - dtStart) / 86400000);
            case 'w' :
                return parseInt((dtEnd - dtStart) / (86400000 * 7));
            case 'm' :
                return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
            case 'y' :
                return dtEnd.getFullYear() - dtStart.getFullYear();
        }
    }

    function getFromDatabase() {
        HTTPRequest.post('/flowDetail/getByID',
            {
                'flowID': flowID,

            }).then(res => {
            //tableData.value.splice(index, 1);
            // tableData.value.push({'id':fo.id,'name':fo.name,'type':fo.type,'children':JSON.parse(JSON.stringify(getInterfaceParallel()))})
            if (res.data.bpmnstr == undefined) {
                return
            }
            let temps = decodeURIComponent(res.data.bpmnstr)
            let xmlStrread = JSON.parse(analyseFile(temps))
            lf.value.render(xmlStrread)
            LfEvent()
        })
    }

    function analyseFile(strt) {
        const strArr = strt.split('|')
        appList.value = JSON.parse(strArr[1])
        messageList.value = JSON.parse(strArr[2])
        interfaceList.value = JSON.parse(strArr[3])
        packageList.value = JSON.parse(strArr[4])
        conditionList.value = JSON.parse(strArr[5])
        return strArr[0]
    }

    const catData = () => {
        graphData.value = lf.value.getGraphData();
        dataVisible.value = true;
        saveDatabase();
    }

    const addappData = (fo) => {
        console.log(fo)
        let i = appList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = appList.value[i]
            item.appID = fo.appID
            item.appName = fo.appName
            item.rulestr = fo.rulestr
        } else {
            item = {id: fo.id, appID: fo.appID, appName: fo.appName, rulestr: fo.rulestr}
            appList.value.push(item)
        }
        let ss = fo.rulestr + fo.appName
        const nodeModel = lf.value.getNodeModelById(fo.id);
        nodeModel.updateText(ss);
        //state.bpmnModeler.get('modeling').updateProperties(getShape(fo.id), {name: ss})

        saveDatabase()
    }
    const addmessageData = (fo) => {
        console.log(fo)
        let i = messageList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = messageList.value[i]
            item.ruleID = fo.ruleID
            item.ruleName = fo.ruleName
        } else {
            item = {id: fo.id, ruleID: fo.ruleID, ruleName: fo.ruleName}
            messageList.value.push(item)
        }
        let ss = '调用规则：' + fo.ruleName
        const nodeModel = lf.value.getNodeModelById(fo.id);
        nodeModel.updateText(ss);
        saveDatabase()
    }
    const addpackageData = (fo) => {
        console.log(fo)
        let i = packageList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = packageList.value[i]
            item.packageID = fo.packageID
            item.packageName = fo.packageName
            item.rulestr = fo.rulestr
        } else {
            item = {id: fo.id, packageID: fo.packageID, packageName: fo.packageName, rulestr: fo.rulestr}
            packageList.value.push(item)
        }
        let ss = fo.rulestr + fo.packageName
        const nodeModel = lf.value.getNodeModelById(fo.id);
        nodeModel.updateText(ss);
        saveDatabase()
    }
    const addinterfaceData = (fo) => {
        console.log(fo)
        let i = interfaceList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = interfaceList.value[i]
            item.interfaceID = fo.interfaceID
            item.interfaceName = fo.interfaceName
        } else {
            item = {id: fo.id, interfaceID: fo.interfaceID, interfaceName: fo.interfaceName}
            interfaceList.value.push(item)
        }
        let ss = fo.interfaceName
        const nodeModel = lf.value.getNodeModelById(fo.id);
        nodeModel.updateText(ss);
        saveDatabase()
    }
    const addendData = (fo) => {
        console.log(fo)
        let i = endList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = endList.value[i]
            item.source = fo.source
            item.rulestr = fo.rulestr
        } else {
            item = {id: fo.id, source: fo.source, rulestr: fo.rulestr}
            endList.value.push(item)
        }
        let ss = '解析' + fo.source
        const nodeModel = lf.value.getNodeModelById(fo.id);
        nodeModel.updateText(ss);
        saveDatabase()
    }
    const addconditionData = (fo) => {
        console.log(fo)
        let i = conditionList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = conditionList.value[i]
            item.source = fo.source
            item.rulestr = fo.rulestr

        } else {
            item = {id: fo.id, source: fo.source, rulestr: fo.rulestr}
            conditionList.value.push(item)
        }
        let ss = '条件路由：' + fo.source
        // state.bpmnModeler.get('modeling').updateProperties(getShape(fo.id), {name: ss})

    }
    const addconditionLineData = (fo) => {
        console.log(fo)
        let i = conditionList.value.findIndex(item => item.id == fo.id)
        let item
        if (i != -1) {
            item = conditionList.value[i]
            item.source = fo.source
            item.rulestr = fo.rulestr

        } else {
            item = {id: fo.id, source: fo.source, rulestr: fo.rulestr}
            conditionList.value.push(item)
        }
        let ss = '选择路由：' + fo.source
        const edgeModel = lf.value.getEdgeModelById(fo.id);
        edgeModel.updateText(ss);
        saveDatabase()
    }

</script>

<style scoped lang="scss">
    .logic-flow-view {
        height: 100%;
        width: 100%;

    }

    .demo-title {
        text-align: center;
        margin: 20px;
    }

    .demo-control {
        position: absolute;
        top: 20px;
        left: 300px;
        z-index: 2;

    }

    .save-alert {
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 2;
    }

    #LF-view {
        width: 100%;
        height: 100%;
        outline: none;
        margin-left: 0px;
    }

    .time-plus {
        cursor: pointer;
    }

    .add-panel {
        position: absolute;
        z-index: 11;
        background-color: white;
        padding: 10px 5px;

    }

    .el-drawer__body {
        height: 80%;
        overflow: auto;
        margin-top: -30px;
        z-index: 3;
    }

    @keyframes lf_animate_dash {
        to {
            stroke-dashoffset: 0;
        }
    }

    .lf-menu-delete .lf-menu-item-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("./logicflowpanel/background/delete.svg") no-repeat;
        background-size: 20px;
    }

    .system-user-container {
        width:1700px;
        :deep(.el-card__body) {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: auto;

        }
    }
</style>
