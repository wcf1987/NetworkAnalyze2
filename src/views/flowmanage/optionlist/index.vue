<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input  clearable size="default" placeholder="请输入解析方法名称" style="max-width: 180px" v-model="state.tableData.search"></el-input>
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
                    新增解析方法
                </el-button>
                        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>
                                <el-button size="default" type="warning" class="mr10" @click="back()" v-if="false">
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回
                </el-button>
            </div>
            <el-table :cell-style="{'padding': '2px 2px 0 0px' , textAlign: 'center'}" :header-cell-style="{ textAlign: 'center' }"   :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
                 <el-table-column type="selection" width="50"/>
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
                <el-table-column prop="Label" label="解析名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Value" label="节点引用名" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip  ></el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)" class="buttonfont"
                        >修改
                        </el-button
                        >

                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" class="buttonfont"
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
                    :page-sizes="[10, 20, 30,1000]"
                    v-model:current-page="state.tableData.param.pageNum"
                    background
                    v-model:page-size="state.tableData.param.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="state.tableData.total"
            >
            </el-pagination>
        </el-card>
        <UserDialog ref="userDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts" name="systemUser">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRouter} from "vue-router";
    import {specialApi} from "/@/api/flowmanage/special";
    import {optionListApi} from "/@/api/plugmanage/optionlist";

    // 引入组件f
    const UserDialog = defineAsyncComponent(() => import('/@/views/flowmanage/optionlist/dialog.vue'));
    const router = useRouter();
    // 定义变量内容
    const userDialogRef = ref();
    const state = reactive({
        tableData: {
            data: [],
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 20,
            },
          search: '',
            searchStr: '',
                ids:[],
        },
    });
    const  calcIndex=(index)=>{
        index=index+(state.tableData.param.pageNum-1)*state.tableData.param.pageSize+1
        return index
    }

    //返回上一级
    const back = () => {

        router.back();
    }
    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
      optionListApi().search(
            {
                uid: 1,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
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
      optionListApi().getSearchListSize(
            {
                uid: 1,
                name: state.tableData.searchStr,
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
        userDialogRef.value.openDialog(type);
    };
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row: RowUserType) => {
        userDialogRef.value.openDialog(type, row);
    };
    const onSearch = () => {
        state.tableData.searchStr=state.tableData.search;
       getTableData();
    };
    //多选监听
    const handleSelectionChange = (val) => {
        state.tableData.ids = val.map(v => v.ID)
        //this.$message.warning("选择了"+this.ids.length+"条数据");
        console.log("选择了"+state.tableData.ids.length+"条数据")
    };
    //批量删除
    const onDeleteIDS = (type: string) => {
        ElMessageBox.confirm(`此操作将批量删除：“${state.tableData.ids.length}”条，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })


            .then(() => {
              optionListApi().delIDS(                                          state.tableData.ids

                    )
                    .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success('成功批量删除'+res.data+'条');
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

    // 删除用户
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
              optionListApi().del(
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
        getTableData();
    });
</script>

<style scoped lang="scss">
    .system-user-container {
          :deep(.buttonfont) {
                    font-size: 14px;
                }
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
