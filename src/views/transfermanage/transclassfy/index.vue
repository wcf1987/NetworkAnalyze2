<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入消息转换分类名称" style="max-width: 180px"
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
          新增转换分类
        </el-button>
        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
          <el-icon>
            <ele-DeleteFilled/>
          </el-icon>
          批量删除
        </el-button>

      </div>

      <el-table :cell-style="{'padding': '2px 2px 0 10px'}" :data="state.tableData.data"
                v-loading="state.tableData.loading" style="width: 100%" @selection-change="handleSelectionChange"
                v-if="state.view=='list'">
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
        <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
        <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>

        <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                       @click="onOpenEdit('edit', scope.row)" class="buttonfont"
            >修改
            </el-button
            >

            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                       @click="onRowDel(scope.row)" class="buttonfont">删除
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
import {userManageApi} from "/@/api/sysadmin/usermanage";
import {transclassfyApi} from "/@/api/transmanage/transclassfy";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/transfermanage/transclassfy/dialog.vue'));
const router = useRouter();
// 定义变量内容
const userDialogRef = ref();
const state = reactive({
  transClassfyWithChildren: {
    data: [],
  },
  view: 'list',
  viewStr: '切换瀑布流显示',
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
  },
});
const calcIndex = (index) => {
  index = index + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1
  return index
}
// 初始化表格数据
const getTableData = () => {
  state.tableData.loading = true;
  transclassfyApi().search(
      {
        uid: 1,
        pageNum: state.tableData.param.pageNum,
        pageSize: state.tableData.param.pageSize,
        name: state.tableData.searchStr,
        type: 'Template'
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
  transclassfyApi().getSearchListSize(
      {
        uid: 1,
        name: state.tableData.searchStr,
        type: 'Template'
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
  state.tableData.searchStr = state.tableData.search;
  getTableData();
};
const onChangeView = () => {
  if (state.view == 'list') {
    state.view = 'waterfall';
    state.viewStr = '切换列表显示';
    state.tableData.param.pageSize = 12;
    getTableData();
  } else {
    state.view = 'list';

    state.viewStr = '切换瀑布流显示';
    state.tableData.param.pageSize = 10;
    getTableData();
  }

};
//多选监听
const handleSelectionChange = (val) => {
  state.tableData.ids = val.map(v => v.ID)
  //this.$message.warning("选择了"+this.ids.length+"条数据");
  console.log("选择了" + state.tableData.ids.length + "条数据")
};
//批量删除
const onDeleteIDS = (type: string) => {
  ElMessageBox.confirm(`此操作将批量删除分类：“${state.tableData.ids.length}”条及所含模板，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })


      .then(() => {
        transclassfyApi().delIDS(state.tableData.ids
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
const getTransClassfyWithChildren = () => {

  transclassfyApi()
      .searchWithChildren({
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        type: 'Template'
      })
      .then((res) => {
        //console.log(res);
        if (res.code == '200') {
          state.transClassfyWithChildren.data = res.data;
        } else {
          ElMessage.error(res.message);
        }
      })
      .catch((err) => {
      })
      .finally(() => {
      });
  //const data = [];

};
const getDIsCount = (id) => {
  let num = 0;
  for (let i of state.transClassfyWithChildren.data) {
    if (i.ID == id) {
      num = i.children.length;
    }
  }
  return num;
}
// 删除用户
const onRowDel = (row: RowUserType) => {
  let num = getDIsCount(row.ID);
  let propStr = '';
  if (num > 0) {
    propStr = '该分类下有' + num + '个模板，此操作将永久删除：' + row.Name + ',并删除旗下所有模板，是否继续?';
  } else {
    propStr = '此操作将永久删除：' + row.Name + '，是否继续?';
  }

  ElMessageBox.confirm(propStr, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        transclassfyApi().del(
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
  getTransClassfyWithChildren();
});
</script>

<style scoped lang="scss">
.system-user-container {
  .system-user-search {
    display: flex;

    .eltagr {
      margin-left: auto;
      margin-right: 10px;
    }
  }

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
