<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户名称"  prop="userName">
							<el-input :readonly="isEdit" v-model="state.ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称" prop="userNickname">
							<el-input v-model="state.ruleForm.userNickname" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联角色" prop="roleSign">
							<el-select v-model="state.ruleForm.roleSign" placeholder="请选择" clearable class="w100">
								    <el-option
                                        v-for="item in RoleOptions"
                                        :key="item.id"
                                        :label="item.roleName"
                                        :value="item.id"
                                />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
						<el-form-item label="性别">
							<el-select v-model="state.ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option label="男" value="男"></el-option>
								<el-option label="女" value="女"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户密码" prop="password">
							<el-input v-model="state.ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
						<el-form-item label="账户过期">
							<el-date-picker v-model="state.ruleForm.overdueTime" type="date" placeholder="请选择" class="w100"> </el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态" prop="status">
							<el-switch v-model="state.ruleForm.status" active-value="true"   inactive-value="false" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述" prop="describes">
							<el-input v-model="state.ruleForm.describes" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
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
import { nextTick,reactive, ref } from 'vue';
    import {ElMessage} from "element-plus";

import {userManageApi} from "/@/api/sysadmin/usermanage";
import {messbodyApi} from "/@/api/sysmanage/messbody";
import {roleManageApi} from "/@/api/sysadmin/rolemanage";
import {useUserInfo} from "/@/stores/userInfo";
const RoleOptions=ref();
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		userName: '', // 账户名称
		userNickname: '', // 用户昵称
		roleSign: '', // 关联角色

		phone: '', // 手机号
		email: '', // 邮箱
		sex: '', // 性别
		password: '', // 账户密码
		overdueTime: '', // 账户过期
		status: true, // 用户状态
		describe: '', // 用户描述
	},
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});
const getMenuData = () => {
      roleManageApi().search(
            {
                uid: 1,
                pageNum: 1,
                pageSize: 1000,
                name: '',
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    RoleOptions.value = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });



    };
// 打开弹窗
const isEdit=ref(false);
const openDialog = (type: string, row: RowUserType) => {
	state.dialog.type = type;
		state.dialog.isShowDialog = true;
	if (type === 'edit') {
		isEdit.value=true;

		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
		 nextTick(() => {
                Object.assign(state.ruleForm, row);

            });
	} else {
		isEdit.value=false;
		state.dialog.title = '新增用户';
		state.dialog.submitTxt = '新 增';
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
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
 if (state.dialog.type == 'edit') {
            userManageApi().update(
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
            userManageApi().add(
                state.ruleForm
            )
                .then(res => {
                    //console.log(res);
                    if (res.code == '200') {

                        ElMessage.success("添加成功");
                        closeDialog();
                       emit('refresh');
                    }

        else
            {
                ElMessage.error(res.message);
            }

        }
    )
    .catch(err => {

    }).finally(() => {

    });
    }






};


// 暴露变量
defineExpose({
	openDialog,
});
</script>
