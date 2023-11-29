<template>
    <div class="workflow-drawer-node">
        <el-tabs type="border-card" v-model="state.tabsActive">
            <!-- 节点编辑 -->
            <el-tab-pane label="节点编辑" name="1">
                <el-scrollbar>
                    <el-form :model="state.node" ref="nodeFormRef" size="default"
                             label-width="80px" class="pt15 pr15 pb15 pl15">
                        <el-form-item label="数据id" prop="id" v-if="false">
                            <el-input v-model="state.node.id" placeholder="请输入数据id" clearable disabled></el-input>
                        </el-form-item>

                        <el-form-item label="类型" prop="type">
                            <el-input v-model="state.proper.typeC" placeholder="请输入类型" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="left坐标" prop="x" v-if="false">
                            <el-input v-model="state.node.x" placeholder="请输入left坐标" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="top坐标" prop="y" v-if="false">
                            <el-input v-model="state.node.y" placeholder="请输入top坐标" clearable disabled></el-input>
                        </el-form-item>

                        <el-form-item label="名称" prop="name">
                            <el-input v-model="state.proper.name" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="mb15" @click="onNodeRefresh">
                                <SvgIcon name="ele-RefreshRight"/>
                                重置
                            </el-button>
                            <el-button type="primary" class="mb15" @click="onNodeSubmit">
                                <SvgIcon name="ele-Check"/>
                                下一步
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </el-tab-pane>

            <!-- 扩展表单 -->
            <el-tab-pane label="属性" name="2">
                <el-scrollbar>
                    <el-form :model="state.form" ref="extendFormRef" size="default" label-width="100px"
                             class="pt15 pr15 pb15 pl15">

                        <div class="customproper" v-if="state.showFlag['start']">
                            <el-form-item label="接口类型">
                                <el-select v-model="state.properForm.interfacetype" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option label="网口" value="网口"></el-option>
                                    <el-option label="串口" value="串口"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="源地址" prop="sourecenetworkID"
                                          v-if="state.properForm.interfacetype=='网口'">
                                <el-select v-model="state.properForm.sourecenetworkID" placeholder="请选择" clearable
                                           v-on:change="onChangeStartSNIP"
                                           class="w100">
                                    <el-option
                                            v-for="item in NetworkOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="输入源地址" prop="sourecenetworkIP"
                                          v-if="state.properForm.interfacetype=='网口' &&state.properForm.sourecenetworkID!=-2 &&state.properForm.sourecenetworkID!=''">
                                <el-input v-model="state.properForm.sourecenetworkIP" placeholder="请输入源地址ip地址" clearable
                                          :readonly=" state.properForm.sourecenetworkID!='-1'"
                                ></el-input>
                            </el-form-item>


                            <el-form-item label="串口信息" prop="serialID" v-if="state.properForm.interfacetype=='串口'">
                                <el-select v-model="state.properForm.serialID" placeholder="请选择" clearable class="w100"
                                           v-on:change="onChangeStartSerialChoose">
                                    <el-option
                                            v-for="item in SerialOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="本地串口号" prop="SerialNO"
                                          v-if="state.properForm.interfacetype=='串口'">
                                <el-input v-model="state.properForm.SerialNO" placeholder="请输入串口号" clearable
                                          :readonly=" state.properForm.serialID!='-1'"></el-input>
                            </el-form-item>
                            <el-form-item label="本地波特率" prop="BAUD"
                                          v-if="state.properForm.interfacetype=='串口' ">
                                <el-input v-model="state.properForm.BAUD" placeholder="请输入波特率" clearable
                                          :readonly=" state.properForm.serialID!='-1'"></el-input>
                            </el-form-item>

                            <el-form-item label="本地地址" prop="localnetworkID"
                                          v-if="state.properForm.interfacetype=='网口'">
                                <el-select v-model="state.properForm.localnetworkID" placeholder="请选择" clearable
                                           class="w100" v-on:change="onChangeStartNetworkChoose">
                                    <el-option
                                            v-for="item in NetworkLocalOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="本地地址" prop="IP"
                                          v-if="state.properForm.interfacetype=='网口' &&state.properForm.localnetworkID!=null">
                                <el-input v-model="state.properForm.IP" placeholder="请输入ip地址" clearable
                                          :readonly=" state.properForm.localnetworkID!='-1'"></el-input>
                            </el-form-item>
                            <el-form-item label="本地端口" prop="Port"
                                          v-if="state.properForm.interfacetype=='网口' "
                                          :readonly=" state.properForm.localnetworkID!='-1'">
                                <el-input v-model="state.properForm.Port" placeholder="请输入端口" clearable
                                          :readonly=" state.properForm.localnetworkID!='-1'"></el-input>
                            </el-form-item>

                        </div>

                        <div class="customproper" v-if="state.showFlag['end']">
                            <el-form-item label="接口类型">
                                <el-select v-model="state.properForm.interfacetype" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option label="网口" value="网口"></el-option>
                                    <el-option label="串口" value="串口"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="目的串口" prop="type" v-if="state.properForm.interfacetype=='串口'">
                                <el-select v-model="state.properForm.serialID" placeholder="请选择" clearable class="w100"
                                           v-on:change="onChangeEndSerialChoose">
                                    <el-option
                                            v-for="item in SerialOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="目的串口号" prop="type"
                                          v-if="state.properForm.interfacetype=='串口'">
                                <el-input v-model="state.properForm.SerialNO" placeholder="请输入串口号" clearable
                                          :readonly=" state.properForm.serialID!='-1'"></el-input>
                            </el-form-item>
                            <el-form-item label="目的波特率" prop="type"
                                          v-if="state.properForm.interfacetype=='串口' ">
                                <el-input v-model="state.properForm.BAUD" placeholder="请输入波特率" clearable
                                          :readonly=" state.properForm.serialID!='-1'"></el-input>
                            </el-form-item>
                            <el-form-item label="目的地址" prop="type" v-if="state.properForm.interfacetype=='网口'">
                                <el-select v-model="state.properForm.localnetworkID" placeholder="请选择" clearable
                                           class="w100" v-on:change="onChangeEndNetworkChoose">
                                    <el-option
                                            v-for="item in NetworkLocalOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-row v-for="(v, k) in state.properForm.IPlist" :key="k">
                                <el-form-item label="目的IP" prop="type"
                                              v-if="state.properForm.interfacetype=='网口'">
                                    <el-col :span="11">

                                        <el-input v-model="v.IP" placeholder="请输入ip地址" clearable
                                        ></el-input>
                                    </el-col>
                                    <el-col :span="1" class="text-center">
                                        <span style="display:block;text-align: center" class="text-gray-500">:</span>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-input v-model="v.Port" placeholder="请输入端口" clearable
                                        ></el-input>
                                    </el-col>
                                    <el-col :span="1"/>
                                    <el-col :span="2">
                                        <el-button type="success" size="small" circle @click="onAddEndIP">
                                            <el-icon>
                                                <ele-Plus/>
                                            </el-icon>

                                        </el-button>
                                    </el-col>
                                    <el-col :span="1"/>
                                    <el-col :span="2">
                                        <el-button type="danger" size="small" circle @click="onDelEndIP(k)">
                                            <el-icon>
                                                <ele-Delete/>
                                            </el-icon>

                                        </el-button>
                                    </el-col>
                                </el-form-item>
                            </el-row>

                        </div>


                        <div class="customproper" v-if="state.showFlag['pacparse']">
                            <el-form-item label="头部选择">
                                <el-select v-model="state.properForm.pacparseID" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option
                                            v-for="item in PackageOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>


                        </div>

                        <div class="customproper" v-if="state.showFlag['pacencap']">
                            <el-form-item label="头部选择">
                                <el-select v-model="state.properForm.pacencapID" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option
                                            v-for="item in PackageOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>


                        </div>

                        <div class="customproper" v-if="state.showFlag['messheaderparse']">
                            <el-form-item label="消息头">
                                <el-select v-model="state.properForm.messheaderparseID" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option
                                            v-for="item in MessHeaderOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />


                                </el-select>
                            </el-form-item>


                        </div>
                        <div class="customproper" v-if="state.showFlag['messheaderencap']">
                            <el-form-item label="消息头">
                                <el-select v-model="state.properForm.messheaderencapID" placeholder="请选择" clearable
                                           class="w100" v-on:change="onChangeMessheaderEncapChoose">
                                    <el-option
                                            v-for="item in MessHeaderOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />

                                </el-select>
                            </el-form-item>


                        </div>
                        <div class="customproper" v-if="state.showFlag['messbodyparse']">
                            <el-form-item label="消息体">
                                <el-select v-model="state.properForm.messbodyparseID" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option
                                            v-for="item in MessBodyOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />

                                </el-select>
                            </el-form-item>


                        </div>
                        <div class="customproper" v-if="state.showFlag['messbodyencap']">
                            <el-form-item label="消息体">
                                <el-select v-model="state.properForm.messbodyencapID" placeholder="请选择" clearable
                                           class="w100">
                                    <el-option
                                            v-for="item in MessBodyOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />

                                </el-select>
                            </el-form-item>


                        </div>


                        <div class="customproper" v-if="state.showFlag['messtraslate']">
                            <el-form-item label="转化规则模板">
                                <el-select v-model="state.properForm.transid" v-on:change="onChangeMessTranslateChoose"
                                           placeholder="请选择" clearable class="w100">
                                    <el-option
                                            v-for="item in MessTraslateOptions"
                                            :key="item.ID"
                                            :label="item.Name"
                                            :value="item.ID"
                                    />
                                </el-select>
                            </el-form-item>


                        </div>

                        <div class="customproper" v-if="state.showFlag['spemark']">
                            <el-form-item label="变量名">
                                <el-input v-model="state.properForm.globalVarName" placeholder="请输入临时变量代码名称" clearable>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="源字段" prop="source">

                                <el-cascader v-model="state.properForm.sourceData" :options="sourceoptions"
                                             :separator="'.'"
                                             :props="props21"
                                             @change="changeSourceInput21"
                                             clearable
                                             style="width: 500px; " collapse-tags/>
                            </el-form-item>

                            <el-form-item label="转换公式" prop="rulestr" clearable>
                                <el-input
                                        :autosize="{ minRows: 2, maxRows: 10 }"
                                        type="textarea"
                                        placeholder="请输入转换公式"
                                        v-model="state.properForm.globalVarRule" autocomplete="off"/>
                            </el-form-item>


                        </div>

                        <el-form-item class="btn">
                            <el-button class="mb15" @click="state.tabsActive = '1'">
                                <SvgIcon name="ele-DArrowLeft"/>
                                上一步
                            </el-button>

                            <el-button class="mb15" @click="onExtendRefresh">
                                <SvgIcon name="ele-RefreshRight"/>
                                重置
                            </el-button>

                            <el-button type="primary" class="mb15" @click="onExtendEditMessTranslate"
                                       :loading="state.loading.extend" v-if="state.showFlag['messtraslate']">
                                <SvgIcon name="ele-EditPen"/>
                                编辑模板
                            </el-button>
                            <el-button type="primary" class="mb15" @click="onExtendGlobalVar"
                                       :loading="state.loading.extend" v-if="state.showFlag['spemark'] && false">
                                <SvgIcon name="ele-EditPen"/>
                                编辑变量
                            </el-button>

                            <el-button type="primary" class="mb15" @click="viewNess"
                                       :loading="state.loading.extend"
                                       v-if="state.showFlag['messbodyencap'] || state.showFlag['messbodyparse'] ||  state.showFlag['messheaderparse'] ">
                                <SvgIcon name="ele-EditPen"/>
                                查看详细信息
                            </el-button>

                            <el-button type="primary" class="mb15" @click="onExtendEditMessheader"
                                       :loading="state.loading.extend" v-if="state.showFlag['messheaderencap']">
                                <SvgIcon name="ele-EditPen"/>
                                编辑消息头
                            </el-button>

                            <el-button type="primary" class="mb15" @click="onExtendSubmit"
                                       :loading="state.loading.extend">
                                <SvgIcon name="ele-Check"/>
                                保存
                            </el-button>

                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </el-tab-pane>

            <!-- 图表可视化 -->
            <el-tab-pane label="图表可视化" name="3">
                <el-scrollbar>
                    <div class="flex-content-right">
                        <div style="height: 200px; width: 320px" ref="chartsMonitorRef"></div>
                    </div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
        <Translatedialog ref="translateDialogRef" @refresh="messTranslateModify"/>
        <Messdialog ref="messDialogRef" @refresh="onExtendSubmit()"/>
        <ViewDialog ref="viewDialogRef" @refresh="onExtendSubmit()"/>
        <GlobalEditdialog ref="globalEditDialogRef" @refresh="onExtendSubmit()"/>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawerNode">
    import {defineAsyncComponent, nextTick, reactive, ref} from 'vue';
    import {ElMessage} from 'element-plus';
    import * as echarts from 'echarts';
    import {addressApi} from "/@/api/sysmanage/address";
    import {packageApi} from "/@/api/sysmanage/package";
    import {messtranslateApi} from "/@/api/sysmanage/messtranslate";
    import {messbodyApi} from "/@/api/sysmanage/messbody";
    import {messheaderApi} from "/@/api/sysmanage/messheader";
    import {messdetailApi} from "/@/api/sysmanage/messdetail";

    const Translatedialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/traslatedialog.vue'));
    const translateDialogRef = ref();
    const Messdialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/messdialog.vue'));
    const messDialogRef = ref();
    const ViewDialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/viewdialog.vue'));
    const viewDialogRef = ref();
    const GlobalEditdialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/globaleditdialog.vue'));
    const globalEditDialogRef = ref();
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['submit', 'close']);

    // 定义变量内容
    const nodeFormRef = ref();
    const extendFormRef = ref();
    const chartsMonitorRef = ref();
    const NetworkOptions = ref();
    const NetworkLocalOptions = ref();
    const SerialOptions = ref();
    const PackageOptions = ref();
    const MessHeaderOptions = ref();
    const MessBodyOptions = ref();
    const MessTraslateOptions = ref();
    const state = reactive({
        node: {},
        lf: '',
        nodeRules: {
            name: [{required: true, message: '请输入名称', trigger: 'blur'}],
        },
        proper: {
            name: '',
            typeC: '',
        },
        form: {
            module: [],
        },
        showFlag: {
            start: "false",
        },
        properForm: {
            type: "",
        },
        tabsActive: '1',
        loading: {
            extend: false,
        },
    });
    const sourceoptions = ref();
    const globaloptions = ref();
    const fieldsoptions = ref();

    const props21 = {
        multiple: true,
        expandTrigger: 'hover',
        value: 'EName',
        label: 'Name',
        emitPath: true
    }
    const changeSourceInput21 = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''

        if(fo.length>0){
            tempstr =  fo[fo.length-1].join('.') + '\n'
        }


        tempstr = tempstr.replaceAll(',', '.');
        state.properForm.globalVarRule =state.properForm.globalVarRule + tempstr;


    }
    // 获取父组件数据
    const getParentData = (data, lf) => {
        clearFlag();
        state.tabsActive = '1';
        state.node = data;
        state.proper.name = data.text.value;
        state.properForm = data.properties;

        state.lf = lf;
        state.showFlag[state.node["type"]] = true;

        if (data.type == 'start') {
            state.proper.typeC = '开始节点';
            getNetwork();
            getSerial();

        }
        if (data.type == 'end') {
            state.proper.typeC = '目的节点';
            getNetwork();
            getSerial();

        }
        if (data.type == 'calc') {
            state.proper.typeC = '计算节点';
        }

        if (data.type == 'messtraslate') {
            state.proper.typeC = '消息转化';
            getNetwork();
            getSerial();
            getPackage();
            getMessHeader();
            getMessBody();
            getMessTraslate();
            nextTick(() => {
                setTimeout(() => {
                    getSourceData();
                }, 500);
            });
        }
        if (data.type == 'pacencap') {
            state.proper.typeC = '封装/应用头添加';
            getNetwork();
            getSerial();
            getPackage();
            getMessHeader();
            getMessBody();
            getMessTraslate();
            nextTick(() => {
                setTimeout(() => {
                    getSourceData();
                }, 500);
            });
        }
        if (data.type == 'pacparse') {
            state.proper.typeC = '封装/应用头解析';

            getPackage();

        }
        if (data.type == 'messheaderparse') {
            state.proper.typeC = '消息头解析';

            getMessHeader();

        }
        if (data.type == 'messheaderencap') {
            state.proper.typeC = '消息头添加';
            getNetwork();
            getSerial();
            getPackage();
            getMessHeader();
            getMessBody();
            getMessTraslate();
            nextTick(() => {
                setTimeout(() => {
                    getSourceData();
                }, 500);
            });
        }
        if (data.type == 'messbodyparse') {
            state.proper.typeC = '消息体解析';
            getNetwork();

            getMessBody();

        }
        if (data.type == 'messbodyencap') {
            state.proper.typeC = '消息体添加';

            getMessBody();

        }
        if (data.type == 'spemark') {
            state.proper.typeC = '临时变量';
            getNetwork();
            getSerial();
            getPackage();
            getMessHeader();
            getMessBody();
            getMessTraslate();
            nextTick(() => {
                setTimeout(() => {
                    getSourceData();
                }, 500);
            });
        }

        if (data.type == 'statistics') {
            state.proper.typeC = '数据统计';
        }
        if (data.type == 'timemark') {
            state.proper.typeC = '时间标记';
        }
        if (data.type == 'timer') {
            state.proper.typeC = '定时器';
        }
        if (data.type == 'swich') {
            state.proper.typeC = '分支选择';
            getNetwork();
            getSerial();
            getPackage();
            getMessHeader();
            getMessBody();
            getMessTraslate();
            nextTick(() => {
                setTimeout(() => {
                    getSourceData();
                }, 500);
            });
        }


        initChartsMonitor();
    };
    const getNetwork = () => {
        addressApi().searchNetworkInter(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    NetworkOptions.value = res.data;


                    NetworkOptions.value.unshift({ID: '-2', Name: '无'});

                    NetworkLocalOptions.value = res.data;
                    NetworkLocalOptions.value.push({ID: '-1', Name: '手动输入'});
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    const getSerial = () => {
        addressApi().searchSerialInter(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    SerialOptions.value = res.data;
                    SerialOptions.value.push({ID: '-1', Name: '手动输入'});

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    const getPackage = () => {
        packageApi().searchPackage(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    PackageOptions.value = res.data;


                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    const getMessHeader = () => {
        messheaderApi().searchMessHeader(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    MessHeaderOptions.value = res.data;


                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    const getMessBody = () => {
        messbodyApi().searchMessBody(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    MessBodyOptions.value = res.data;


                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    const getMessTraslate = () => {
        messtranslateApi().searchMessTranslate(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    MessTraslateOptions.value = res.data;


                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });

    }
    const getMessTraslateDetail = (pid, transid, ttype) => {
        messtranslateApi().searchMessTranslateDetail(
            {
                uid: 1,
                pid: pid,
                transid: transid,
                pageNum: 1,
                pageSize: 10000,
                name: '',
                ttype: ttype
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {
                    for (let i = 0; i < res.data.length; i++) {
                        res.data[i].SourceData = JSON.parse(res.data[i].SourceData)
                        res.data[i].Funcrule = JSON.parse(res.data[i].Funcrule)
                    }
                    state.properForm.messtranslatedata = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        //const data = [];

    }
    const getSourceData = () => {
        //sourceoptions.value = [];
        getNodeSourceData();
        nextTick(() => {
            setTimeout(() => {
                sourceoptions.value = fieldsoptions.value.concat(globaloptions.value);
                let graph = state.lf.getGraphData();

                let nodes = graph.nodes;
                for (let i = 0; i < nodes.length; i++) {
                    if (nodes[i].type == 'swich') {
                        console.log('swich');

                        state.lf.setProperties(nodes[i].id, {fd: fieldsoptions.value, gd: globaloptions.value});
                    }
                }
                // emitter.emit('Fn', {fd:fieldsoptions.value,gd:globaloptions.value});
            }, 500);
        });


    }
    const getNodeSourceData = () => {
        fieldsoptions.value = [];
        let graph = state.lf.getGraphData();
        let packagelist = [];
        let messheaderlist = [];
        let messbodylist = [];
        let globalvarlist = [];
        let nodes = graph.nodes;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].type == 'start') {

            }
            if (nodes[i].type == 'pacparse') {
                if (nodes[i].properties.pacparseID != null && nodes[i].properties.pacparseID != -1) {
                    packagelist.push(nodes[i].properties.pacparseID);
                }
            }
            if (nodes[i].type == 'pacencap') {
                if (nodes[i].properties.pacencapID != null && nodes[i].properties.pacencapID != -1) {
                    packagelist.push(nodes[i].properties.pacencapID);
                }
            }

            if (nodes[i].type == 'messheaderparse') {
                if (nodes[i].properties.messheaderparseID != null && nodes[i].properties.messheaderparseID != -1) {
                    messheaderlist.push(nodes[i].properties.messheaderparseID);
                }
            }
            if (nodes[i].type == 'messheaderencap') {
                if (nodes[i].properties.messheaderencapID != null && nodes[i].properties.messheaderencapID != -1) {
                    messheaderlist.push(nodes[i].properties.messheaderencapID);
                }
            }


            if (nodes[i].type == 'messbodyparse') {
                if (nodes[i].properties.messbodyparseID != null && nodes[i].properties.messbodyparseID != -1) {
                    messbodylist.push(nodes[i].properties.messbodyparseID);
                }
            }
            if (nodes[i].type == 'messbodyencap') {
                if (nodes[i].properties.messbodyencapID != null && nodes[i].properties.messbodyencapID != -1) {
                    messbodylist.push(nodes[i].properties.messbodyencapID);
                }
            }
            if (nodes[i].type == 'spemark') {
                if (nodes[i].properties.globalVarName != null && nodes[i].properties.globalVarName != '' && nodes[i].properties.globalVarName != state.properForm.globalVarName) {
                    globalvarlist.push({
                        EName: nodes[i].properties.globalVarName,
                        Name: nodes[i].properties.globalVarName
                    });
                }
            }


        }
        packagelist = Array.from(new Set(packagelist));
        messheaderlist = Array.from(new Set(messheaderlist));
        messbodylist = Array.from(new Set(messbodylist));
        globalvarlist = Array.from(new Set(globalvarlist));
        let lista, listb;
        lista = packagelist;
        listb = PackageOptions.value;
        for (let i = 0; i < lista.length; i++) {
            for (let k = 0; k < listb.length; k++) {
                if (lista[i] == listb[k].ID) {
                    let childs = getPackageDetailOptions(listb[k].Name, listb[k].Name, lista[i]);

                }
            }
        }

        lista = messheaderlist;
        listb = MessHeaderOptions.value;
        for (let i = 0; i < lista.length; i++) {
            for (let k = 0; k < listb.length; k++) {
                if (lista[i] == listb[k].ID) {
                    let childs = getMessHeaderDetailOptions(listb[k].Name, listb[k].Name, lista[i]);

                }
            }
        }

        lista = messbodylist;
        listb = MessBodyOptions.value;
        for (let i = 0; i < lista.length; i++) {
            for (let k = 0; k < listb.length; k++) {
                if (lista[i] == listb[k].ID) {
                    let childs = getMessBodyDetailOptions(listb[k].Name, listb[k].Name, lista[i]);

                }
            }
        }
        globaloptions.value = []
        globaloptions.value.push(getGlobalVarOptions(globalvarlist));

    }
    const getPackageDetailOptions = (ename, name, pid) => {
        console.log(ename, pid);
        packageApi().searchPackageDetail(
            {
                uid: 1,
                pid: pid,
                pageNum: 1,
                pageSize: 10000,
                name: '',

            })
            .then(res => {
                console.log(res);
                if (res.code == '200') {
                    fieldsoptions.value.push(
                        {
                            EName: ename,
                            Name: name,
                            children: res.data,
                        }
                    )
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        //const data = [];
    }
    const getMessHeaderDetailOptions = (ename, name, pid) => {
        console.log(ename, pid);
        messdetailApi().searchMessDetail(
            {
                uid: 1,
                pid: pid,
                pageNum: 1,
                pageSize: 10000,
                name: '',
                ttype: 'header'

            })
            .then(res => {
                console.log(res);
                if (res.code == '200') {
                    fieldsoptions.value.push(
                        {
                            EName: ename,
                            Name: name,
                            children: res.data,
                        }
                    )
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        //const data = [];
    }
    const getMessBodyDetailOptions = (ename, name, pid) => {
        console.log(ename, pid);
        messdetailApi().searchMessDetail(
            {
                uid: 1,
                pid: pid,
                pageNum: 1,
                pageSize: 10000,
                name: '',
                ttype: 'body'

            })
            .then(res => {
                console.log(res);
                if (res.code == '200') {
                    fieldsoptions.value.push(
                        {
                            EName: ename,
                            Name: name,
                            children: res.data,
                        }
                    )
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        //const data = [];
    }
    const getGlobalVarOptions = (list) => {


        return {
            EName: 'globalVar',
            Name: '临时变量',
            children: list
        }


    }


    const clearFlag = () => {
        state.showFlag.start = false;
        state.showFlag.end = false;
        state.showFlag.pacparse = false;
        state.showFlag.pacencap = false;
        state.showFlag.messheaderparse = false;
        state.showFlag.messheaderencap = false;
        state.showFlag.messbodyparse = false;
        state.showFlag.messbodyencap = false;
        state.showFlag.messtraslate = false;
        state.showFlag.swich = false;
        state.showFlag.spemark = false;
        state.showFlag.timemark = false;
        state.showFlag.timer = false;
        state.showFlag.statistics = false;
        state.showFlag.calc = false;


    }
    // 节点编辑-重置
    const onNodeRefresh = () => {
        state.node.icon = '';
        state.node.name = '';

    };
    // 节点编辑-保存
    const onNodeSubmit = () => {
        nodeFormRef.value.validate((valid: boolean) => {
            if (valid) {
                const nodeModel = state.lf.getNodeModelById(state.node.id);
                nodeModel.updateText(state.proper.name);
                state.tabsActive = '2';
                emit('submit');
                //emit('close');
            } else {
                return false;
            }
        });
    };

    // 开始节点中-网口类-本地地址菜单菜单联动
    const onChangeStartNetworkChoose = (value: any) => {
        console.log(state.properForm.localnetworkID);
        if (state.properForm.localnetworkID == '-1') {
            state.properForm.IP = "";
            state.properForm.Port = "";
        } else {

            for (let i = 0; i < NetworkLocalOptions.value.length; i++) {
                if (NetworkLocalOptions.value[i].ID == state.properForm.localnetworkID) {
                    state.properForm.IP = NetworkLocalOptions.value[i].IP;
                    state.properForm.Port = NetworkLocalOptions.value[i].Port;
                }
            }

        }


    };
    //开始节点，源地址选择联动
    const onChangeStartSNIP = (value: any) => {
        //console.log(state.properForm.localnetworkID);
        if (state.properForm.sourecenetworkID == '-1') {
            state.properForm.sourecenetworkIP = "";

        } else {
            for (let i = 0; i < NetworkOptions.value.length; i++) {
                if (NetworkOptions.value[i].ID == state.properForm.sourecenetworkID) {
                    state.properForm.sourecenetworkIP = NetworkOptions.value[i].IP;

                }
            }

        }


    };
    // 目的节点中-网口类-目的地址菜单菜单联动
    const onChangeEndNetworkChoose = (value: any) => {
        if (state.properForm.localnetworkID == '-1') {
            state.properForm.IPlist = [{IP: '', Port: ''}];
        } else {

            for (let i = 0; i < NetworkLocalOptions.value.length; i++) {
                if (NetworkLocalOptions.value[i].ID == state.properForm.localnetworkID) {

                    state.properForm.IPlist = [{
                        IP: NetworkLocalOptions.value[i].IP,
                        Port: NetworkLocalOptions.value[i].Port
                    }];
                }
            }


        }


    };

    // 开始节点中-串口类-本地地址菜单菜单联动
    const onChangeStartSerialChoose = (value: any) => {
        if (state.properForm.serialID == '-1') {
            state.properForm.BAUD = "";
            state.properForm.SerialNO = "0";

        } else {
            let i = 0;
            for (; i < SerialOptions.value.length; i++) {
                if (SerialOptions.value[i].ID == state.properForm.serialID) {
                    state.properForm.BAUD = SerialOptions.value[i].BAUD;
                    state.properForm.SerialNO = SerialOptions.value[i].SerialNO;
                }
            }

        }


    };
    const onChangeEndSerialChoose = (value: any) => {
        if (state.properForm.serialID == '-1') {
            state.properForm.BAUD = "";
            state.properForm.SerialNO = "0";

        } else {
            let i = 0;
            for (; i < SerialOptions.value.length; i++) {
                if (SerialOptions.value[i].ID == state.properForm.serialID) {
                    state.properForm.BAUD = SerialOptions.value[i].BAUD;
                    state.properForm.SerialNO = SerialOptions.value[i].SerialNO;
                }
            }

        }


    };
    // 扩展表单-重置
    const onExtendRefresh = () => {
        extendFormRef.value.resetFields();
    };
    const onChangeMessTranslateChoose = () => {
        let targetid = 0;
        for (let i = 0; i < MessTraslateOptions.value.length; i++) {
            if (MessTraslateOptions.value[i].ID == state.properForm.transid) {
                targetid = MessTraslateOptions.value[i].targetID;

            }
        }
        getMessTraslateDetail(targetid, state.properForm.transid, 'body');
    }
    const onExtendEditMessTranslate = () => {
        translateDialogRef.value.openDialog(state.node.id, state.properForm.messtranslatedata, fieldsoptions.value, globaloptions.value);

    };
    const onChangeMessheaderEncapChoose = () => {
        getMessTraslateDetail(state.properForm.messheaderencapID, -1, 'header');
    }
    const onExtendEditMessheader = () => {
        //messDialogRef.value.openDialog('header', state.properForm.messheaderencapID);
        console.log(fieldsoptions.value);
        translateDialogRef.value.openDialog(state.node.id, state.properForm.messtranslatedata, fieldsoptions.value, globaloptions.value);
        // translateDialogRef.value.openDialog(state.node.id, state.properForm.messtranslatedata);

    };
    const viewNess = () => {
        if (state.showFlag['messheaderparse']) {
            viewDialogRef.value.openDialog('header', state.properForm.messheaderparseID);
        }
        if (state.showFlag['messbodyencap']) {
            viewDialogRef.value.openDialog('body', state.properForm.messbodyencapID);
        }
        if (state.showFlag['messbodyparse']) {
            viewDialogRef.value.openDialog('body', state.properForm.messbodyparseID);
        }

    };
    const onAddEndIP = () => {
        state.properForm.IPlist.push({IP: '', Port: '0'});
    };
    const onDelEndIP = (k: number) => {
        state.properForm.IPlist.splice(k, 1);
    };
    const onExtendGlobalVar = () => {
        globalEditDialogRef.value.openDialog('add', state.properForm.messheaderparseID);
    };
    const messTranslateModify = (data) => {
        state.properForm.messtranslatedata = data;
    }
    // 扩展表单-保存
    const onExtendSubmit = () => {
        extendFormRef.value.validate((valid: boolean) => {
            if (valid) {
                state.loading.extend = true;
                const nodeModel = state.lf.getNodeModelById(state.node.id);
                nodeModel.setProperties(state.properForm);

                emit('submit');
                setTimeout(() => {
                    state.loading.extend = false;

                    emit('close');
                }, 300);
            } else {
                return false;
            }
        });
    };
    // 图表可视化-初始化
    const initChartsMonitor = () => {
        const myChart = echarts.init(chartsMonitorRef.value);
        const numsOne = [];
        const numsTwo = [];
        for (let i = 0; i < 7; i++) {
            numsOne.push(`${Math.floor(Math.random() * 52 + 10)}:${Math.floor(Math.random() * 52 + 1)}`);
            numsTwo.push(Math.floor(Math.random() * 52 + 1));
        }
        const option = {
            grid: {
                top: 50,
                right: 30,
                bottom: 30,
                left: 50,
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: numsOne,
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    itemStyle: {
                        color: '#289df5',
                        borderColor: '#289df5',
                        areaStyle: {
                            type: 'default',
                            opacity: 0.1,
                        },
                    },
                    data: numsTwo,
                    type: 'line',
                    areaStyle: {},
                },
            ],
        };
        myChart.setOption(option);
        nextTick(() => {
            myChart.resize();
        });
    };

    // 暴露变量
    defineExpose({
        getParentData,
    });
</script>

<style scoped lang="scss">
    .customproper {
        padding-bottom: 20px;
    }

    //解决按钮过多延长至第二排问题
    .btn {
        display: flex;
        justify-content: center;

        :deep() {
            .el-form-item__content {
                margin-left: 30px !important;
            }
        }
    }

    .workflow-drawer-node {
        :deep() {
            .el-tabs {
                box-shadow: unset;
                border: unset;

                .el-tabs__nav {
                    display: flex;
                    width: 100%;

                    .el-tabs__item {
                        flex: 1;
                        padding: unset;
                        text-align: center;

                        &:first-of-type.is-active {
                            border-left-color: transparent;
                        }

                        &:last-of-type.is-active {
                            border-right-color: transparent;
                        }
                    }
                }

                .el-tabs__content {
                    padding: 0;
                    height: calc(100vh - 90px);

                    .el-tab-pane {
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
