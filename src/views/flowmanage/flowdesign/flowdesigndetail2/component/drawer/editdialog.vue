<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="转换名称" prop="name">
                            <el-input v-model="state.ruleForm.TName" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="目的字段">
                            <el-input v-model="state.ruleForm.Name" placeholder="" clearable
                                      readonly='true'></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="转换模式">
                            <el-select v-model="state.ruleForm.Optional" placeholder="请选择" clearable class="w100">
                                <el-option label="默认值" value="默认值"></el-option>
                                <el-option label="直接转换" value="直接转换"></el-option>
                                <el-option label="系统函数" value="系统函数"></el-option>
                                <el-option label="自定义转换计算" value="自定义转换计算"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                            v-if="state.ruleForm.Optional=='默认值'">
                        <el-form-item label="默认值">
                            <el-input v-model="state.ruleForm.Transrule" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                            v-if="state.ruleForm.Optional=='直接转换'">

                        <el-form-item label="源字段" :label-width="formLabelWidth" prop="source">

                            <el-cascader v-model="state.ruleForm.Transrule" :options=state.fd :props="props1"
                                         clearable
                                         style="width: 300px; " collapse-tags/>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                            v-if="state.ruleForm.Optional=='系统函数'">
                        <el-form-item label="转换函数" prop="funcrule">

                            <el-cascader v-model="state.ruleForm.funcrule" :options="funcoptions" :props="props22"
                                         clearable @change="changeSourceInput22"
                                         collapse-tags/>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                            v-if="state.ruleForm.Optional=='系统函数'">

                        <el-form-item label="源字段" prop="source">

                            <el-cascader v-model="state.ruleForm.SourceData" :options=state.fd :props="props21"
                                         @change="changeSourceInput24"
                                         clearable
                                         style="width: 300px; " collapse-tags/>

                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20"
                            v-if="state.ruleForm.Optional=='系统函数'">

                        <el-form-item label="转换公式" prop="rulestr" clearable>
                            <el-input
                                    :autosize="{ minRows: 2, maxRows: 10 }"
                                    type="textarea"
                                    placeholder="请输入转换公式"
                                    v-model="state.ruleForm.Transrule" autocomplete="off"/>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                            v-if="state.ruleForm.Optional=='自定义转换计算'">

                        <el-form-item label="源字段" prop="source">

                            <el-cascader v-model="state.ruleForm.SourceData" :options=state.fd :props="props21"
                                         @change="changeSourceInput21"
                                         clearable
                                         style="width: 300px; " collapse-tags/>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"
                            v-if="state.ruleForm.Optional=='自定义转换计算'">

                        <el-form-item label="全局变量" prop="source">

                            <el-cascader v-model="state.ruleForm.GlobalData" :options=state.gd :props="props21"
                                         @change="changeSourceInput23"
                                         clearable
                                         style="width: 300px; " collapse-tags/>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20"
                            v-if="state.ruleForm.Optional=='自定义转换计算'">

                        <el-form-item label="转换公式" prop="rulestr" clearable>
                            <el-input
                                    :autosize="{ minRows: 2, maxRows: 10 }"
                                    type="textarea"
                                    placeholder="请输入转换公式"
                                    v-model="state.ruleForm.Transrule" autocomplete="off"/>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="用户描述">
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

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh', 'update']);

    // 定义变量内容
    const userDialogFormRef = ref();
    const rules = reactive({
// 普通的校验规则
        name: [
            {required: true, message: '名称不能为空'},
            {min: 1, max: 10, message: '名称长度为1 - 10位'},
        ],
    });


    const props1 = {
        multiple: false,
        expandTrigger: 'hover',
        value: 'EName',
        label: 'Name'
    }
    const props23 = {
        multiple: false,
        expandTrigger: 'hover',
        value: 'EName',
        label: 'Name'
    }
    const props21 = {
        multiple: true,
        expandTrigger: 'hover',
        value: 'EName',
        label: 'Name'
    }
    const props22 = {
        expandTrigger: 'hover',
        emitPath: 'false',
        value: 'name',
        label: 'name'
    }
    const props32 = {
        multiple: true,
        expandTrigger: 'hover',

        value: 'name',
        label: 'name'
    }
    const funcoptions = ref([
        {name: 'Calc()'},
        {name: 'Substr()'},
        {name: 'Splice()'},
        {name: 'Push()'},
        {name: 'Add()'},
        {name: 'Encode()'},
    ])
    const state = reactive({
        ruleForm: {
            Name: '', // 账户名称
            TargetName: '',
            Type: '', // 用户昵称
            Optional: '',
            Transrule: '',
            SourceData: '',
            funcrule: '',
            describe: '', // 用户描述
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });
    const changeSourceInput = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        for (i = 0; i < fo.length; i++) {
            tempstr = tempstr + fo[i]
        }
        state.value.ruleForm.Transrule = [tempstr];


    }
    const changeSourceInput21 = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        if (fo.length > 0) {
            tempstr = fo[fo.length - 1].join('.') + '\n'
        }


        tempstr = tempstr.replaceAll(',', '.')
        state.ruleForm.Transrule = state.ruleForm.Transrule + tempstr;


    }
    const changeSourceInput23 = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        if (fo.length > 0) {
            tempstr = fo[fo.length - 1].join('.') + '\n'
        }
        tempstr = tempstr.replaceAll(',', '.')
        state.ruleForm.Transrule = state.ruleForm.Transrule + tempstr;


    }
    const changeSourceInput24 = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        if (fo.length > 0) {
            tempstr = fo[fo.length - 1].join('.') + '\n'
        }
        tempstr = tempstr.replaceAll(',', '.')
        state.ruleForm.Transrule = state.ruleForm.Transrule + tempstr;


    }
    const changeSourceInput22 = (fo) => {
        console.log(fo)

        state.ruleForm.Transrule = state.ruleForm.Transrule+fo[0];


    }
    const changeSourceInput32 = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        for (i = 0; i < fo.length; i++) {
            tempstr = tempstr + fo[i] + '\n'
        }
        state.ruleForm.Transrule = tempstr;


    }
    // 打开弹窗
    const openDialog = (type: string, row: RowUserType, fd, gd) => {
        state.fd = fd;
        state.gd = gd;
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
        emit('update', state.ruleForm);
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
