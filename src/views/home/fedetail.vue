<template>
  <div class="system-user-container ">

    <el-card shadow="hover" class="layout-padding-auto">
      <div class="flex-title">DFI-DUI统计情况</div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%"
               >


        <el-table-column prop="DFINO" label="DFI标示号" show-overflow-tooltip />
        <el-table-column prop="DUINum" label="DUI总数" show-overflow-tooltip/>
        <el-table-column prop="DUIPer" label="DUI占比" show-overflow-tooltip />

      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[6, 20, 30]"
          v-model:current-page="state.tableData.param.pageNum"
          background
          v-model:page-size="state.tableData.param.pageSize"
          layout="total,  prev, pager, next"
          :total="state.tableData.total"
      >
      </el-pagination>
    </el-card>

  </div>
</template>

<script setup lang="ts" name="systemUser">
import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {fieldsdetailApi} from "/@/api/sysmanage/fieldsdetail";
// 引入组件

const isHide = ref(false);




// 定义变量内容

const state = reactive({
  id: 0,
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 4,
    },
    order: 'asc',
    search: '',
    searchStr: '',
  },
});

// 初始化表格数据
const getTableData = () => {
  state.tableData.loading = true;
  fieldsdetailApi().statistics(
      {
        pageNum: state.tableData.param.pageNum,
        pageSize: state.tableData.param.pageSize,
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
  fieldsdetailApi().statisticsSize(
      {

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
  .flex-title {
                margin-bottom: 15px;
                display: flex;
                font-size: 15px;
                font-weight: bold;
                color: #303133;
                justify-content: space-between;

                .flex-title-small {
                    font-size: 15px;
                }
            }
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
