<template>
    <div class="system-user-container layout-padding">
        <splitpanes class='default-theme' style='height: 100%' v-show='true'>
            <pane size='30' min-size="30" max-size="30">
                <leftindex @refresh="getTableData"></leftindex>
            </pane>
            <pane>
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
                    </div>
                    <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
                        <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                        <el-table-column type="index" label="序号" width="60"/>
                        <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Length" label="位数" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ArrayOr" label="是否数组" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="DefaultValue" label="默认值" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" width="100">
                            <template #default="scope">
                                <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                           @click="onOpenEdit('edit', scope.row)"
                                >修改
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
                <UserDialog ref="userDialogRef" @refresh="getTableData('2')"/>
            </pane>
        </splitpanes>
    </div>
</template>

<script setup lang="ts" name="systemUser">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {useRouter} from "vue-router";
    import 'splitpanes/dist/splitpanes.css';
	import { Splitpanes, Pane } from 'splitpanes';
    // 引入组件

    const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/dialog.vue'));
    const leftindex = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/leftindex.vue'));
    const router = useRouter();
    const stateconfig = reactive({
        url: '/sys/org/dept', loading: true, ids: [], moreParams: false,
        form: {} as any, single: true, multiple: true, list: [], total: 0,
        pageShow: false, leftPaneSize: 250 / (window.innerWidth - 220) * 100,
    });
    // 定义变量内容
    const userDialogRef = ref();
    const state = reactive<SysUserState>({
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

    // 初始化表格数据
    const getTableData = (id: string) => {
        state.tableData.loading = true;
        const data = [{
            id: 1,
            Name: '版本号',
            Type: 'unsigned short',
            Length: '4',
            ArrayOr: '否',
            DefaultValue: '0xf',
            describe: 'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        },{
            id: 2,
            Name: '服务类型',
            Type: 'unsigned int',
            Length: '8',
            ArrayOr: '是',
            DefaultValue: '0xeb',
            describe: 'IP数据包A头结构',
            createTime: new Date().toLocaleString(),
        }, {
            id: 3,
            Name: '序号',
            Type: 'int',
            Length: '8',
            ArrayOr: '否',
            DefaultValue: '0x99',
            describe: '序号',
            createTime: new Date().toLocaleString(),
        }, {
            id: 4,
            Name: '确认号',
            Type: 'int',
            Length: '8',
            ArrayOr: '否',
            DefaultValue: '0x33',
            describe: '确认号',
            createTime: new Date().toLocaleString(),
        },{
            id: 5,
            Name: '数据偏移',
            Type: 'unsigned short',
            Length: '4',
            ArrayOr: '否',
            DefaultValue: '0x1',
            describe: '偏移量',
            createTime: new Date().toLocaleString(),
        }, {
            id: 6,
            Name: '校验和',
            Type: 'unsigned long',
            Length: '16',
            ArrayOr: '否',
            DefaultValue: '0xffff',
            describe: '校验结果',
            createTime: new Date().toLocaleString(),
        }];
        var a,b;
		if(id=='1'){
			a=0;
			b=7;
		}else{
        a=Math.round(Math.random()*5);
        b=Math.round(Math.random()*(6-a))+a+1;

            }
			console.log(a,b)
			state.tableData.data = data.slice(a,b);

        state.tableData.total = state.tableData.data.length;
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

    const onOpenEditDetail = (type: string, row: RowUserType) => {
        router.push({
            path: '/sysmanage/messbody/messbodydetail',
            query: {id: row.ID},
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
        getTableData('1');
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
