<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable=true>
            <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
                     label-width="90px">
                <el-row :gutter="35">


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="数据标识" prop="Flag">
                            <el-select v-model="state.ruleForm.Flag" value-key="id" placeholder="请选择" clearable
                                       class="w100">
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
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable  @input="nameChange"
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
                        <el-form-item label="类型" :readonly="state.bitOnly" prop="Type">

                            <el-select v-model="state.ruleForm.Type" value-key="id" placeholder="请选择" clearable
                                       class="w100" :disabled=state.bitOnly  @change="changeType">
                                <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.label"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
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
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
                        <el-form-item label="标准表名" prop="TableName">
                            <el-input v-model="state.ruleForm.TableName" placeholder="请输入标准表名" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
                        <el-form-item label="表存储名" prop="TableSaveName">
                            <el-input v-model="state.ruleForm.TableSaveName" placeholder="请输入标准表存储名" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="插入" prop="OrderID">


                            <el-cascader v-model="state.ruleForm.OrderID" :options="locOptions" :props="props1"
                                         @change="changeLoc"
                                         clearable collapse-tags class="w100" placeholder="插入到选择位置之前">


                            </el-cascader>


                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="说明" prop="Describes">
                            <el-input v-model="state.ruleForm.Describes" placeholder="请输入说明" clearable
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
    import {DataFlag, FieldType} from '/@/utils/common';
    import {messdetailApi} from "/@/api/sysmanage/messdetail";
    import {ElMessage} from "element-plus";
    import {useUserInfo} from "/@/stores/userInfo";
    import {checkCodeName, checkInterNum} from "/@/utils/rules";

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const options = ref(FieldType);
    const dataFlagOptions = ref(DataFlag);
    const locOptions = ref();
    const props1 = {
        multiple: false,
        emitPath: false,
        expandTrigger: 'hover',
        value: 'ID',
        label: 'Name',
        checkStrictly: true,
    }
    // 定义变量内容
    const userDialogFormRef = ref();

    const state = reactive({
        ruleForm: {
            Name: '', // 账户名称
            Type: '', // 用户昵称
        },
        baseRules: {
            Flag: [{required: true, message: '请选择数据标识', trigger: 'blur'}],
            Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
            EName: [{required: true, message: '合法的引用名为字母开头，2-10位', trigger: 'blur', validator: checkCodeName}],

            Type: [{required: true, message: '请选择类型', trigger: 'change'}],
            TypeCode: [{required: true, message: '请输入名称', trigger: 'blur'}],
            Length: [{required: true, message: '位数必须为正整数', trigger: 'blur', validator: checkInterNum}],


        },
        pid: 0,
        nestid: 0,
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
        bitOnly: false,
    });
   const nameChange=(value)=>{
        state.ruleForm.EName=state.ruleForm.Name;
    }
    const isReadOnly = ref(false);
    // 打开弹窗
    const openDialog = (type: string, pid, row: RowUserType, bitype) => {
        state.dialog.type = type;
        state.pid = pid;
        state.dialog.isShowDialog = true;
        //console.log(state.bitOnly);

        if (type === 'edit') {

            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
            isReadOnly.value = false;
            nextTick(() => {
                Object.assign(state.ruleForm, row);
            });
        }
        if (type == "view") {

            state.dialog.title = '查看';
            state.dialog.submitTxt = '查 看';
            isReadOnly.value = true;
            nextTick(() => {
                Object.assign(state.ruleForm, row);
            });
        }
        if (type == "add") {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            isReadOnly.value = false;
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                userDialogFormRef.value.resetFields();

            });

        }
         if (bitype == "S" || bitype == "K" || bitype == "Z") {
                state.bitOnly = true;
                state.ruleForm.Type = 'bit'
            }
        getMenuOptions();

    };

    //获取位置信息
    const getMenuOptions = () => {

        messdetailApi().searchMessDetail(
            {
                uid: 1,
                pid: state.pid,
                pageNum: 1,
                pageSize: 1000,
                name: '',
                ttype: 'header'
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    locOptions.value = res.data;
                    //locOptions.value.push({ID:-1,Name:'最后'});
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
    }
   //联动类型选择，更改位数
     const changeType = (fo) => {
       // console.log(fo)
        // console.log(options.value);
        for(let temp of options.value){
            if(temp.value==fo){
                state.ruleForm.Length=temp.length;
            }
        }

    };
    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
        closeDialog();
    };
    const changeLoc = (fo) => {
        console.log(fo)
        state.ruleForm.SortID = fo;
        //
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
                    messdetailApi().updateMessDetail(
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


                    state.ruleForm['PID'] = state.pid;
                    state.ruleForm['TType'] = 'header';
                    state.ruleForm['OutType'] = 'custom';
                    messdetailApi().addMessDetail(
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

            }
            ;
            // 初始化部门数据
        });
    };

    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
