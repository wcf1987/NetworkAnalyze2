<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input  clearable size="default" placeholder="请输入字段名称" style="max-width: 180px"
                  v-model="state.tableData.search"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="onSearch">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onRowExpand">
          <el-icon>
            <ele-Expand/>
          </el-icon>
          展开/收起
        </el-button>
        <el-button size="default" type="primary" class="ml10" @click="viewMess('view')">
          <el-icon>
            <ele-Coin/>
          </el-icon>
          查询数据源定义
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
            :content="'源消息体名称：'+state.tableData.sourceName+'\n'"
            placement="top"
        >
          <el-tag type="info" effect="dark" round class="eltagr">源消息:{{ state.tableData.sourceName }}</el-tag>
        </el-tooltip>
      </div>
      <el-table :expand-row-keys="state.expandArr" :cell-style="{'padding': '2px 2px 0 10px'}"
                :data="state.tableData.data" row-key="ID" v-loading="state.tableData.loading" style="width: 100%">

        <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
        <el-table-column prop="parentindex" label="序号" />
        <el-table-column prop="Name" label="目的字段名" show-overflow-tooltip></el-table-column>

        <el-table-column prop="TName" label="转换名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="TransID" label="转换ID" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column prop="FieldsID" label="字段外键" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column prop="OutType" label="类型" show-overflow-tooltip v-if="false"></el-table-column>


        <el-table-column prop="Optional" label="转换模式" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Transrule" label="转换规则" show-overflow-tooltip></el-table-column>

        <el-table-column prop="DefaultValue" label="源字段" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column label="操作" width="90">
          <template #default="scope">
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                       @click="onOpenEdit('edit', scope.row)" v-if="scope.row.OutType!='nest'" class="buttonfont"
            >修改
            </el-button
            >


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
    <ViewDialog ref="viewDialogRef" @refresh="getTableData()"/>
  </div>
</template>

<script setup lang="ts">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRoute, useRouter} from "vue-router";
import {messtranslateApi} from "/@/api/sysmanage/messtranslate";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messtraslate/detaildialog.vue'));
const ViewDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messtraslate/viewdialog.vue'));

const router = useRouter();
// 定义变量内容
const userDialogRef = ref();
const viewDialogRef = ref();
const route = useRoute()
const querys = route.query
const state = reactive({
  expandArr: [],
  tableData: {
    id: 0,
    sourceid: 0,
    targetid: 0,
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

//返回上一级
const back = () => {

  router.back();
}

/**
 * 控制行展开状态的函数
 *
 * 该函数用于管理表格中行的展开和折叠状态。它通过操作state.expandArr数组来实现。
 * 当数组为空时，意味着所有行都是折叠的，此时函数会将当前行展开；
 * 当数组不为空时，意味着至少有一行是展开的，此时函数会将所有行折叠。
 *
 * 注意：该函数目前缺少对展开行ID的管理，这可能导致无法正确地展开或折叠行。
 */
const onRowExpand = () => {
  // 输出当前展开的行ID数组用于调试
  //console.log(state.expandArr);

  // 检查展开数组是否为空
  //state.expand=false;
  if (state.expandArr.length == 0) {
    // 如果展开数组为空，意味着所有行都是折叠的，因此需要将当前行展开
    //expandArr中之前有这个数据 --去除它
    expandID(state.tableData.data);

  } else {
    // 如果展开数组不为空，意味着至少有一行是展开的，此时应该将所有行折叠
    //原来没有这个数据 --增加它
    state.expandArr = [];
  }
}

/**
 * 将列表中具有子项的项的ID添加到展开数组中。
 * 该函数递归处理列表中的每个项，如果项有子项，则将其ID转换为字符串并添加到展开数组中。
 * 这样做的目的是为了在用户界面中可能的展开/收起功能，标记哪些项应该默认是展开的。
 *
 * @param {Array} list - 包含项的列表，这些项可能有子项。
 *
 * 注意：该函数修改了全局状态对象state的expandArr属性，因此应该谨慎调用，
 * 确保不会意外地影响应用的状态管理。
 */
function expandID(list) {
  for (let i of list) {
    if (i.children != null) {
      state.expandArr.push(i.ID + "");
      expandID(i.children)
    }
  }
}

const onSearch = () => {
  state.tableData.searchStr = state.tableData.search;
  getTableData();
};

function walkTreeJSONParse(tree) {
  let node, list = [...tree], nodes = []

  while (node = list.shift()) {
    node.SourceData = JSON.parse(node.SourceData)
    node.Funcrule = JSON.parse(node.Funcrule)
    nodes.push(node)
    node.children && list.unshift(...node.children)
  }

  return nodes
}

// 初始化表格数据
const getTableData = () => {
  state.tableData.loading = true;
  messtranslateApi().searchMessTranslateDetail(
      {
        uid: 1,
        pid: state.tableData.targetid,
        transid: state.tableData.id,
        pageNum: state.tableData.param.pageNum,
        pageSize: state.tableData.param.pageSize,
        name: state.tableData.searchStr,
        ttype: 'body'
      })
      .then(res => {
        console.log(res);
        if (res.code == '200') {
          walkTreeJSONParse(res.data);


          state.tableData.data = res.data;
          console.log(state.tableData.data);
          let id = 0;
          for (let i of state.tableData.data) {
            i.parentindex = id + (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize + 1;
            id = id + 1;
          }
          onRowExpand();
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
  //const data = [];
  messtranslateApi().getMessTranslateDetailSearchListSize(
      {
        uid: 1,
        name: state.tableData.searchStr,
        pid: state.tableData.targetid,
        transid: state.tableData.id,
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
  }, 500);
};
// 打开新增用户弹窗
const onOpenAdd = (type: string) => {
  userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEdit = (type: string, row: RowUserType) => {
  userDialogRef.value.openDialog(type, state.tableData.sourceid, row, 'TableEdit');
};

const onOpenEditDetail = (type: string, row: RowUserType) => {
  router.push({
    path: '/sysmanage/messbody/messbodydetail',
    query: {id: row.ID},
  });
};
const viewMess = (type: string, row) => {
  console.log(state.tableData);
  viewDialogRef.value.openDialog(type, state.tableData.sourceid,state.tableData.sourceName);
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
        messtranslateApi().delDetailIDS(state.tableData.ids
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
// 删除用户
const onRowDel = (row: RowUserType) => {
  ElMessageBox.confirm(`此操作将永久删除：“${row.Name}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
      .then(() => {
        getTableData();
        ElMessage.success('删除成功');
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

  state.tableData.sourceid = querys.sourceid;
  state.tableData.targetid = querys.targetid;
  state.tableData.sourceName=querys.sourceName;
  state.tableData.targetName=querys.targetName;
  getTableData();
});
</script>

<style scoped lang="scss">
.system-user-container {
  .system-user-search {
    display: flex;

    .el-tag {
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
