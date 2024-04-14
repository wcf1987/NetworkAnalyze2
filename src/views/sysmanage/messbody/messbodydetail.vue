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

                <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>
                <el-button size="default" type="warning" class="mr10" @click="backUP()" v-if="state.tableData.nestid!=0"
                >
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回上一级
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
            <el-table :data="state.tableData.data" row-key="ID" v-loading="state.tableData.loading" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30"/>
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column prop="parentindex" label="序号" width="80"/>
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


                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEditGroup('edit', scope.row)"
                                   v-if="scope.row.OutType=='nest'">编辑
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
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messbody/detaildialog.vue'));
    const ImportDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messbody/importdialog.vue'));
    const GroupDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messbody/groupdialog.vue'));
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
            type: '',
            total: 0,

            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
            history: [],
            nestid: 0,
            search: '',
            searchStr: '',
            ids: [],
            desc: '',
        },
    });
    const calcIndex = (index) => {
        index = index + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1
        return index
    }
    //编辑嵌套结构
    const onOpenEditGroup = (type: string, row: RowUserType) => {
        state.tableData.history.push({
            nestid: state.tableData.nestid,
            pageNum: state.tableData.param.pageNum,
            pageSize: state.tableData.param.pageSize,
            searchStr: state.tableData.searchStr
        })
        state.tableData.nestid = row.ID;
        state.tableData.param.pageNum = 1;
        state.tableData.param.pageSize = 10;
        state.tableData.searchStr = '';
        state.tableData.search = '';
        getTableData();

    };
    //返回上一级
    const backUP = () => {
        let temphis = state.tableData.history.pop()
        state.tableData.nestid = temphis.nestid;
        state.tableData.param.pageNum = temphis.pageNum;
        state.tableData.param.pageSize = temphis.pageSize;
        state.tableData.searchStr = temphis.searchStr;
        state.tableData.search = state.tableData.searchStr;
        getTableData();
    }
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
                ttype: 'body',
                nestid: state.tableData.nestid,
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    state.tableData.data = res.data;
                    let id = 0;
                    for (let i of state.tableData.data) {
                        i.parentindex = id + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1;
                        id = id + 1;
                    }
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
                nestid: state.tableData.nestid,
                ttype: 'body',
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
        }, 200);
    };
    // 打开新增弹窗
    const onOpenAdd = (type: string) => {
        //console.log(state);
        userDialogRef.value.openDialog(type, state.tableData.id, null, state.tableData.type, state.tableData.nestid);
    };
    const onOpenGroup = (type: string) => {
        groupDialogRef.value.openDialog(type, state.tableData.id, null, state.tableData.nestid);
    };
    const onOpenImport = (type: string) => {
        importDialogRef.value.openDialog(type, state.tableData.id, null, state.tableData.nestid);
    };
    const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    //多选监听
    const handleSelectionChange = (val) => {
        state.tableData.ids = val.map(v => v.ID)
        //this.$message.warning("选择了"+this.ids.length+"条数据");
        console.log("选择了" + state.tableData.ids.length + "条数据")
    };
    //批量删除
    const onDeleteIDS = (type: string) => {
        ElMessageBox.confirm(`此操作将批量删除网口：“${state.tableData.ids.length}”条，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })


            .then(() => {
                messdetailApi().delIDS(state.tableData.ids
                )
                    .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success('成功批量删除' + res.data + '条');
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
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row) => {
        if (row.OutType == 'custom') {

            userDialogRef.value.openDialog(type, state.tableData.id, row, state.tableData.type);
        }
        if (row.OutType == 'fields') {

            importDialogRef.value.openDialog(type, state.tableData.id, row);
        }
        if (row.OutType == 'nest') {

            groupDialogRef.value.openDialog(type, state.tableData.id, row);
        }

    };

    const onOpenEditDetail = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messbody/messbodydetail',
            query: {id: row.ID},
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
        //console.log(querys);
        state.tableData.id = querys.id;
      state.tableData.name=querys.name;
        state.tableData.type = querys.type;
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
