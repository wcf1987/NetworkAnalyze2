<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default" label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="分发名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="流程名称" prop="FlowID">
                            <el-select v-model="state.ruleForm.FlowID" placeholder="请选择" clearable class="w100">
                                <el-option
                                        v-for="item in FlowOptions"
                                        :key="item.ID"
                                        :label="item.Name"
                                        :value="item.ID"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="网关集合" prop="GatewayIDsDe">
                            <el-select v-model="state.ruleForm.GatewayIDsDe" placeholder="请选择" clearable class="w100"
                                       multiple>
                                <el-option
                                        v-for="item in GatewayOptions"
                                        :key="item.ID"
                                        :label="item.Name"
                                        :value="item.ID"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="用户描述" prop="Describes">
                            <el-input v-model="state.ruleForm.Describes" type="textarea" placeholder="请输入用户描述"
                                      maxlength="150"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="systemUserDialog">
    import {nextTick, reactive, ref} from 'vue';
    import {flowdistributionApi} from "/@/api/distribution/flowdistribution";
    import {ElMessage} from "element-plus";
    import {flowApi} from "/@/api/flowmanage/flow";
    import {gatewayApi} from "/@/api/distribution/gateway";
    import {useUserInfo} from "/@/stores/userInfo";

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh', 'editdetail']);

    // 定义变量内容
    const userDialogFormRef = ref();
    const rules = reactive({
// 普通的校验规则
        name: [
            {required: true, message: '名称不能为空'},
            {min: 1, max: 10, message: '名称长度为1 - 10位'},
        ],
    });
    const state = reactive({
        ruleForm: {
            Name: '', // 账户名称

        },
                baseRules: {
            Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
            FlowID: [{required: true, message: '请选择流程', trigger: 'change'}],
                    GatewayIDsDe: [{required: true, message: '请选择网关', trigger: 'change'}],
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });

    // 打开弹窗
    const openDialog = (type: string, row: RowUserType) => {
    state.dialog.isShowDialog = true;
        state.dialog.type = type;
        if (type === 'edit') {

            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';

               nextTick(() => {
                Object.assign(state.ruleForm, row);
                            state.ruleForm.GatewayIDsDe = JSON.parse(state.ruleForm.GatewayIDs);
            });
        } else {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                userDialogFormRef.value.resetFields();
            });
        }

        getMenuData();
    };
    const GatewayOptions = ref();
    const FlowOptions = ref();
    const getMenuData = () => {
        flowApi().searchFlow(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    FlowOptions.value = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        gatewayApi().searchGateway(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    GatewayOptions.value = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
    };

    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
        closeDialog();
    };
    // 提交
    const onSubmit = () => {
                 userDialogFormRef.value.validate((valid) => {
           // console.log('123123');
            // 不通过校验
            if (!valid) {

                return ElMessage.error('请确保数据格式填写正确！');
            } else {
        state.ruleForm.GatewayIDs = JSON.stringify(state.ruleForm.GatewayIDsDe);


        if (state.dialog.type == 'edit') {
            flowdistributionApi().updateFlowDistribution(
                state.ruleForm
            )
                .then(res => {
                    //console.log(res);
                    if (res.code == '200') {

                        ElMessage.success("修改成功");
                        closeDialog();
                        emit('refresh');
                    } else {
                        ElMessage.error(res.message);
                    }

                }).catch(err => {

            }).finally(() => {

            });
        }
        if (state.dialog.type == 'add') {
            const stores = useUserInfo();
            state.ruleForm['AuthorID'] = stores.userInfos.id
            flowdistributionApi().addFlowDistribution(
                state.ruleForm
            )
                .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success("添加成功");
                            closeDialog();
                            emit('refresh');
                        } else {
                            ElMessage.error(res.message);
                        }

                    }
                )
                .catch(err => {

                }).finally(() => {

            });
        }
        // if (state.dialog.type === 'add') { }
    };
    // 初始化部门数据
        });
};

    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
