<template>
    <div class="system-user-dialog-container">
        <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="900px" draggable="true">

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
                <el-table :data="state.tableData.data" row-key="id" v-loading="state.tableData.loading"
                          style="width: 100%">
                    <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                    <el-table-column type="index" label="序号" width="60"/>
                    <el-table-column prop="Nest" label="名称" v-if="false"></el-table-column>
                    <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ShortName" label="简称" show-overflow-tooltip></el-table-column>
                    <el-table-column type="Flag" label="数据标识" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="Describe" label="说明" show-overflow-tooltip v-if="isHide"></el-table-column>
                    <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip
                                     v-if="isHide"></el-table-column>
                    <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip
                                     v-if="isHide"></el-table-column>
                    <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip
                                     v-if="isHide"></el-table-column>
                    <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip
                                     v-if="isHide"></el-table-column>

                    <el-table-column label="操作" width="80">
                        <template #default="scope">
                            <el-button v-if="false" :disabled="scope.row.userName === 'admin'" size="small" text
                                       type="primary"
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
            <UserDialog ref="userDialogRef" @refresh="getTableData()"/>


        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="systemUserDialog">
    import {nextTick, onMounted, reactive, ref} from 'vue';

    import {useRoute} from "vue-router";
    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['refresh']);
    const route = useRoute()
    const querys = route.query
    // 定义变量内容
    const userDialogFormRef = ref();
    const rules = reactive({
// 普通的校验规则
        name: [
            {required: true, message: '名称不能为空'},
            {min: 1, max: 10, message: '名称长度为1 - 10位'},
        ],
    });
    const state = reactive({
        ruleForm: {
            Name: '', // 账户名称
            sourmess: '',
            tarmess: '',
            describe: '', // 用户描述
        },
        dialog: {
            isShowDialog: false,
            type: '',
            title: '',
            submitTxt: '',
        },
        tableData: {
            data: [],
            id: '',
            deep: '',
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
        },
    });

    // 打开弹窗
    const openDialog = (type: string, row: RowUserType) => {

        state.dialog.title = '查看';
        state.dialog.submitTxt = '新 增';
        getTableData();
        // 清空表单，此项需加表单验证才能使用
        nextTick(() => {
            userDialogFormRef.value.resetFields();
        });

        state.dialog.isShowDialog = true;

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
    const getTableData = () => {
        state.tableData.loading = true;
        const data = [{
            id: 1,
            Nest: 0,
            Flag: '数据域',
            Name: '数据类型',
            EName: 'dataype',
            ShortName: '数据类型',
            TypeCode: '12',
            Length: '4',
            TableName: '',
            TableSaveName: '',
            Type: 'int16_t',
            Describe: 'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 2,
            Nest: 0,
            Flag: '标识域',
            Name: '数据长度',
            EName: 'datalength',
            ShortName: '数据长度',
            TypeCode: '12',
            Length: '1',
            TableName: '',
            TableSaveName: '',
            Type: 'int8_t',
            Describe: 'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 3,
            Nest: 1,
            Flag: '标识域',
            Name: '数据组',
            EName: '',
            ShortName: '',
            TypeCode: '',
            Length: '',
            TableName: '',
            TableSaveName: '',
            Type: '',
            Describe: '嵌套结构',
            createTime: new Date().toLocaleString(),
            children: [{
                id: 11,
                Nest: 0,
                Flag: '数据域',
                Name: '节点类型',
                EName: 'dataype',
                ShortName: '数据类型',
                TypeCode: '12',
                Length: '4',
                TableName: '',
                TableSaveName: '',
                Type: 'int16_t',
                Describe: 'IP数据包A头结构',
                createTime: new Date().toLocaleString(),
            }, {
                id: 12,
                Nest: 0,
                Flag: '标识域',
                Name: '节点速率',
                EName: 'datalength',
                ShortName: '数据长度',
                TypeCode: '12',
                Length: '1',
                TableName: '',
                TableSaveName: '',
                Type: 'int8_t',
                Describe: 'IP数据包A头结构',
                createTime: new Date().toLocaleString(),
            }, {
                id: 13,
                Nest: 1,
                Flag: '标识域',
                Name: '数据组',
                EName: '',
                ShortName: '',
                TypeCode: '',
                Length: '',
                TableName: '',
                TableSaveName: '',
                Type: '',
                Describe: '数据组',
                createTime: new Date().toLocaleString(),
                children: [{
                    id: 21,
                    Nest: 0,
                    Flag: '数据域',
                    Name: '威力半径',
                    EName: 'dataype',
                    ShortName: '数据类型',
                    TypeCode: '12',
                    Length: '4',
                    TableName: '',
                    TableSaveName: '',
                    Type: 'int16_t',
                    Describe: 'IP数据包A头结构',
                    createTime: new Date().toLocaleString(),
                }, {
                    id: 22,
                    Nest: 0,
                    Flag: '标识域',
                    Name: '火力强度',
                    EName: 'datalength',
                    ShortName: '数据长度',
                    TypeCode: '12',
                    Length: '1',
                    TableName: '',
                    TableSaveName: '',
                    Type: 'int8_t',
                    Describe: 'IP数据包A头结构',
                    createTime: new Date().toLocaleString(),
                }
                ]
            },
            ]
        },
        ];


        state.tableData.id = querys.id;
        state.tableData.deep = querys.deep;

        state.tableData.data = data;


        state.tableData.total = state.tableData.data.length;
        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
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