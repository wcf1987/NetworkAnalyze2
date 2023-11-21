<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable=true>
            <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
                     label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入地址名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="类型" prop="Type">
                            <el-input v-model="state.ruleForm.Type" placeholder="网口" clearable
                                      :readonly=true></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="IP" prop="IP">
                            <el-input v-model="state.ruleForm.IP" placeholder="ip地址" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="端口" prop="Port">
                            <el-input v-model="state.ruleForm.Port" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="协议" prop="Protocol">
                            <el-select v-model="state.ruleForm.Protocol" placeholder="请选择" clearable class="w100">
                                <el-option
                                        v-for="item in NetworkProtocolOptions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"
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
    import {NetworkProtocol} from '/@/utils/common';
    import {addressApi} from '/@/api/sysmanage/address';
    import {ElMessage} from "element-plus";
    import {useUserInfo} from "/@/stores/userInfo";

    const NetworkProtocolOptions = ref(NetworkProtocol);
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);

    // 定义变量内容
    const userDialogFormRef = ref();
    const rules = reactive({
// 普通的校验规则
        name: [
            {required: true, message: '名称不能为空'},
            {min: 1, max: 10, message: '名称长度为1 - 10位'},
        ],
    });
    import {telValidator, checkInterNum, checkIdNum, checkPort, checkIP} from '/@/utils/rules'
    const state = reactive({
        ruleForm: {
            Name: '', // 账户名称
            Type: '', // 用户昵称
            IP: '',
            Port: '',
            Protocol: '',
            describe: '', // 用户描述
        },
        baseRules: {
            Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
            Protocol: [{required: true, message: '请选择协议', trigger: 'change'}],
            IP: [{required: true, message: '请输入IP格式', trigger: 'change',validator:checkIP }],
            Port: [{required: true, message: '端口为数字1-65535', trigger: 'change',validator:checkPort }]
        },

        deptData: [] as DeptTreeType[], // 部门数据
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
                //state.ruleForm = row;
            });
        } else {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            nextTick(() => {
                userDialogFormRef.value.resetFields();
                //state.ruleForm = row;
            });
            state.ruleForm.Type = "网口";
            // 清空表单，此项需加表单验证才能使用



        }

        getMenuData();
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
       // console.log('123123');
        userDialogFormRef.value.validate((valid) => {
           // console.log('123123');
            // 不通过校验
            if (!valid) {

                return ElMessage.error('请确保数据格式填写正确！');
            } else {
                console.log('验证通过');
                if (state.dialog.type == 'edit') {
                    addressApi().updateNetworkInter(
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
                    addressApi().addNetworkInter(
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

                        }).catch(err => {

                    }).finally(() => {

                    });
                }

            }
            // 通过校验
            // 登录逻辑
        });
};

        // if (state.dialog.type === 'add') { }

    // 初始化列表数据
    const getMenuData = () => {

    };

    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
