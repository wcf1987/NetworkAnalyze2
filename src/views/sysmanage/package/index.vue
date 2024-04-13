<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入对象名称" style="max-width: 180px"
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
                    新增封装/应用头对象
                </el-button>
                        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS()">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>

              <el-button size="default" type="warning" class="ml10" @click="onChangeView()">
                <el-icon>
                  <ele-Memo/>
                </el-icon>
                <div>{{state.viewStr }}</div>
              </el-button>
            </div>

            <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" @selection-change="handleSelectionChange" v-if="state.view=='list'">
               <el-table-column type="selection" width="30"/>
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
                <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEditDetail('edit', scope.row)"
                        >编辑详细
                        </el-button
                        >
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onRowDel(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table >
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
                    v-if="state.view=='list'"
            >
            </el-pagination>
          <div class="waterfall-first" v-if="state.view=='waterfall'">
            <div class="waterfall-first-item"   v-for="(v, k) in state.tableData.data" :key="k"   v-waves  @click="onOpenEditDetail('edit', v)">
              <div class="w100 h100 flex">
                <div class="item-txt">
                  <div class="item-txt-title">
                    <div class="item-txt-msg mr10">
                      <span> {{ v.Name }}</span>

                    </div>

                  </div>
                  <div class="item-txt-title">
                    <div style="width: 100% "  >

                      <div class="item-txt-msg mb10 ">
                        <span class="centered">类型： {{ v.Type }}</span>

                      </div>



                      <div class="item-txt-msg mb10 ">
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="编辑"
                            placement="bottom-start"
                        >
                          <el-button type="success" size="small" circle
                                     @click.stop="onOpenEdit('edit', v)">
                            <el-icon>
                              <ele-Document/>
                            </el-icon>

                          </el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="删除"
                            placement="bottom-start"
                        >
                          <el-button type="danger" size="small" circle
                                     @click.stop="onRowDel(v)">
                            <el-icon>
                              <ele-Delete/>
                            </el-icon>

                          </el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="修改"
                            placement="bottom-start"
                        >
                          <el-button type="warning" size="small" circle
                                     @click.stop="onOpenEditDetail('edit', v)">
                            <el-icon>
                              <ele-Edit/>
                            </el-icon>

                          </el-button>
                        </el-tooltip>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <UserDialog ref="userDialogRef" @refresh="getTableData()" @editdetail="onOpenEditDetailByID"/>
    </div>
</template>

<script setup lang="ts" name="systemUser">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRouter} from "vue-router";
    import {packageApi} from '/@/api/sysmanage/package';
    import {addressApi} from "/@/api/sysmanage/address";
    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/package/dialog.vue'));
    const router = useRouter();
    // 定义变量内容
    const userDialogRef = ref();
    const state = reactive({
      view:'list',
      viewStr:'切换瀑布流显示',
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
                ids:[],
        },
    });
    const  calcIndex=(index)=>{
        index=index+(state.tableData.param.pageNum-1)*state.tableData.param.pageSize+1
        return index
    }
    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
        packageApi().searchPackage(
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
        packageApi().getPackageSearchListSize(
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
        }, 100);
    };
    // 打开新增用户弹窗
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type);
    };
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row: RowUserType) => {
        userDialogRef.value.openDialog(type, row);
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
                packageApi().delIDS(                                          state.tableData.ids

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
    const onSearch = () => {
        state.tableData.searchStr=state.tableData.search;
       getTableData();
    };
    //切换瀑布视图和列表展示
    const onChangeView = () => {
      if(state.view=='list'){
        state.view='waterfall';
        state.viewStr='切换列表显示';
        state.tableData.param.pageSize = 100;
        getTableData();
      }else{
        state.view='list';

        state.viewStr='切换瀑布流显示';
        state.tableData.param.pageSize = 10;
        getTableData();
      }

    };
    const onOpenEditDetail = (type: string, row: RowUserType) => {
        onOpenEditDetailByID(row.ID,row.Describes);

    };
    const onOpenEditDetailByID = (id,desc) => {
        router.push({
            path: '/sysmanage/package/packagedetail',
            query: {id: id,desc:desc},
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
                packageApi().delPackage(
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
        :deep(.el-card__body) {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: auto;

            .el-table {
                flex: 1;
            }
        }
      .waterfall-first {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(188px, 1fr));
        grid-gap: 0.25em;
        grid-auto-flow: row dense;
        grid-auto-rows: 20px;
        .waterfall-first-item {
          width: 100%;
          background: var(--el-color-primary);
          color: var(--el-color-white);
          transition: all 0.3s ease;
          border-radius: 3px;
          &:nth-of-type(3n + 1) {
            grid-row: auto / span 5;
          }
          &:nth-of-type(3n + 2) {
            grid-row: auto / span 6;
          }
          &:nth-of-type(3n + 3) {
            grid-row: auto / span 8;
          }
          &:hover {
            box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            transition: all 0.3s ease;
            cursor: pointer;
          }
        }
      }
      .waterfall-last {
        display: grid;
        grid-gap: 0.25em;
        grid-auto-flow: row dense;
        grid-auto-rows: minmax(188px, 20vmin);
        grid-template-columns: 1fr;
        .waterfall-last-item {
          height: 100%;
          background: var(--el-color-primary);
          color: var(--el-color-white);
          transition: all 0.3s ease;
          border-radius: 3px;
          &:hover {
            box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            transition: all 0.3s ease;
            cursor: pointer;
          }
        }
      }
      @media (min-width: 576px) {
        .waterfall-last {
          grid-template-columns: repeat(7, 1fr);
          .waterfall-last-item {
            &:nth-of-type(9n + 9) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(9n + 8) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(9n + 7) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(9n + 6) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(9n + 5) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(9n + 4) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(9n + 3) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(9n + 2) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(9n + 1) {
              grid-column: auto / span 2;
            }
          }
        }
      }
      @media (min-width: 576px) and (min-width: 1024px) {
        .waterfall-last {
          grid-template-columns: repeat(14, 1fr);
          .waterfall-last-item {
            &:nth-of-type(15n + 15) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 14) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 13) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(15n + 12) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 11) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 10) {
              grid-column: auto / span 2;
            }
            &:nth-of-type(15n + 9) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 8) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 7) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 6) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 5) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 4) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 3) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 2) {
              grid-column: auto / span 3;
            }
            &:nth-of-type(15n + 1) {
              grid-column: auto / span 2;
            }
          }
        }
      }
      .item-txt {
        flex: 1;
        padding: 15px;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .item-txt-title {
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          display: -webkit-box;
          color: #f3f0de;
          transition: all 0.3s ease;


        }
      }
    }
</style>
