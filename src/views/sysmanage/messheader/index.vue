<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input clearable size="default" placeholder="请输入消息头名称" style="max-width: 180px"
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
          新增消息头对象
        </el-button>
        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
          <el-icon>
            <ele-DeleteFilled/>
          </el-icon>
          批量删除
        </el-button>
        <el-button size="default" type="warning" class="ml10" @click="onCopyIDS('copy')">
          <el-icon>
            <ele-CopyDocument/>
          </el-icon>
          复制
        </el-button>
        <el-button size="default" type="warning" class="mr10" @click="back()" v-if="false">
          <el-icon>
            <ele-ArrowLeftBold/>
          </el-icon>
          返回
        </el-button>
      </div>
      <el-table @sort-change="sort_change" :cell-style="{'padding': '2px 2px 0 0px' , textAlign: 'center'}"
                :header-cell-style="{ textAlign: 'center' }" :data="state.tableData.data"
                v-loading="state.tableData.loading" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
        <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
        <el-table-column prop="Name" label="名称" show-overflow-tooltip sortable="custom"></el-table-column>
        <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>

        <el-table-column prop="Type" label="格式" show-overflow-tooltip sortable="custom"></el-table-column>
        <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column label="操作" width="230">
          <template #default="scope">
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                       @click="onOpenEdit('edit', scope.row)" class="buttonfont"
            >修改
            </el-button
            >
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                       @click="onOpenEditDetail('edit', scope.row)" class="buttonfont"
            >编辑详细
            </el-button
            >
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" class="buttonfont"
                       @click="onRowDel(scope.row)">删除
            </el-button>
                <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" class="buttonfont"
                       @click="onRowDownload(scope.row)">下载
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
    <UserDialog ref="userDialogRef" @refresh="getTableData()" @editdetail="onOpenEditDetailByID"/>
  </div>
</template>

<script setup lang="ts" name="systemUser">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import {messheaderApi} from '/@/api/sysmanage/messheader';
import {messdetailApi} from "/@/api/sysmanage/messdetail";
// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/dialog.vue'));
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
    ids: [],
    order: 'asc',
    orderField: 'ID',
  },
});

 const getMessDetailData = async (id) => {


 await messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: id,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'header',
        nestid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          state.tableData.downloadData = res.data;



        } else {

        }

      }).catch(err => {

  }).finally(() => {

  });




};
const onRowDownload = (row: RowUserType) => {
  downloadProcess(row, 'txt', '消息头');
}

async function downloadProcess(row, type, name = '脚本') {
  await  getMessDetailData(row.ID);
  let namenew=row.Name+'-'+name
   let data = JSON.stringify(state.tableData.downloadData);
  console.log(data);
  const {href, filename} = setEncoded('json', namenew, data)
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


const calcIndex = (index) => {
  index = index + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1
  return index
}
const sort_change = (k: any) => {
  console.log(k);
  if (k.order === 'ascending') {
    // 升序排序 stopped在前
    state.tableData.order = 'asc';
    state.tableData.orderField = k.prop;
  } else if (k.order === 'descending') {
    // 降序排序 running在前（使用reverse是对数据进行翻转）
    state.tableData.order = 'desc';
    state.tableData.orderField = k.prop;
  }
  getTableData();
}
//返回上一级
const back = () => {

  router.back();
}
// 初始化表格数据
const getTableData = () => {
  state.tableData.loading = true;

  messheaderApi().searchMessHeader(
      {
        uid: 1,
        pageNum: state.tableData.param.pageNum,
        pageSize: state.tableData.param.pageSize,
        name: state.tableData.searchStr,
        order: state.tableData.order,
        orderField: state.tableData.orderField
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
  messheaderApi().getMessHeaderSearchListSize(
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

const onSearch = () => {
  state.tableData.searchStr = state.tableData.search;
  getTableData();
};

const onOpenEditDetail = (type: string, row: RowUserType) => {
  onOpenEditDetailByID(row.ID, row.Name, row.Type, row.Describes);

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
        messheaderApi().delIDS(state.tableData.ids
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
//批量拷贝
const onCopyIDS = (type: string) => {
  ElMessageBox.confirm(`此操作将批量复制：${state.tableData.ids.length}条，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })


      .then(() => {
        messheaderApi().copyIDS(state.tableData.ids
        )
            .then(res => {
              //console.log(res);
              if (res.code == '200') {

                ElMessage.success('成功批量复制' + res.data + '条');
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
const onOpenEditDetailByID = (id, name, type, desc) => {
  router.push({
    path: '/sysmanage/messheader/messheaderdetail',
    query: {id: id, name: name, type: type, desc: desc},
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
        messheaderApi().delMessHeader(
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
