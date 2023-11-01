<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="900px" :draggable="true">

             <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入字段名称" style="max-width: 180px"
                          v-model="state.tableData.search"></el-input>
                <el-button size="default" type="primary" class="ml10" @click="onSearch">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>
                    查询
                </el-button>

            </div>
            <el-table :data="state.tableData.data" row-key="ID" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="OutType" label="类型" v-if="false"></el-table-column>
                <el-table-column prop="DFIID" label="DFIID" v-if="false"></el-table-column>
                <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ShortName" label="简称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Flag" label="数据标识" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Describes" label="说明" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="OutType" label="特别类型" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="NestID" label="特别类型" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip
                                 v-if="isHide"></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="isHide"></el-table-column>


                <el-table-column label="操作" width="100" v-if="false">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEditGroup('edit', scope.row)"
                                   v-if="scope.row.Nest=='2'">编辑嵌套
                        </el-button
                        >
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onRowDel(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="onHandleSizeChange"
                    @current-change="onHandleCurrentChange"
                    class="mt15"
                    :pager-count="5"
                    :page-sizes="[10, 20, 30]"
                    v-model:current-page="state.tableData.param.pageNum"
                    background
                    v-model:page-size="state.tableData.param.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="state.tableData.total"
            >
            </el-pagination>
            </el-card>



        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="systemUserDialog">
    import {nextTick, onMounted, reactive, ref} from 'vue';

    import {useRoute} from "vue-router";
    import {messdetailApi} from "/@/api/sysmanage/messdetail";
    import {ElMessage} from "element-plus";
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const route = useRoute()
    const querys = route.query
    // 定义变量内容
    const userDialogFormRef = ref();
    const isHide=ref(false);
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
            sourmess: '',
            tarmess: '',
            describe: '', // 用户描述
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
            pid:'',
        },
        tableData: {
            data: [],
            id: '',
            deep: '',
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
                search: '',
            searchStr: '',
        },
    });

    // 打开弹窗
    const openDialog = (type: string,pid) => {
        console.log(pid);
        state.dialog.type=type;
        state.dialog.pid=pid;
        state.dialog.title = '查看';
        state.dialog.submitTxt = '新 增';
        getTableData();
        // 清空表单，此项需加表单验证才能使用
        nextTick(() => {
            userDialogFormRef.value.resetFields();
        });

        state.dialog.isShowDialog = true;
        getTableData();
    };
    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
        closeDialog();
    };
        const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    // 提交
    const onSubmit = () => {
        closeDialog();
        emit('refresh');
        // if (state.dialog.type === 'add') { }
    };
    // 初始化部门数据
    const getTableData = () => {
        state.tableData.loading = true;
        state.tableData.id
         messdetailApi().searchMessDetail(
            {
                uid: 1,
                pid: state.dialog.pid,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
                ttype: state.dialog.type
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    state.tableData.data = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        //const data = [];
        messdetailApi().getMessDetailSearchListSize(
            {
                uid: 1,
                name: state.tableData.searchStr,
                pid: state.dialog.pid,
                ttype:state.dialog.type,
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    state.tableData.total = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });


        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
    };
    // 分页改变
    const onHandleSizeChange = (val: number) => {
        state.tableData.param.pageSize = val;
        getTableData();
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
        state.tableData.param.pageNum = val;
        getTableData();
    };
    // 页面加载时
    onMounted(() => {
        //getTableData();
    });
    // 暴露变量
    defineExpose({
        openDialog,

    });
</script>

<style scoped lang="scss">
     :deep(.el-table) {
        /* 替换默认展开收起图片 */
        /* prettier-ignore */
        .el-table__expand-icon {
            width: 12PX;
            height: 12PX;
            //background: ele-Plus no-repeat;
            //ele-Plus
            background: url("/@/assets/public/add-bold.png") no-repeat;
            background-size: 100% 100%;

            .el-icon {
                display: none;
            }
        }

        .el-table__expand-icon--expanded {
            transform: none;
            background: url("/@/assets/public/minus-bold.png") no-repeat;
            //ele-SemiSelect
            background-size: 100% 100%;
        }
    }
</style>