<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入DFI标示号" style="max-width: 180px"
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
          新增数据域
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenImport('add')">
          <el-icon>
            <ele-Upload/>
          </el-icon>
          导入
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenImportAll('add')">
          <el-icon>
            <ele-UploadFilled/>
          </el-icon>
          导入DFI+DUI
        </el-button>
                <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%"
                @sort-change="sort_change" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="30"/>
        <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
        <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
        <el-table-column prop="IDNO" label="标识号" sortable="custom"/>
        <el-table-column prop="Version" label="版本" v-if="isHide"/>
        <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ShortName" label="简称" show-overflow-tooltip v-if="isHide"></el-table-column>
        <el-table-column prop="Describes" label="注释" show-overflow-tooltip v-if="isHide"></el-table-column>
        <el-table-column prop="ApplicableMess" label="适用消息" show-overflow-tooltip v-if="isHide"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                       @click="onOpenEdit('view', scope.row)"
            >详情
            </el-button
            >
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
    <ImportDialog
        v-model:showDialog="isShowImport" :download-fun="downLoadPlanEvent" :import-fun="fieldsApi().uploadfile"
        @import-success="getTableData()"
    />
    <ImportDialogAll
        v-model:showDialog="isShowImportAll" :download-fun="downLoadPlanEventAll"
        :import-fun="fieldsApi().uploadfileall" @import-success="getTableData()"
    />

  </div>
</template>

<script setup lang="ts" name="systemUser">
import {defineAsyncComponent, reactive, onMounted, ref} from 'vue';
import {ElMessageBox, ElMessage} from 'element-plus';
import {useRouter} from "vue-router";
import {fieldsApi} from "/@/api/sysmanage/fields";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/dialog.vue'));
const ImportDialog = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/importdialog.vue'));
const ImportDialogAll = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/importdialogall.vue'));
const router = useRouter();
// 定义变量内容
const userDialogRef = ref();
const isHide = ref(true);

import {downLoadxls, downFile} from "/@/utils/util";


const isShowImport = ref(false);
const isShowImportAll = ref(false);
const downLoadPlanEvent = () => {

  downFile("DFI模板下载.xls");

};
const downLoadPlanEventAll = () => {

  downFile("DFI+DUI模板下载.xls");

};
const state = reactive({
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
    order: 'asc',
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
  fieldsApi().searchFields(
      {
        uid: 1,
        pageNum: state.tableData.param.pageNum,
        pageSize: state.tableData.param.pageSize,
        name: state.tableData.searchStr,
        order:state.tableData.order
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
  fieldsApi().getFieldsSearchListSize(
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
const onOpenImport = (type: string) => {
  isShowImport.value = true;
};
const sort_change=(k: any) => {
  if (k.order === 'ascending') {
    // 升序排序 stopped在前
    state.tableData.order='asc';
  } else if (k.order === 'descending') {
    // 降序排序 running在前（使用reverse是对数据进行翻转）
    state.tableData.order='desc';
  }
  getTableData();
}
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
                fieldsApi().delIDS(                                          state.tableData.ids

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
const onOpenImportAll = (type: string) => {
  isShowImportAll.value = true;
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
  router.push({
    path: '/sysmanage/fieldcollection/fieldsdetail',
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
        fieldsApi().delFields(
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
}
</style>
