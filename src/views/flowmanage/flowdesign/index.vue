<template>
  <div class="filtering layout-pd">
    <el-card
        shadow="hover"
        class="filtering-list br-top-no"
        v-loading="state.tableData.loading"
        element-loading-text="加载中..."
        element-loading-background="rgba(255, 255, 255, 0.1)"
        :class="{ 'min-h-360': state.tableData.data.length <= 0 }"
    >
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入流程编排" style="max-width: 180px"
                  v-model="state.tableData.search" clearable></el-input>
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
          新增流程编排
        </el-button>
      </div>
      <div class="flex-warp mt15 mb15" v-if="state.tableData.data.length > 0">
        <el-row :gutter="15">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb15"
                  v-for="(v, k) in state.tableData.data" :key="k" @click="onTableItemClick(v)">
            <div class="flex-warp-item">
              <div class="flex-warp-item-box">
                <div class="item-img">
                  <img :src="flowimg1" v-if="v.Type=='应用层透明传输'"/>
                  <img :src="flowimg2" v-if="v.Type=='混合编排'"/>
                  <img :src="flowimg3" v-if="v.Type=='指定流程'"/>
                  <img :src="flowimg4" v-if="v.Type=='网络层透明传输'"/>
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
                        <span> {{ v.Name }}</span>

                      </div>
                      <div class="item-txt-msg mb10">
                        <span>类型： {{ v.Type }}</span>

                      </div>


                      <div class="item-txt-msg mb10">
												<span class="font-price">
													<span class="font">最后修改时间: {{ v.LastModified }}</span>
												</span>

                      </div>
                      <div class="item-txt-msg mb10">
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="编辑流程"
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
                            content="删除流程"
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
                            content="下载脚本"
                            placement="bottom-start"
                        >
                          <el-button type="primary" size="small" circle
                                     @click.stop="onRowDownload(v)">
                            <el-icon>
                              <ele-Download/>
                            </el-icon>

                          </el-button>
                        </el-tooltip>
                        <el-tooltip
                            class="box-item"
                            effect="light"
                            content="复制"
                            placement="bottom-start"
                        >
                          <el-button type="warning" size="small" circle
                                     @click.stop="onRowCopy(v)">
                            <el-icon>
                              <ele-CopyDocument/>
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
      <div v-else class="filtering-no-data">
        <div class="no-data-box">
          <i class="el-icon-search"></i>
          <div class="no-txt">暂无数据</div>
        </div>
      </div>
      <template v-if="state.tableData.data.length > 0">
        <el-pagination
            style="text-align: right"
            background
            @size-change="onHandleSizeChange"
            @current-change="onHandleCurrentChange"
            :page-sizes="[12, 20, 30]"
            :current-page="state.tableData.param.pageNum"
            :page-size="state.tableData.param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="state.tableData.total"
        >
        </el-pagination>
      </template>
    </el-card>
    <UserDialog ref="userDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts" name="pagesFiltering">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';

import {ElMessage, ElMessageBox} from "element-plus";
import {flowApi} from "/@/api/flowmanage/flow";
import {useUserInfo} from "/@/stores/userInfo";
import flowdesignimg from '/@/assets/flowdesign.jpg';
import flowpng1 from '/@/assets/flow1.png';
import flowpng2 from '/@/assets/flow2.png';
import flowpng3 from '/@/assets/flow3.png';
import flowpng4 from '/@/assets/flow4.png';
import {gatewayApi} from "/@/api/distribution/gateway";
import {transclassfyApi} from "/@/api/transmanage/transclassfy";

const flowimg = ref(flowdesignimg);
const flowimg1 = ref(flowpng1);
const flowimg2 = ref(flowpng2);
const flowimg3 = ref(flowpng3);
const flowimg4 = ref(flowpng4);
const UserDialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/dialog.vue'));
const userDialogRef = ref();
// 定义变量内容
const dlRefs = ref<RefType[]>([]);
const router = useRouter();
const state = reactive({
  tableDataDistribute: {
    data: []
  },
  tableDataTransTemplate:{
    data:[]
  },
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 12,
    },
    search: '',
    searchStr: '',
  },
});

// 页面加载时
onMounted(() => {
  getTableData();
  getFlowDistribution();
});
const onOpenAdd = (type: string) => {
  userDialogRef.value.openDialog(type);
}
// 初始化 `收起、展开` 按钮
const getTableData = () => {
  state.tableData.loading = true;
  flowApi().searchFlow(
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
  flowApi().getFlowSearchListSize(
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
const getFlowDistribution = () => {

  gatewayApi().searchGatewayDistributeall(
      {})
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableDataDistribute.data = res.data;

        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
  //const data = [];
};
const onSearch = () => {
  state.tableData.searchStr = state.tableData.search;
  getTableData();
};
const onOpenEdit = (type: string, row: RowUserType) => {
  userDialogRef.value.openDialog(type, row);
};
const onTableItemClick = (v: FilterListType) => {
  router.push({
    path: '/flowmanage/flowdesign/flowdesigndetail2',
    query: {ID: v.ID, FlowName: v.Name, Type: v.Type},
  });

};
const getDIsCount=(id)=>{
  let num=0;
  for(let i of state.tableDataDistribute.data )
  {
    if(i.FlowID==id){
      num++;
    }
  }
  return num;
}
const onRowDel = (row: RowUserType) => {
  let num=getDIsCount(row.ID);
  let propStr='';
  if(num>0){
    propStr='该流程已下发'+num+'个网关，此操作将永久删除：'+row.Name+',并更新至关联网关，是否继续?';
  }else{
    propStr='此操作将永久删除：'+row.Name+'，是否继续?';
  }
  ElMessageBox.confirm(propStr, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        flowApi().delFlow(
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
// 分页点击
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getTableData();
};
// 分页点击
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getTableData();
};


const onRowCopy = (row: RowUserType) => {
  const stores = useUserInfo();

  flowApi().copy(
      {
        AuthorID: stores.userInfos.id,
        ID: row.ID,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          ElMessage.success('复制成功');
          getTableData();

        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
const onRowDownload = (row: RowUserType) => {
  downloadProcess(row, 'txt', '流程脚本');
}
async function downloadProcess(row, type, name = '流程脚本') {
  let data = row.FlowOutStr
  const {href, filename} = setEncoded('json', name, data)
  //      console.log(data)
  downloadFile(href, filename)


}

function downloadFile(href, filename) {
  if (href && filename) {
    const a = document.createElement('a')
    a.download = filename //指定下载的文件名
    a.href = href //  URL对象
    a.click() // 模拟点击
    URL.revokeObjectURL(a.href) // 释放URL 对象
  }
}

function setEncoded(type, filename, data) {
  const encodedData = data;
  return {
    filename: `${filename}.${type.toLowerCase()}`,
    href: `data:application/${
        type === 'txt' ? 'text/xml' : 'bpmn20-xml'
    };charset=UTF-8,${encodedData}`,
    data: data
  }
}
</script>

<style scoped lang="scss">
.filtering {
  .filtering-list {
    overflow: hidden;
    border-bottom: none !important;

    .filtering-list-flex {
      &:last-of-type {
        .filtering-list-item {
          border-bottom: none !important;
        }
      }

      .filtering-list-title {
        float: left;
        width: 64px;
        font-weight: 700;
        position: relative;
        color: #909399;
        margin: 15px 0;

        &:after {
          content: '';
          position: absolute;
          border: 1px solid #909399;
          border-width: 0 1px 1px 0;
          width: 4px;
          height: 4px;
          transform: rotate(-45deg) translateY(-50%);
          right: 10px;
          top: 50%;
        }
      }

      .filtering-list-item {
        border-bottom: 1px dotted var(--next-border-color-light);
        margin-left: 64px;
        overflow: hidden;
        position: relative;

        .span {
          color: #8d8d91;
          font-size: 14px;
          float: left;
          padding: 0 15px;
          margin: 15px 0;

          &:hover {
            color: var(--el-color-primary);
            cursor: pointer;
          }
        }

        .dd-active {
          color: var(--el-color-primary);
        }

        .dd-more {
          font-size: 12px;
          position: absolute;
          right: 0;
          top: 16px;
          color: #a5a5a5;

          &:hover {
            cursor: pointer;
            color: #8d8d91;
          }
        }
      }
    }
  }

  .br-top-no {
    border-top: none;

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
      height: 100%;

      .filtering-no-data {
        display: flex;
        height: 100%;

        .no-data-box {
          color: #cccccc;
          margin: auto;

          i {
            font-size: 70px;
          }

          .no-txt {
            font-size: 14px;
            text-align: center;
            margin-top: 15px;
          }
        }
      }
    }
  }

  .min-h-360 {
    height: 360px;
  }
}
</style>
