<template>
    <div class="system-role-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
            <el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="state.ruleForm.roleName" placeholder="请输入角色名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="角色标识" prop="roleSign">
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
                        <el-form-item label="排序" prop="sort">
                            <el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right"
                                             placeholder="请输入排序" class="w100"/>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="角色状态" prop="status">
                            <el-switch v-model="state.ruleForm.status" active-value="true" inactive-value="false"
                                       inline-prompt active-text="启" inactive-text="禁"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="角色描述" prop="describes">
                            <el-input v-model="state.ruleForm.describes" type="textarea" placeholder="请输入角色描述"
                                      maxlength="150"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="菜单权限" prop="menuData">
                            <el-tree :data="state.menuData" :props="state.menuProps" @check="onCheckTree"
                                     node-key="name" ref="treeTableRef" show-checkbox
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
    import {nextTick, onMounted, reactive, ref} from 'vue';
    import {roleManageApi} from "/@/api/sysadmin/rolemanage";
    import {ElMessage} from "element-plus";
    import {rolemenu} from '/@/router/roleroute';
    import zhcn from '/@/i18n/lang/zh-cn'
    import {useUserInfo} from "/@/stores/userInfo";
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const treeTableRef = ref();
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
            label: 'menutext',
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
        state.dialog.isShowDialog = true;
        if (type === 'edit') {

            state.dialog.title = '修改角色';
            state.dialog.submitTxt = '修 改';
            nextTick(() => {
                Object.assign(state.ruleForm, row);
                checkMenu();
            });

        } else {
            state.dialog.title = '新增角色';
            state.dialog.submitTxt = '新 增';
            // 清空表单，此项需加表单验证才能使用
             nextTick(() => {
            	roleDialogFormRef.value.resetFields();
            });
        }

        // getMenuData();
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
            state.ruleForm.menustr = JSON.stringify(state.treeSelArr);
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
            const stores = useUserInfo();
            state.ruleForm['AuthorID'] = stores.userInfos.id
            state.ruleForm.menustr = JSON.stringify(state.treeSelArr);
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
    const checkMenu = () => {
        state.ruleForm.menustr = JSON.parse(state.ruleForm.menustr);
        setTimeout(() => {
            treeTableRef.value.setCheckedNodes(state.ruleForm.menustr);
        }, 100)


    }
    const onCheckTree = () => {
        state.treeSelArr = [];
        state.treeSelArr = treeTableRef.value.getCheckedNodes();
        console.log(state.treeSelArr);
    };
    // 获取菜单结构数据
    const getMenuData = () => {
        //state.menuData = rolemenu;
        state.menuData = getNewTree(rolemenu);

    };

    function getNewTree(obj) {
        obj.map(item => {


            item.menutext = zhcn.router[item.name];
            if (item.children && item.children.length > 0) {
                //console.log('item.children', item.children);
                getNewTree(item.children)
            }
        })
        //console.log('obj', obj);
        return obj
    }

    // 暴露变量
    defineExpose({
        openDialog,
    });
    // 页面加载时
    onMounted(() => {
        getMenuData();
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
