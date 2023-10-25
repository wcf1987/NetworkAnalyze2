<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable=true>
            <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
                        <el-form-item label="ID" prop="ID">
                            <el-input v-model="state.ruleForm.ID" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>


                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable
                                      :readonly="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="插入">


                            <el-cascader v-model="state.ruleForm.SortID" :options="locOptions" :props="props1"
                                         @change="changeLoc"
                                         clearable collapse-tags class="w100" placeholder="插入到选择位置之前">


                            </el-cascader>


                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
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
    import {FieldType} from '/@/utils/common';
    import {messdetailApi} from "/@/api/sysmanage/messdetail";
    import {ElMessage} from "element-plus";
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
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
            Describes: '', // 用户描述
        },
        pid: 0,
        nestid: 0,
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });

    const locOptions = ref();
    const props1 = {
        multiple: false,
        emitPath: false,
        expandTrigger: 'hover',
        value: 'ID',
        label: 'Name',
        checkStrictly: true,
    }
    const isReadOnly = ref(false);
    // 打开弹窗
    const openDialog = (type: string, pid, row: RowUserType) => {
        state.dialog.type = type;
        state.pid = pid;
        if (type === 'edit') {
            state.ruleForm = row;
            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
            isReadOnly.value = false;
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
        getMenuOptions();
        state.dialog.isShowDialog = true;
    };
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
    const changeLoc = (fo) => {
        console.log(fo)
        state.ruleForm.SortID = fo;
        //
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
            state.ruleForm['AuthorID'] = 1;
            state.ruleForm['PID'] = state.pid;
            state.ruleForm['TType'] = 'header';
            state.ruleForm['OutType'] = 'nest';
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

    };
    // 初始化部门数据


    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>
