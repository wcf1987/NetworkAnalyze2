<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="800px" draggable="true">
                   <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入字段名称" style="max-width: 180px"></el-input>
                <el-button size="default" type="primary" class="ml10">
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
                <el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
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
        },
    });

    // 打开弹窗
    const openDialog = (type: string, transid) => {
        state.tableData.loading = true;
     const data = [{
            id: 1,
            Name: '版本号转换',
            TargetName: 'version',
            Optional:'默认值',
            Transrule:'0x01',
            DefaultValue: '0xf',
            describe: 'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 2,
            Name: '服务类型转换',
            TargetName: 'type',
            Optional:'直接转换',
            Transrule:'A.type',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',

            createTime: new Date().toLocaleString(),
        }, {
            id: 3,
            Name: '电量计算',
            TargetName: 'power',
            Optional:'系统函数',
            Transrule:'CalcPower(A.power)',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',

            createTime: new Date().toLocaleString(),
        }, {
            id: 4,
            Name: '进度汇总',
            TargetName: 'schedule',
            Optional:'自定义转换计算',
            Transrule:'(A.score+A.aditional)/100',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',

            createTime: new Date().toLocaleString(),
        },

        ];

      state.tableData.data = data;
        state.tableData.total = state.tableData.data.length;
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
