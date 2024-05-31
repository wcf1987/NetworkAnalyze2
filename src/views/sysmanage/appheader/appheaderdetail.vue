<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15 ">
                <el-input size="default" placeholder="请输入字段名称" style="max-width: 180px" v-model="state.tableData.search"></el-input>
                <el-button size="default" type="primary" class="ml10"  @click="onSearch">
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
                        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>
                                <el-button size="default" type="warning" class="mr10" @click="back()">
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回
                </el-button>
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="'类型：'+state.tableData.type+'\n描述：'+state.tableData.desc"
                  placement="top"
              >
                <el-tag type="info" effect="dark" round  class="eltagr">名称:{{ state.tableData.name  }}</el-tag>
              </el-tooltip>

            </div>
            <el-table  :cell-style="{'padding': '2px 2px 0 10px'}" :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
               <el-table-column type="selection" width="30"/>
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
                <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ArrayOr" label="是否数组" show-overflow-tooltip></el-table-column>
                <el-table-column prop="DefaultValue" label="默认值" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip  v-if="false"></el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEditDetail('edit', scope.row)"
                                   v-if="false">编辑详细
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
                    :page-sizes="[10,17, 20, 30]"
                    v-model:current-page="state.tableData.param.pageNum"
                    background
                    v-model:page-size="state.tableData.param.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="state.tableData.total"
            >
            </el-pagination>
        </el-card>
        <UserDialog ref="userDialogRef"  @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRoute, useRouter} from "vue-router";
import {packageApi} from '/@/api/sysmanage/package';
    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/package/detaildialog.vue'));
    const router = useRouter();
    // 定义变量内容
    const userDialogRef = ref();
    const route = useRoute()
    const querys = route.query
    const state = reactive({
        tableData: {
            id:0,
            data: [],
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 17,
            },
               search: '',
            searchStr: '',
                ids:[],
            desc:'描述',
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
         packageApi().searchPackageDetail(
            {
                uid: 1,
                pid:state.tableData.id,
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
        packageApi().getPackageDetailSearchListSize(
            {
                uid: 1,
                name: state.tableData.searchStr,
                pid:state.tableData.id,
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


        //state.tableData.data = data;
        //state.tableData.total = state.tableData.data.length;
        setTimeout(() => {
            state.tableData.loading = false;
        }, 100);
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

    //多选监听
    const handleSelectionChange = (val) => {
        state.tableData.ids = val.map(v => v.ID)
        //this.$message.warning("选择了"+this.ids.length+"条数据");
        console.log("选择了"+state.tableData.ids.length+"条数据")
    };
    //批量删除
    const onDeleteIDS = (type: string) => {
        ElMessageBox.confirm(`此操作将批量删除网口：“${state.tableData.ids.length}”条，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })


            .then(() => {
                packageApi().delDetailIDS(                                          state.tableData.ids

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
        ElMessageBox.confirm(`此操作将永久删除字段：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
 packageApi().delPackageDetail(
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
        state.tableData.name=querys.name;
        state.tableData.type=querys.type;
        state.tableData.desc = querys.desc;

        getTableData();
    });
</script>

<style scoped lang="scss">
    .system-user-container {
      .system-user-search{
        display: flex;
        .el-tag{
          margin-left: auto;
          margin-right: 10px;
        }
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
