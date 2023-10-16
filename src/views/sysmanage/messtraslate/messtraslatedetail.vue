<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入字段名称" style="max-width: 180px"></el-input>
                <el-button size="default" type="primary" class="ml10">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>
                    查询
                </el-button>
                <el-button size="default" type="primary" class="ml10" @click="viewMess('view','123')">
                    <el-icon>
                        <ele-Coin/>
                    </el-icon>
                    查询数据源定义
                </el-button>
            </div>
            <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="Name" label="转换名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TargetName" label="目的字段名" show-overflow-tooltip></el-table-column>

                <el-table-column prop="Optional" label="转换模式" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Transrule" label="转换规则" show-overflow-tooltip></el-table-column>

                <el-table-column prop="DefaultValue" label="源字段" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column label="操作" width="60">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >


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
        <UserDialog ref="userDialogRef" @refresh="getTableData()"/>
            <ViewDialog ref="viewDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRouter} from "vue-router";

    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messtraslate/detaildialog.vue'));
    const ViewDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messtraslate/viewdialog.vue'));

    const router = useRouter();
    // 定义变量内容
    const userDialogRef = ref();
        const viewDialogRef = ref();
    const state = reactive<SysUserState>({
        tableData: {
            data: [],
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
        },
    });

    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
        const data = [{
            id: 1,
            Name: '版本号转换',
            TargetName: 'version',
            Optional:'默认值',
            Transrule:'0x01',
            DefaultValue: '0xf',
            describe: 'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 2,
            Name: '服务类型转换',
            TargetName: 'type',
            Optional:'直接转换',
            Transrule:'A.type',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',

            createTime: new Date().toLocaleString(),
        }, {
            id: 3,
            Name: '电量计算',
            TargetName: 'power',
            Optional:'系统函数',
            Transrule:'CalcPower(A.power)',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',

            createTime: new Date().toLocaleString(),
        }, {
            id: 4,
            Name: '进度汇总',
            TargetName: 'schedule',
            Optional:'自定义转换计算',
            Transrule:'(A.score+A.aditional)/100',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',

            createTime: new Date().toLocaleString(),
        },

        ];


        state.tableData.data = data;
        state.tableData.total = state.tableData.data.length;
        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
    };
    // 打开新增用户弹窗
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type);
    };
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row: RowUserType) => {
        userDialogRef.value.openDialog(type, row);
    };

    const onOpenEditDetail = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messbody/messbodydetail',
            query: {id: row.ID},
        });
    };
    const viewMess = (type: string, row) => {
        viewDialogRef.value.openDialog(type, row);
    };

    // 删除用户
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除名称：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                getTableData();
                ElMessage.success('删除成功');
            })
            .catch(() => {
            });
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
        getTableData();
    });
</script>

<style scoped lang="scss">
    .system-user-container {
        :deep(.el-card__body) {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: auto;

            .el-table {
                flex: 1;
            }
        }
    }
</style>
