<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">

                   <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">

                        <el-form-item label="导入字段" prop="source">

                            <el-select v-model="state.ruleForm.sourceDFI" value-key="id" placeholder="请先选择DFI" clearable class="w100">
                                   <el-option label="国际标准ISK" value="国际标准ISK"></el-option>
                                <el-option label="海洋标准KF" value="海洋标准KF"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">

                        <el-form-item label="二次查询" prop="source">


                             <el-select v-model="state.ruleForm.sourceDUI" value-key="id" placeholder="请后选择DUI" clearable class="w100">
                                 <el-option label="版本号" value="版本号"></el-option>
                                <el-option label="服务类型" value="服务类型"></el-option>
                                 <el-option label="序号" value="序号"></el-option>
                                <el-option label="确认号" value="确认号"></el-option>
                                 <el-option label="数据偏移" value="数据偏移"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="数据标识">
                            <el-select v-model="state.ruleForm.Flag" value-key="id" placeholder="请选择" clearable class="w100">
                               <el-option
                                        v-for="item in dataFlagOptions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
                        <el-form-item label="ID" prop="ID">
                            <el-input v-model="state.ruleForm.ID" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DFI标识号" prop="DFINO">
                            <el-input v-model="state.ruleForm.DFINO" placeholder="请输入DFI标识号" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DFI版本" prop="DFIVersion">
                            <el-input v-model="state.ruleForm.DFIVersion" placeholder="请输入DFI版本" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DUI标识号" prop="DUINO">
                            <el-input v-model="state.ruleForm.DUINO" placeholder="请输入DUI标识号" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DUI版本" prop="DUIVersion">
                            <el-input v-model="state.ruleForm.DUIVersion" placeholder="请输入DUI版本" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="引用名" prop="EName">
                            <el-input v-model="state.ruleForm.EName" placeholder="请输入引用名" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="简称" prop="ShortName">
                            <el-input v-model="state.ruleForm.ShortName" placeholder="请输入简称" clearable
                                      :readonly="isReadOnly"></el-input>
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
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="格式内码" prop="TypeCode">
                            <el-input v-model="state.ruleForm.TypeCode" placeholder="请输入数据格式内码" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="位数" prop="Length">
                            <el-input v-model="state.ruleForm.Length" placeholder="请输入位数" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="标准表名" prop="TableName">
                            <el-input v-model="state.ruleForm.TableName" placeholder="请输入标准表名" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="表存储名" prop="TableSaveName">
                            <el-input v-model="state.ruleForm.TableSaveName" placeholder="请输入标准表存储名" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="说明" prop="Describe">
                            <el-input v-model="state.ruleForm.Describe" placeholder="请输入说明" clearable
                                      :readonly="isReadOnly"></el-input>
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

    import {FieldType,DataFlag} from '/@/utils/common';
const options = ref(FieldType);
const dataFlagOptions = ref(DataFlag);

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);

    // 定义变量内容
    const userDialogFormRef = ref();

    const DUIprops = {
        multiple: false,
        expandTrigger: 'hover',
        value: 'ename',
        label: 'name'
    }
    const DUIoptions = [
        {
            ename: "1001", name: '1001(国际标准ISK)',
            children: [
                {
                    ename: "201", name: '201(版本号)'


                },
                {
                    ename: "202", name: '202(服务类型)'


                },
                {
                    ename: "203", name: '203(序号)'


                },
                {
                    ename: "204", name: '204(校验和)'


                },
            ]
        },
        {
            ename: "1002", name: '1002(海洋标准KF)',
            children: [
               {
                    ename: "321", name: '321(经度)'


                },
                {
                    ename: "323", name: '323(纬度)'


                },
                {
                    ename: "325", name: '325(海里数)'


                },
                {
                    ename: "401", name: '401(深度)'


                },
            ]
        },
    ]
    const changeSourceInput = (fo) => {

            state.ruleForm.DFINO= fo[0];
            state.ruleForm.DFIVersion= '1.02';
            state.ruleForm.DUINO=fo[1];
            state.ruleForm.DUIVersion= '2.1';
            state.ruleForm.Name= 'test';
            state.ruleForm.EName= 't1';
        state.ruleForm.ShortName= 't2';
        state.ruleForm.Type='t3';
        state.ruleForm.TypeCode='t4';
        state.ruleForm.Length='t5';
        state.ruleForm.TableName= 't6';
        state.ruleForm.TableSaveName='t7';
        state.ruleForm.Describe= 't8';


    }
    const rules = reactive({
// 普通的校验规则
        name: [
            {required: true, message: '名称不能为空'},
            {min: 1, max: 10, message: '名称长度为1 - 10位'},
        ],
    });
    const state = reactive({
        ruleForm: {

            DFINO: '',
            DFIVersion: '',
            DUINO: '',
            DUIVersion: '',
            Name: '',
            EName: '',
        ShortName: '',
        Type: '',
        TypeCode: '',
        Length: '',
        TableName: '',
        TableSaveName: '',
        Describe: '',
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });
    const isReadOnly = ref(false);
    // 打开弹窗
    const openDialog = (type: string, row: RowUserType) => {

        state.dialog.title = '导入字段';
        state.dialog.submitTxt = '确 定';
        isReadOnly.value = true;
        // 清空表单，此项需加表单验证才能使用
        nextTick(() => {
            userDialogFormRef.value.resetFields();
        });

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
        emit('refresh', '1');
        // if (state.dialog.type === 'add') { }
    };
    // 初始化部门数据


    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
