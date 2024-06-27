<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="800px" :draggable="true">
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

                </div>
                <el-table :cell-style="{'padding': '2px 2px 0 10px'}" :data="state.tableData.data" row-key="ID" v-loading="state.tableData.loading"
                          style="width: 100%">
                    <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                    <el-table-column prop="parentindex" label="序号" width="180"/>
                    <el-table-column prop="Name" label="目的字段名" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="TName" label="转换名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="TransID" label="转换ID" show-overflow-tooltip v-if="false"></el-table-column>
                    <el-table-column prop="FieldsID" label="字段外键" show-overflow-tooltip v-if="false"></el-table-column>
                    <el-table-column prop="OutType" label="类型" show-overflow-tooltip v-if="false"></el-table-column>


                    <el-table-column prop="Optional" label="转换模式" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Transrule" label="转换规则" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="DefaultValue" label="源字段" show-overflow-tooltip
                                     v-if="false"></el-table-column>
                    <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip
                                     v-if="false"></el-table-column>

                    <el-table-column label="操作" width="100">
                        <template #default="scope">
                            <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                       @click="onOpenEdit('edit', scope.row)" v-if="scope.row.OutType!='nest'"
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
            <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">保 存</el-button>
				</span>
            </template>
            <EditDialog ref="editDialogRef" @refresh="getTableData()" @update="updateTable"/>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="systemUserDialog">
    import {defineAsyncComponent, reactive, ref} from 'vue';
    import {useRoute} from "vue-router";

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
            dataAll: [],
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
    const openDialog = (type: string, data, fd, gd) => {
        state.tableData.loading = true;
        state.tableData.dataAll = data;
        let id = 0;
        for (let i of state.tableData.dataAll) {
            i.parentindex = id + 1;
            id = id + 1;
        }
        state.dialog.title = '修改';
        state.dialog.submitTxt = '修 改';
        state.fd = fd;
        state.gd = gd;
        getTableData();

        setTimeout(() => {
            state.tableData.loading = false;
        }, 100);


        state.dialog.isShowDialog = true;

    };
    const onOpenEdit = (type: string, row: RowUserType) => {
        editDialogRef.value.openDialog(type, row, state.fd, state.gd);
    };
    // 关闭弹窗
    const closeDialog = () => {

        state.dialog.isShowDialog = false;
    };
    const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    const updateTable = (row) => {
        for (let i = 0; i < state.tableData.total; i++) {
            if (state.tableData.dataAll[i].ID == row.ID) {
                state.tableData.dataAll.splice(i, 1, row);
            }
        }
        getTableData();

    }
    const getTableData = () => {
        state.tableData.total = state.tableData.dataAll.length;
        let start = (state.tableData.param.pageNum - 1) * state.tableData.param.pageSize;
        let end = start + state.tableData.param.pageSize;
        state.tableData.data = state.tableData.dataAll.slice(start, end);


    }
    // 取消
    const onCancel = () => {
        closeDialog();
    };
    // 提交
    const onSubmit = () => {
        closeDialog();
        emit('refresh', state.tableData.dataAll);
        // if (state.dialog.type === 'add') { }
    };
    // 初始化部门数据
    const onHandleSizeChange = (val: number) => {
        state.tableData.param.pageSize = val;
        getTableData();
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
        state.tableData.param.pageNum = val;
        getTableData();
    };

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