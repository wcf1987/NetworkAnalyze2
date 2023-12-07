<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" :rules="state.baseRules" label-width="90px">
                <el-row :gutter="35">

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"  v-if="false">
                        <el-form-item label="ID" prop="ID" >
                            <el-input v-model="state.ruleForm.ID" placeholder="请输入名称" clearable ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
                        <el-form-item label="DFI标识号" prop="DFIID" >
                            <el-input v-model="state.ruleForm.DFIID" placeholder="" clearable :readonly="true"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DFI标识号" prop="DFINO" >
                            <el-input v-model="state.ruleForm.DFINO" placeholder="请输入DFI标识号" clearable :readonly="true"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DFI版本" prop="DFIVersion">
                            <el-input v-model="state.ruleForm.DFIVersion" placeholder="请输入DFI版本" clearable :readonly="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DUI标识号" prop="DUINO">
                            <el-input v-model="state.ruleForm.DUINO" placeholder="请输入DUI标识号" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="DUI版本" prop="DUIVersion">
                            <el-input v-model="state.ruleForm.DUIVersion" placeholder="请输入DUI版本" clearable :readonly="isReadOnly"></el-input>
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
                        <el-form-item label="类型" :readonly="isReadOnly" prop="Type" >

                            <el-select v-model="state.ruleForm.Type" value-key="id" placeholder="请选择" clearable @change="changeType"
                                       class="w100">
                                <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.label"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="格式内码" prop="TypeCode">
                            <el-input v-model="state.ruleForm.TypeCode" placeholder="请输入数据格式内码" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="位数" prop="Length">
                            <el-input v-model="state.ruleForm.Length" placeholder="请输入位数" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="标准表名" prop="TableName">
                            <el-input v-model="state.ruleForm.TableName" placeholder="请输入标准表名" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="表存储名" prop="TableSaveName">
                            <el-input v-model="state.ruleForm.TableSaveName" placeholder="请输入标准表存储名" clearable :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>





                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="说明" prop="Describes">
                            <el-input v-model="state.ruleForm.Describes" placeholder="请输入说明" clearable :readonly="isReadOnly"></el-input>
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
    import {FieldType} from '/@/utils/common';
     import {fieldsdetailApi} from "/@/api/sysmanage/fieldsdetail";
     import {fieldsApi} from "/@/api/sysmanage/fields";
    import {packageApi} from "/@/api/sysmanage/package";
    import {ElMessage} from "element-plus";
    import {useUserInfo} from "/@/stores/userInfo";
    import {checkCodeName, checkInterNum} from "/@/utils/rules";
const options = ref(FieldType);
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
            SerialNO: '',
            BAUD: '',
            DataBit: '',
            StopBit: '',
            FlowControl: '',
            describe: '', // 用户描述
        },
                baseRules: {
            DUINO: [{required: true, message: '请输入正整数DUI', trigger: 'blur',validator: checkInterNum}],
                    Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
                     EName: [{required: true, message: '合法的引用名为字母开头，2-10位', trigger: 'blur',validator: checkCodeName}],

                     Type: [{required: true, message: '请选择类型', trigger: 'change'}],
                     TypeCode: [{required: true, message: '请输入名称', trigger: 'blur'}],
                     Length: [{required: true, message: '位数必须为正整数', trigger: 'blur',validator: checkInterNum}],

        },
        pid: 0,
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });
    const isReadOnly=ref(false);
    // 打开弹窗
    const openDialog = (type: string, pid, row: RowUserType) => {
         state.dialog.type = type;
        state.pid = pid;
                state.dialog.isShowDialog = true;
      if (type === 'edit') {
            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
            isReadOnly.value=false;
               nextTick(() => {
                Object.assign(state.ruleForm, row);
            });
        }
        if(type=="view"){
            state.dialog.title = '查看';
            state.dialog.submitTxt = '查 看';
            isReadOnly.value=true;
               nextTick(() => {
                Object.assign(state.ruleForm, row);
            });
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
             getMenuData();

    };
    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.isShowDialog = false;
    };
    //获取dfi数据
    const getMenuData = () => {
        //state.dialog.isShowDialog = false;
        fieldsApi().getFieldsByID(
            { pid:state.pid,}
            )
                .then(res => {
                    //console.log(res);
                    if (res.code == '200') {
                        state.ruleForm.DFIID=res.data.ID;
                        state.ruleForm.DFINO=res.data.IDNO;
                        state.ruleForm.DFIVersion=res.data.Version;
                        //ElMessage.success("修改成功");
                        //closeDialog();
                        //emit('refresh');
                    } else {
                        //ElMessage.error(res.message);
                    }

                }).catch(err => {

            }).finally(() => {

            });
    };
    // 取消
    const onCancel = () => {
        closeDialog();
    };
     const changeType = (fo) => {
      //  console.log(fo)
        // console.log(options.value);
        for(let temp of options.value){
            if(temp.value==fo){
                state.ruleForm.Length=temp.length;
            }
        }

    };
    // 提交
    const onSubmit = () => {
                 userDialogFormRef.value.validate((valid) => {
           // console.log('123123');
            // 不通过校验
            if (!valid) {

                return ElMessage.error('请确保数据格式填写正确！');
            } else {
        if (state.dialog.type == 'edit') {
            fieldsdetailApi().updateFieldsDetail(
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
            state.ruleForm['DFIID'] = state.pid;
            fieldsdetailApi().addFieldsDetail(
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
