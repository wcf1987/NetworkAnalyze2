<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="类型">
                            <el-select v-model="state.ruleForm.Type" placeholder="请选择" clearable class="w100">
                                <el-option label="char" value="char"></el-option>
                                <el-option label="unsigned char" value="unsigned char"></el-option>
                                <el-option label="short" value="char"></el-option>
                                <el-option label="unsigned short" value="unsigned char"></el-option>
                                <el-option label="int" value="char"></el-option>
                                <el-option label="unsigned int" value="unsigned char"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="是否可选">
                            <el-select v-model="state.ruleForm.Optional" placeholder="请选择" clearable class="w100">
                                <el-option label="强制选择" value="强制选择"></el-option>
                                <el-option label="可选项" value="可选项"></el-option>
                                <el-option label="非可选项" value="非可选项"></el-option>


                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="编码">
                            <el-input v-model="state.ruleForm.Encode" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="是否嵌套">
                            <el-select v-model="state.ruleForm.Nest" placeholder="请选择" clearable class="w100">
                                <el-option label="否" value="否"></el-option>
                                <el-option label="单嵌套" value="单嵌套"></el-option>
                                <el-option label="嵌套数组" value="嵌套数组"></el-option>


                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="位数">
                            <el-input v-model="state.ruleForm.Length" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="是否数组">
                            <el-select v-model="state.ruleForm.ArrayOr" placeholder="请选择" clearable class="w100">
                                <el-option label="是" value="是"></el-option>
                                <el-option label="否" value="否"></el-option>


                            </el-select>
                        </el-form-item>
                    </el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="默认值">
                            <el-input v-model="state.ruleForm.DefaultValue" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="用户描述">
                            <el-input v-model="state.ruleForm.describe" type="textarea" placeholder="请输入用户描述"
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
            Optional:'',
            Encode:'',
            Nest:'',
            Length:'',
            ArrayOr:'',
            DefaultValue:'',
            describe: '', // 用户描述
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
        if (type === 'edit') {
            state.ruleForm = row;
            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
        } else {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                userDialogFormRef.value.resetFields();
            });
        }
        state.dialog.isShowDialog = true;
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
        closeDialog();
        emit('refresh');
        // if (state.dialog.type === 'add') { }
    };
    // 初始化部门数据


    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
