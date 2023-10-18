<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入字段名称" style="max-width: 180px"></el-input>
                <el-button size="default" type="primary" class="ml10">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>
                    查询
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
                    <el-icon>
                        <ele-FolderAdd/>
                    </el-icon>
                    新增字段
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenImport('add')">
                    <el-icon>
                        <ele-DocumentAdd/>
                    </el-icon>
                    从数据域引入字段
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenGroup('add')">
                    <el-icon>
                        <ele-Wallet/>
                    </el-icon>
                    新增嵌套结构
                </el-button>
                                <el-button size="default" type="warning" class="mr10" @click="this.$router.back()" v-if="state.tableData.deep!=0">
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回上一级
                </el-button>
            </div>
            <el-table :data="state.tableData.data" row-key="id" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60"/>
                     <el-table-column prop="Nest" label="名称" v-if="false"></el-table-column>
                        <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="EName" label="引用名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ShortName" label="简称" show-overflow-tooltip></el-table-column>
                <el-table-column type="Flag" label="数据标识" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Describe" label="说明" show-overflow-tooltip v-if="isHide"></el-table-column>
                        <el-table-column prop="TypeCode" label="数据格式内码" show-overflow-tooltip v-if="isHide"></el-table-column>
                        <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="TableName" label="标准表名" show-overflow-tooltip v-if="isHide"></el-table-column>
                        <el-table-column prop="TableSaveName" label="标准表存储名" show-overflow-tooltip v-if="isHide"></el-table-column>
                        <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip v-if="isHide"> </el-table-column>


                <el-table-column label="操作" width="160">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >
                       <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEditGroup('edit', scope.row)"
                                    v-if="scope.row.Nest=='2'">编辑嵌套
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
        <ImportDialog ref="importDialogRef" @refresh="getTableData()"/>
        <GroupDialog ref="groupDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRoute, useRouter} from "vue-router";

    // 引入组件
    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/detaildialog.vue'));
    const ImportDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/importdialog.vue'));
    const GroupDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/groupdialog.vue'));
    const route = useRoute()
    const router = useRouter();
        const querys = route.query
    // 定义变量内容
    const userDialogRef = ref();
    const importDialogRef=ref();
    const groupDialogRef=ref();
    const isHide=ref(false);
    const state = reactive({
        tableData: {
            data: [],
            total: 0,
                        id:'',
            deep:'',
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
        },
    });

    // 初始化表格数据
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
            Name: 'G1',
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
                Name: 'G2',
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
        const data1 = [{
            id: 1,
            Nest:0,
            Flag: '数据域',
            Name:'节点类型',
            EName:'dataype',
            ShortName:'数据类型',
            TypeCode:'12',
            Length:'4',
            TableName:'',
            TableSaveName:'',
            Type:'int16_t',
            Describe:'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 2,
            Nest:0,
                     Flag: '标识域',
            Name:'节点速率',
            EName:'datalength',
            ShortName:'数据长度',
            TypeCode:'12',
            Length:'1',
            TableName:'',
            TableSaveName:'',
            Type:'int8_t',
            Describe:'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        },{
            id: 3,
            Nest:1,
            Flag: '标识域',
            Name:'嵌套结构',
            EName:'',
            ShortName:'',
            TypeCode:'',
            Length:'',
            TableName:'',
            TableSaveName:'',
            Type:'',
            Describe:'嵌套结构',
            createTime: new Date().toLocaleString(),
        },
        ];

        const data2 = [{
            id: 1,
            Nest:0,
            Flag: '数据域',
            Name:'威力半径',
            EName:'dataype',
            ShortName:'数据类型',
            TypeCode:'12',
            Length:'4',
            TableName:'',
            TableSaveName:'',
            Type:'int16_t',
            Describe:'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 2,
            Nest:0,
                     Flag: '标识域',
            Name:'火力强度',
            EName:'datalength',
            ShortName:'数据长度',
            TypeCode:'12',
            Length:'1',
            TableName:'',
            TableSaveName:'',
            Type:'int8_t',
            Describe:'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }
        ];


        state.tableData.id=querys.id;
        state.tableData.deep=querys.deep;
        if(state.tableData.deep==0){
            state.tableData.data = data;
        }
        if(state.tableData.deep==1){
            state.tableData.data = data1;
        }
        if(state.tableData.deep==2){
            state.tableData.data = data2;
        }
        state.tableData.total = state.tableData.data.length;
        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
    };
    // 打开新增用户弹窗
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type);
    };
    const onOpenGroup = (type: string) => {
        groupDialogRef.value.openDialog(type);
    };
    const onOpenImport= (type: string) => {
        importDialogRef.value.openDialog(type);
    };
    // 打开修改用户弹窗
    const onOpenEdit = (type: string, row) => {
               if(row.Nest=='1'){
            groupDialogRef.value.openDialog(type, row);
        }else{
           userDialogRef.value.openDialog(type, row);
        }
    };

    const onOpenEditDetail = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messheader/messheaderdetail',
            query: {id: row.ID},
        });
    };
    const onOpenEditGroup = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messheader/messheaderdetail',
            query: {id: row.ID,deep:parseInt(state.tableData.deep)+1},
        });
    };

    // 删除用户
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除名称：“${row.Name}”，是否继续?`, '提示', {
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
