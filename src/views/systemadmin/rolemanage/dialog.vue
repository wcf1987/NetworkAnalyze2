<template>
    <div class="system-role-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="角色名称">
                            <el-input v-model="state.ruleForm.roleName" placeholder="请输入角色名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="角色标识">
                            <template #label>
                                <el-tooltip effect="dark" content="用于 `router/route.ts` meta.roles"
                                            placement="top-start">
                                    <span>角色标识</span>
                                </el-tooltip>
                            </template>
                            <el-input v-model="state.ruleForm.roleSign" placeholder="请输入角色标识" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
                        <el-form-item label="排序">
                            <el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right"
                                             placeholder="请输入排序" class="w100"/>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="角色状态">
                            <el-switch v-model="state.ruleForm.status" active-value="true" inactive-value="false"
                                       inline-prompt active-text="启" inactive-text="禁"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="角色描述">
                            <el-input v-model="state.ruleForm.describes" type="textarea" placeholder="请输入角色描述"
                                      maxlength="150"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="菜单权限">
                            <el-tree :data="state.menuData" :props="state.menuProps" show-checkbox
                                     class="menu-data-tree"/>
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

<script setup lang="ts" name="systemRoleDialog">
    import {reactive, ref} from 'vue';
    import {roleManageApi} from "/@/api/sysadmin/rolemanage";
    import {ElMessage} from "element-plus";
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);

    // 定义变量内容
    const roleDialogFormRef = ref();
    const state = reactive({
        ruleForm: {
            roleName: '', // 角色名称
            roleSign: '', // 角色标识
            sort: 0, // 排序
            status: true, // 角色状态
            describe: '', // 角色描述
        },
        menuData: [] as TreeType[],
        menuProps: {
            children: 'children',
            label: 'label',
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
    });

    // 打开弹窗
    const openDialog = (type: string, row: RowRoleType) => {
        state.dialog.type = type;
        if (type === 'edit') {
            state.ruleForm = row;
            state.dialog.title = '修改角色';
            state.dialog.submitTxt = '修 改';
        } else {
            state.dialog.title = '新增角色';
            state.dialog.submitTxt = '新 增';
            // 清空表单，此项需加表单验证才能使用
            // nextTick(() => {
            // 	roleDialogFormRef.value.resetFields();
            // });
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
        if (state.dialog.type == 'edit') {
            roleManageApi().update(
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
            state.ruleForm['AuthorID'] = 1
            roleManageApi().add(
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
    // 获取菜单结构数据
    const getMenuData = () => {
        state.menuData = [{id: 1, label: '首页'},
            {
                id: 22, label: '系统对象管理', children: [
                    {id: 23, label: '地址对象'},
                    {id: 24, label: '封装应用头'},
                    {id: 25, label: '消息头对象'},
                    {id: 26, label: '消息体对象'},
                    {id: 27, label: '消息转换列表'},
                    {id: 28, label: '数据域集合'}]
            },

            {
                id: 30, label: '流程编排管理', children: [
                    {id: 31, label: '流程编排设计'},
                    {id: 32, label: '全局变量管理'},
                    {id: 33, label: '流程特殊节点'},
                ]
            },

            {
                id: 40, label: '应用场景管理', children: [
                    {id: 41, label: '网关管理'},
                    {id: 42, label: '流程分发管理'},
                ]
            },

            {
                id: 50, label: '插件管理', children: [
                    {id: 51, label: '系统插件'},
                    {id: 52, label: '函数插件'},
                ]
            },

            {id: 60, label: '系统监控'},

            {
                id: 70, label: '系统管理', children: [
                    {id: 71, label: '用户管理'},
                    {id: 72, label: '角色管理'},
                    {id: 73, label: '日志管理日志管理'},
                ]
            }
            ];





    }    ;

    // 暴露变量
    defineExpose({
        openDialog,
    });
</script>

<style scoped lang="scss">
    .system-role-dialog-container {
        .menu-data-tree {
            width: 100%;
            border: 1px solid var(--el-border-color);
            border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
            padding: 5px;
        }
    }
</style>
