<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入对象名称" style="max-width: 180px" v-model="state.tableData.search"></el-input>
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
                    新增网关
                </el-button>
                        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>
              <el-button size="default" type="warning" class="eltagr" @click="onChangeView()">
                <el-icon>
                  <ele-Memo/>
                </el-icon>
                <div>{{state.viewStr }}</div>
              </el-button>
            </div>
          <div  class="flex-warp mt15 mb15" v-if="state.tableData.data.length > 0 &&state.view=='waterfall'">
            <el-row :gutter="15">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb15"
                      v-for="(v, k) in state.tableData.data" :key="k" @click="onTableItemClick(v)">
                <div class="flex-warp-item">
                  <div class="flex-warp-item-box">
                    <div class="item-img">
                      <img :src="flowimg"/>
                    </div>
                    <div class="item-txt">
                      <div class="item-txt-title">
                        <div class="item-txt-msg mb10">
                          <span> {{ v.Name }}</span>

                        </div>

                      </div>
                      <div class="item-txt-other">
                        <div style="width: 100%">
                          <div class="item-txt-msg mb10">
                            <span> 网关名称：{{ v.Name }}</span>

                          </div>
                          <div class="item-txt-msg mb10">
                            <span>IP地址：{{ v.IP }}</span>

                          </div>


                          <div class="item-txt-msg mb10">
												<span class="font-price">
													<span class="font">描述信息: {{ v.Describes }}</span>
												</span>

                          </div>
                          <div class="item-txt-msg mb10">
                            <el-tooltip
                                class="box-item"
                                effect="light"
                                content="编辑网关"
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
                                content="删除网关"
                                placement="bottom-start"
                            >
                              <el-button type="danger" size="small" circle
                                         @click.stop="onRowDel(v)">
                                <el-icon>
                                  <ele-Delete/>
                                </el-icon>

                              </el-button>
                            </el-tooltip>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
            <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" @selection-change="handleSelectionChange" v-if="state.view=='list'">
                 <el-table-column type="selection" width="30"/>
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
                <el-table-column prop="Name" label="网关名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="IP" label="IP地址" show-overflow-tooltip></el-table-column>
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
        <UserDialog ref="userDialogRef" @refresh="getTableData()" @editdetail="onOpenEditDetailByID"/>
    </div>
</template>

<script setup lang="ts" name="systemUser">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRouter} from "vue-router";
    import {gatewayApi} from "/@/api/distribution/gateway";
    import {packageApi} from "/@/api/sysmanage/package";
    import {flowdistributionApi} from "/@/api/distribution/flowdistribution";
    import flowdesignimg from '/@/assets/gateway.jpg';
    const flowimg = ref(flowdesignimg);
    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/distribution/gateway/dialog.vue'));
    const router = useRouter();
    // 定义变量内容
    const userDialogRef = ref();
    const state = reactive({
      view:'waterfall',
      viewStr:'切换列表显示',
        tableData: {
            data: [],
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
          search: '',
                ids:[],
          searchStr: '',
        },
    });
    const  calcIndex=(index)=>{
        index=index+(state.tableData.param.pageNum-1)*state.tableData.param.pageSize+1
        return index
    }
    // 初始化表格数据
    const getTableData = () => {
        state.tableData.loading = true;
      gatewayApi().searchGateway(
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
      gatewayApi().getGatewaySearchListSize(
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
      }, 300);
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
    const onChangeView = () => {
      if(state.view=='list'){
        state.view='waterfall';
        state.viewStr='切换列表显示';
        getTableData();
      }else{
        state.view='list';

        state.viewStr='切换瀑布流显示';
        getTableData();
      }

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
                gatewayApi().delIDS(                                          state.tableData.ids

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
    const onOpenEditDetail = (type: string, row: RowUserType) => {
        onOpenEditDetailByID(row.ID);

    };
    const onOpenEditDetailByID = (id) => {
        router.push({
            path: '/sysmanage/package/packagedetail',
            query: {id: id, deep: 0},
        });
    };


    // 删除用户
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除名称：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
              gatewayApi().delGateway(
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
      .system-user-search{
        display: flex;
        .eltagr{
          margin-left: auto;
          margin-right: 10px;
        }
      }


        .flex-warp {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          margin: 0 -5px;

          .el-row {
            width: 101%;
          }

          .flex-warp-item {
            padding: 5px;
            width: 100%;
            height: 360px;

            .flex-warp-item-box {
              border: 1px solid var(--next-border-color-light);
              width: 100%;
              height: 100%;
              border-radius: 2px;
              display: flex;
              flex-direction: column;
              transition: all 0.3s ease;

              &:hover {
                cursor: pointer;
                border: 1px solid var(--el-color-primary);
                transition: all 0.3s ease;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);

                .item-txt-title {
                  color: var(--el-color-primary) !important;
                  transition: all 0.3s ease;
                }

                .item-img {
                  img {
                    transition: all 0.3s ease;
                    transform: translateZ(0) scale(1.05);
                  }
                }
              }

              .item-img {
                width: 100%;
                height: 215px;
                overflow: hidden;

                img {
                  transition: all 0.3s ease;
                  width: 100%;
                  height: 100%;
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
                  color: #666666;
                  transition: all 0.3s ease;

                  &:hover {
                    color: var(--el-color-primary);
                    text-decoration: underline;
                    transition: all 0.3s ease;
                  }
                }

                .item-txt-other {
                  flex: 1;
                  align-items: flex-end;
                  display: flex;

                  .item-txt-msg {
                    font-size: 12px;
                    color: #8d8d91;
                  }

                  .item-txt-price {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .font-price {
                      color: #ff5000;

                      .font {
                        font-size: 22px;
                      }
                    }
                  }
                }
              }
            }
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
