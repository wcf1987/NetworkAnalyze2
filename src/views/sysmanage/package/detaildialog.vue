<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
                     label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="名称" prop="Name">
                            <el-input v-model="state.ruleForm.Name" @input="nameChange" placeholder="请输入名称"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="引用名" prop="EName">
                            <el-input v-model="state.ruleForm.EName" placeholder="请输入名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="类型" prop="Type">
                            <el-select v-model="state.ruleForm.Type" placeholder="请选择" clearable class="w100"
                                       @change="changeType">
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.value"
                                />

                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="位数" prop="Length">
                            <el-input v-model="state.ruleForm.Length" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="是否数组" prop="ArrayOr">
                            <el-select v-model="state.ruleForm.ArrayOr" placeholder="请选择" clearable class="w100">
                                <el-option label="是" value="是"></el-option>
                                <el-option label="否" value="否"></el-option>


                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="默认值" prop="DefaultValue">
                            <el-input v-model="state.ruleForm.DefaultValue" placeholder="" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="插入" prop="SortID">


                            <el-select v-model="state.ruleForm.SortID" value-key="id" placeholder="插入到选择位置之前" clearable
                                       class="w100">
                                <el-option
                                        v-for="item in sortOptions"
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
    import {FieldType} from '/@/utils/common';
    import {packageApi} from "/@/api/sysmanage/package";
    import {ElMessage} from "element-plus";
    import {useUserInfo} from "/@/stores/userInfo";
    import {checkInterNum} from "/@/utils/rules";

    const typeOptions = ref(FieldType);
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const sortOptions = ref();
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

        },
        baseRules: {
            Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
            //EName: [{required: true, message: '请填写合法的引用名（字母开头，允许2-10位）', trigger: 'change', validator: checkCodeName}],
            Type: [{required: true, message: '请选择类型', trigger: 'change'}],
            Length: [{required: true, message: '请输入数字', trigger: 'change', validator: checkInterNum}],
            ArrayOr: [{required: true, message: '请选择是否数组', trigger: 'change'}],


        },
        pid: 0,
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });

    // 打开弹窗
    const openDialog = (type: string, pid, row: RowUserType) => {
        state.dialog.type = type;
        state.pid = pid;
        state.dialog.isShowDialog = true;
        if (type === 'edit') {

            state.dialog.title = '修改';
            state.dialog.submitTxt = '修 改';
            nextTick(() => {
                Object.assign(state.ruleForm, row);
            });
        } else {
            state.dialog.title = '新增';
            state.dialog.submitTxt = '新 增';
            // 清空表单，此项需加表单验证才能使用
            nextTick(() => {
                userDialogFormRef.value.resetFields();
            });
        }
        getMenuOptions();
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
    const nameChange = (value) => {
        state.ruleForm.EName = state.ruleForm.Name;
    }
    //联动类型选择，更改位数
    const changeType = (fo) => {
        // console.log(fo)
        // console.log(typeOptions.value);
        for (let temp of typeOptions.value) {
            if (temp.value == fo) {
                state.ruleForm.Length = temp.length;
            }
        }

    };
    //获取位置信息
    const getMenuOptions = () => {

        packageApi().searchPackageDetail(
            {


                uid: 1,
                pid: state.pid,
                pageNum: 1,
                pageSize: 1000,
                name: '',

            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    sortOptions.value = res.data;
                    //locOptions.value.push({ID:-1,Name:'最后'});
                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
    }
    // 提交
    const onSubmit = () => {
        userDialogFormRef.value.validate((valid) => {
            // console.log('123123');
            // 不通过校验
            if (!valid) {

                return ElMessage.error('请确保数据格式填写正确！');
            } else {
                if (state.dialog.type == 'edit') {
                    packageApi().updatePackageDetail(
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
                    state.ruleForm['packID'] = state.pid;
                    console.log(state.ruleForm);
                    packageApi().addPackageDetail(
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
