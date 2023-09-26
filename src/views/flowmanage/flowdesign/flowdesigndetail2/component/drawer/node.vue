<template>
    <div class="workflow-drawer-node">
        <el-tabs type="border-card" v-model="state.tabsActive">
            <!-- 节点编辑 -->
            <el-tab-pane label="节点编辑" name="1">
                <el-scrollbar>
                    <el-form :model="state.node" :rules="state.nodeRules" ref="nodeFormRef" size="default"
                             label-width="80px" class="pt15 pr15 pb15 pl15">
                        <el-form-item label="数据id" prop="id">
                            <el-input v-model="state.node.id" placeholder="请输入数据id" clearable disabled></el-input>
                        </el-form-item>

                        <el-form-item label="类型" prop="type">
                            <el-input v-model="state.node.type" placeholder="请输入类型" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="left坐标" prop="x">
                            <el-input v-model="state.node.x" placeholder="请输入left坐标" clearable disabled></el-input>
                        </el-form-item>
                        <el-form-item label="top坐标" prop="y">
                            <el-input v-model="state.node.y" placeholder="请输入top坐标" clearable disabled></el-input>
                        </el-form-item>

                        <el-form-item label="名称" prop="name">
                            <el-input v-model="state.node.name" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="mb15" @click="onNodeRefresh">
                                <SvgIcon name="ele-RefreshRight"/>
                                重置
                            </el-button>
                            <el-button type="primary" class="mb15" @click="onNodeSubmit">
                                <SvgIcon name="ele-Check"/>
                                保存
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </el-tab-pane>

            <!-- 扩展表单 -->
            <el-tab-pane label="扩展表单" name="2">
                <el-scrollbar>
                    <el-form :model="state.form" ref="extendFormRef" size="default" label-width="80px"
                             class="pt15 pr15 pb15 pl15">

                        <div class="customproper" v-if="state.showFlag['start']">
                            <el-form-item label="地址接口">
                                <el-select v-model="state.properForm.name" placeholder="请选择" clearable class="w100">
                                    <el-option label="网口A" value="网口A"></el-option>
                                    <el-option label="串口B" value="串口B"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="源地址" prop="type">
                                <el-input v-model="state.properForm.souraddr" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="源端口" prop="type">
                                <el-input v-model="state.properForm.sourport" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="本地地址" prop="type">
                                <el-input v-model="state.properForm.taraddr" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="本地端口" prop="type">
                                <el-input v-model="state.properForm.tarport" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>
                        </div>

                        <div class="customproper" v-if="state.showFlag['end']">
                            <el-form-item label="地址接口">
                                <el-select v-model="state.properForm.name" placeholder="请选择" clearable class="w100">
                                    <el-option label="网口A" value="网口A"></el-option>
                                    <el-option label="串口B" value="串口B"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="目的地址" prop="type">
                                <el-input v-model="state.properForm.taraddr" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="目的端口" prop="type">
                                <el-input v-model="state.properForm.tarport" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>
                        </div>


                        <div class="customproper" v-if="state.showFlag['pacparse']">
                            <el-form-item label="头部选择">
                                <el-select v-model="state.properForm.name" placeholder="请选择" clearable class="w100">
                                    <el-option label="封装A" value="封装A"></el-option>
                                    <el-option label="应用A" value="应用A"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="解析函数" prop="type">
                                <el-input v-model="state.properForm.taraddr" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>

                        </div>

                        <div class="customproper" v-if="state.showFlag['pacencap']">
                            <el-form-item label="头部选择">
                                <el-select v-model="state.properForm.name" placeholder="请选择" clearable class="w100">
                                    <el-option label="封装A" value="封装A"></el-option>
                                    <el-option label="应用A" value="应用A"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="添加函数" prop="type">
                                <el-input v-model="state.properForm.taraddr" placeholder="请输入类型" clearable></el-input>
                            </el-form-item>

                        </div>

                        <div class="customproper" v-if="state.showFlag['messparse']">
                            <el-form-item label="消息选择">
                                <el-select v-model="state.properForm.name" placeholder="请选择" clearable class="w100">
                                    <el-option label="消息体A" value="消息体A"></el-option>
                                    <el-option label="消息体B" value="消息体B"></el-option>
                                </el-select>
                            </el-form-item>



                        </div>



                           <div class="customproper" v-if="state.showFlag['messtraslate']">
                            <el-form-item label="转化规则">
                                <el-select v-model="state.properForm.name" placeholder="请选择" clearable class="w100">
                                    <el-option label="消息转化规则A" value="消息转化规则A"></el-option>
                                    <el-option label="消息转化规则B" value="消息转化规则B"></el-option>
                                </el-select>
                            </el-form-item>



                        </div>

                        <el-form-item>


                            <el-button class="mb15" @click="onExtendRefresh">
                                <SvgIcon name="ele-RefreshRight"/>
                                重置
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
    </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawerNode">
    import {nextTick, reactive, ref} from 'vue';
    import {ElMessage} from 'element-plus';
    import * as echarts from 'echarts';

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['submit', 'close']);

    // 定义变量内容
    const nodeFormRef = ref();
    const extendFormRef = ref();
    const chartsMonitorRef = ref();


    const state = reactive<WorkflowDrawerNodeState>({
        node: {},
        nodeRules: {
            name: [{required: true, message: '请输入名称', trigger: 'blur'}],
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

    // 获取父组件数据
    const getParentData = (data: object) => {
        clearFlag();
        state.tabsActive = '1';
        state.node = data;
        state.showFlag[state.node["type"]] = true;
        initChartsMonitor();
    };
    const clearFlag = () => {
        state.showFlag.start = false;
        state.showFlag.end = false;
        state.showFlag.pacparse = false;
        state.showFlag.pacencap = false;
        state.showFlag.messparse = false;
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
                emit('submit', state.node);
                emit('close');
            } else {
                return false;
            }
        });
    };
    // 扩展表单-重置
    const onExtendRefresh = () => {
        extendFormRef.value.resetFields();
    };
    // 扩展表单-保存
    const onExtendSubmit = () => {
        extendFormRef.value.validate((valid: boolean) => {
            if (valid) {
                state.loading.extend = true;
                setTimeout(() => {
                    state.loading.extend = false;
                    ElMessage.success('保存成功');
                    emit('close');
                }, 1000);
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
