<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">




					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="数据标识">
                            <el-select v-model="state.ruleForm.Flag" placeholder="请选择" clearable class="w100">
                                <el-option label="数据域" value="数据域"></el-option>
                                <el-option label="标识域" value="标识域"></el-option>


                            </el-select>
                        </el-form-item>
                    </el-col>

   <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"  v-if="false">
                        <el-form-item label="ID" prop="ID" >
                            <el-input v-model="state.ruleForm.ID" placeholder="请输入名称" clearable ></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="引用名" prop="EName">
                            <el-input v-model="state.ruleForm.EName" placeholder="请输入引用名" clearable :readonly="isReadOnly"> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="简称" prop="ShortName">
                            <el-input v-model="state.ruleForm.ShortName" placeholder="请输入简称" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="类型" :readonly="isReadOnly">

                            <el-select v-model="state.ruleForm.Type" value-key="id" placeholder="请选择" clearable
                                       class="w100">
                                <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"  v-if="false">
                        <el-form-item label="格式内码" prop="TypeCode">
                            <el-input v-model="state.ruleForm.TypeCode" placeholder="请输入数据格式内码" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="位数" prop="Length">
                            <el-input v-model="state.ruleForm.Length" placeholder="请输入位数" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"  v-if="false">
                        <el-form-item label="标准表名" prop="TableName">
                            <el-input v-model="state.ruleForm.TableName" placeholder="请输入标准表名" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"  v-if="false">
                        <el-form-item label="表存储名" prop="TableSaveName">
                            <el-input v-model="state.ruleForm.TableSaveName" placeholder="请输入标准表存储名" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>





                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="说明" prop="Describe">
                            <el-input v-model="state.ruleForm.Describe" placeholder="请输入说明" clearable :readonly="isReadOnly"></el-input>
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
    import {FieldType} from '/@/utils/common';
const options = ref(FieldType);
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

   const isReadOnly=ref(false);
    // 打开弹窗
    const openDialog = (type: string, row: RowUserType) => {
      if (type === 'edit') {
            state.ruleForm = row;
            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
            isReadOnly.value=false;
        }
        if(type=="view"){
            state.ruleForm = row;
            state.dialog.title = '查看';
            state.dialog.submitTxt = '查 看';
            isReadOnly.value=true;
        }
             if(type=="add") {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            isReadOnly.value=false;
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                userDialogFormRef.value.resetFields();
            });
        }
        state.dialog.isShowDialog = true;
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
