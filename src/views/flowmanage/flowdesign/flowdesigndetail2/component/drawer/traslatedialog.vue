<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="800px" :draggable="true">
                   <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入字段名称" style="max-width: 180px"  v-model="state.tableData.search"></el-input>
                <el-button size="default" type="primary" class="ml10"  @click="onSearch">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>
                    查询
                </el-button>

            </div>
            <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="Name" label="转换名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TargetName" label="目的字段名" show-overflow-tooltip></el-table-column>

                <el-table-column prop="Optional" label="转换模式" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Transrule" label="转换规则" show-overflow-tooltip></el-table-column>

                <el-table-column prop="DefaultValue" label="源字段" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column label="操作" width="60">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
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
                    :page-sizes="[10, 20, 30]"
                    v-model:current-page="state.tableData.param.pageNum"
                    background
                    v-model:page-size="state.tableData.param.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="state.tableData.total"
            >
            </el-pagination>
        </el-card>
            <EditDialog ref="editDialogRef" @refresh="getTableData()"/>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="systemUserDialog">
    import {defineAsyncComponent, nextTick, reactive, ref} from 'vue';
    import {useRoute} from "vue-router";
    import {messtranslateApi} from "/@/api/sysmanage/messtranslate";
    import {ElMessage} from "element-plus";

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const EditDialog = defineAsyncComponent(() => import('/@/views/flowmanage/flowdesign/flowdesigndetail2/component/drawer/editdialog.vue'));
    const editDialogRef = ref();
    // 定义变量内容



   const state = reactive({
               dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
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
        },
    });
    const route = useRoute()
    const querys = route.query
    // 打开弹窗
    const openDialog = (type: string,targetid, transid) => {
        state.tableData.loading = true;
        state.tableData.id=transid;
        state.tableData.targetid=targetid;

   messtranslateApi().searchMessTranslateDetail(
            {
                uid: 1,
                pid:  state.tableData.targetid,
                transid: state.tableData.id,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
                ttype: 'body'
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {
                    for (let i = 0; i < res.data.length; i++) {
                    res.data[i].SourceData = JSON.parse(res.data[i].SourceData)
                    res.data[i].Funcrule = JSON.parse(res.data[i].Funcrule)
                }
                    state.tableData.data = res.data;

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
                pid:  state.tableData.targetid,
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

            state.dialog.title = '查看';
            state.dialog.submitTxt = '关 闭';

        state.dialog.isShowDialog = true;

    };
        const onOpenEdit = (type: string, row: RowUserType) => {
        editDialogRef.value.openDialog(type, row);
    };
    // 关闭弹窗
    const closeDialog = () => {
        state.dialog.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
        closeDialog();
    };
    // 提交
    const onSubmit = () => {
        closeDialog();
        emit('refresh');
        // if (state.dialog.type === 'add') { }
    };
    // 初始化部门数据


    // 暴露变量
    defineExpose({
        openDialog,
    });

</script>

<style scoped lang="scss">
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