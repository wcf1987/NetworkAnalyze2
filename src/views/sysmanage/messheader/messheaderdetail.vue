<template>
    <div class="system-user-container layout-padding">
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
                <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
                    <el-icon>
                        <ele-FolderAdd/>
                    </el-icon>
                    新增字段
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenImport('add')">
                    <el-icon>
                        <ele-DocumentAdd/>
                    </el-icon>
                    从数据域引入字段
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenGroup('add')">
                    <el-icon>
                        <ele-Wallet/>
                    </el-icon>
                    新增嵌套结构
                </el-button>
                <el-button size="default" type="warning" class="mr10" @click="this.$router.back()"
                           v-if="state.tableData.deep!=0">
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回上一级
                </el-button>
            </div>
            <el-table :data="state.tableData.data" row-key="ID" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="Nest" label="名称" v-if="false"></el-table-column>
                <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ShortName" label="简称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Flag" label="数据标识" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Describes" label="说明" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="OutType" label="特别类型" show-overflow-tooltip v-if="isHide"></el-table-column>

                <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip
                                 v-if="isHide"></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="isHide"></el-table-column>


                <el-table-column label="操作" width="160">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)" v-if="scope.row.OutType!='fields'"
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
        <UserDialog ref="userDialogRef" @refresh="getTableData()"/>
        <ImportDialog ref="importDialogRef" @refresh="getTableData()"/>
        <GroupDialog ref="groupDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRoute, useRouter} from "vue-router";
    import {messdetailApi} from '/@/api/sysmanage/messdetail';
    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/detaildialog.vue'));
    const ImportDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/importdialog.vue'));
    const GroupDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/groupdialog.vue'));
    const route = useRoute()
    const router = useRouter();
    const querys = route.query
    // 定义变量内容
    const userDialogRef = ref();
    const importDialogRef = ref();
    const groupDialogRef = ref();
    const isHide = ref(false);

    const state = reactive({
        tableData: {
            id: '',
            data: [],
            total: 0,
            id: '',
            deep: '',
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
            search: '',
            searchStr: '',
        },
    });

    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;

        messdetailApi().searchMessDetail(
            {
                uid: 1,
                pid: state.tableData.id,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
                ttype: 'header'
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
                pid: state.tableData.id,
                ttype: 'header',
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
    // 打开新增用户弹窗
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type,state.tableData.id);
    };
    const onOpenGroup = (type: string) => {
        groupDialogRef.value.openDialog(type);
    };
    const onOpenImport = (type: string) => {
        importDialogRef.value.openDialog(type);
    };
    const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row) => {
        if (row.Nest == '1') {
            groupDialogRef.value.openDialog(type, row);
        } else {
            userDialogRef.value.openDialog(type, state.tableData.id,row);
        }
    };

    const onOpenEditDetail = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messheader/messheaderdetail',
            query: {id: row.ID},
        });
    };
    const onOpenEditGroup = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messheader/messheaderdetail',
            query: {id: row.ID, deep: parseInt(state.tableData.deep) + 1},
        });
    };

    // 删除用户
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                messdetailApi().delMessDetail(
                    {
                        ID: row.ID,

                    })
                    .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success('删除成功');
                            getTableData();

                        } else {
                            ElMessage.error(res.message);
                        }

                    }).catch(err => {

                }).finally(() => {

                });


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

        state.tableData.id = querys.id;
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
