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
                        <ele-UploadFilled/>
                    </el-icon>
                    导入
                </el-button>
            </div>
            <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column label="序号" type="index" width="60"/>

                <el-table-column prop="DFIID" label="DFIID" show-overflow-tooltip v-if="isHide"/>
                <el-table-column prop="DFINO" label="DFI标识号" show-overflow-tooltip/>
                <el-table-column prop="DFIVersion" label="DFI版本" show-overflow-tooltip v-if="isHide"/>
                <el-table-column prop="DUINO" label="DUI标识号" show-overflow-tooltip/>
                <el-table-column prop="DUIVersion" label="DUI版本" show-overflow-tooltip/>
                <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ShortName" label="简称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Describes" label="说明" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip
                                 v-if="isHide"></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTimes" label="创建时间" show-overflow-tooltip v-if="isHide"></el-table-column>
                <el-table-column label="操作" width="130">
                    <template #default="scope">

                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('view', scope.row)"
                        >详情
                        </el-button>
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
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
        <UserDialog ref="userDialogRef" @refresh="getTableData('2')"/>

    </div>
</template>

<script setup lang="ts" name="systemUser">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRoute, useRouter} from "vue-router";
    import 'splitpanes/dist/splitpanes.css';
    import {fieldsdetailApi} from "/@/api/sysmanage/fieldsdetail";
    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/fieldsdetaildialog.vue'));
    const router = useRouter();
    const isHide = ref(false);
    const stateconfig = reactive({
        url: '/sys/org/dept', loading: true, ids: [], moreParams: false,
        form: {} as any, single: true, multiple: true, list: [], total: 0,
        pageShow: false, leftPaneSize: 250 / (window.innerWidth - 220) * 100,

    });
    const route = useRoute()
    const querys = route.query
    // 定义变量内容
    const userDialogRef = ref();
    const state = reactive({
        id:0,
        tableData: {
            data: [],
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

    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
      fieldsdetailApi().searchFieldsDetail(
            {
                uid: 1,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
                pid:state.id,
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
        fieldsdetailApi().getFieldsDetailSearchListSize(
            {
                uid: 1,
                name: state.tableData.searchStr,
                pid:state.id,
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
        }, 300);
    };
    // 打开新增用户弹窗
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type,state.tableData.id);
    };
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row: RowUserType) => {

         userDialogRef.value.openDialog(type, state.tableData.id,row);
    };
    const onSearch = () => {
        state.tableData.searchStr=state.tableData.search;
       getTableData();
    };



    // 删除用户
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                fieldsdetailApi().delFieldsDetail(
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
        state.id = querys.id;

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
