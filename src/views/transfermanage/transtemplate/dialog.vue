<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default" label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="类型" prop="Type">
                            <el-select v-model="state.ruleForm.Type" placeholder="请选择" clearable class="w100" :disabled="state.dialog.edit">
                                <el-option label="透明传输" value="透明传输"></el-option>
                                <el-option label="混合编排" value="混合编排"></el-option>
                                <el-option label="指定流程" value="指定流程"></el-option>
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
    import {transtemplateApi} from "/@/api/transmanage/transtemplate";
    import {ElMessage} from "element-plus";

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
    const state = reactive({
        ruleForm: {
            Name: '', // 账户名称
            Type: '', // 用户昵称
            Describes:'',//描述
            ClassfyID:'',

        },
                baseRules: {
            Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
            Type: [{required: true, message: '请选择类型', trigger: 'change'}],
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
            pid:'',
            edit:false,
        },
    });

    // 打开弹窗
    const openDialog = (type: string, row: RowUserType,pid) => {
        state.dialog.type = type;
        state.dialog.isShowDialog = true;

        if (type === 'edit') {
            state.dialog.edit=true;
            state.dialog.title = '修改模板';
            state.dialog.submitTxt = '修 改';
               nextTick(() => {
                Object.assign(state.ruleForm, row);
            });
        } else {
             state.dialog.edit=false;
            state.dialog.title = '新增模板';
            state.dialog.submitTxt = '新 增';
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                userDialogFormRef.value.resetFields();
                state.ruleForm.ClassfyID=pid;
            });

        }

        //getMenuData();
    };
    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
        closeDialog();
    };
        import {useUserInfo} from "/@/stores/userInfo";
    // 提交
    const onSubmit = () => {
                 userDialogFormRef.value.validate((valid) => {
           // console.log('123123');
            // 不通过校验
            if (!valid) {

                return ElMessage.error('请确保数据格式填写正确！');
            } else {
        if (state.dialog.type == 'edit') {
            transtemplateApi().updateFlow(
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

            state.ruleForm['FlowJson'] = "%7B%22nodes%22%3A%5B%7B%22id%22%3A%22cbdc2694-8615-4619-aa18-513d152a3d0d%22%2C%22type%22%3A%22start%22%2C%22x%22%3A420%2C%22y%22%3A60%2C%22properties%22%3A%7B%22interfacetype%22%3A%22%E6%97%A0%22%2C%22serialID%22%3A%22%22%2C%22sourecenetworkID%22%3A%22%22%2C%22localnetworkID%22%3A%22%22%2C%22ip%22%3A%22%22%2C%22port%22%3A%22%22%7D%2C%22text%22%3A%7B%22x%22%3A420%2C%22y%22%3A60%2C%22value%22%3A%22%E5%BC%80%E5%A7%8B%E8%8A%82%E7%82%B9%22%7D%7D%2C%7B%22id%22%3A%22fb6c1f7a-4962-480a-8fbc-f420d7cf1dd2%22%2C%22type%22%3A%22end%22%2C%22x%22%3A420%2C%22y%22%3A460%2C%22properties%22%3A%7B%22interfacetype%22%3A%22%E6%97%A0%22%2C%22serialID%22%3A%22%22%2C%22sourecenetworkID%22%3A%22%22%2C%22localnetworkID%22%3A%22%22%2C%22ip%22%3A%22%22%2C%22port%22%3A%22%22%7D%2C%22text%22%3A%7B%22x%22%3A420%2C%22y%22%3A460%2C%22value%22%3A%22%E7%9B%AE%E7%9A%84%E8%8A%82%E7%82%B9%22%7D%7D%5D%2C%22edges%22%3A%5B%5D%7D";
            transtemplateApi().addFlow(
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
    };
    // 初始化部门数据

        });
};
    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
