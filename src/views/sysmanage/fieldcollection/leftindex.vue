<template>
    <div class="system-dept-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-dept-search mb15">
                <el-input size="default" placeholder="请输入标准名称" style="max-width: 180px"></el-input>
                <el-button size="default" type="primary" class="ml10">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>

                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenAddDept('add')">
                    <el-icon>
                        <ele-FolderAdd/>
                    </el-icon>

                </el-button>
            </div>
            <el-table
                    :data="state.tableData.data"
                    v-loading="state.tableData.loading"
                    style="width: 100%"
                    row-key="id"
                    default-expand-all
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
                <el-table-column prop="classifyName" label="标准名称" show-overflow-tooltip ></el-table-column>

                <el-table-column label="操作" show-overflow-tooltip >
                    <template #default="scope">
                        <el-button size="small" text type="primary" @click="onOpenEditDept('edit', scope.row)">修改
                        </el-button>
                        <el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <DeptDialog ref="deptDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts" name="systemDept">
    import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
    import {ElMessage, ElMessageBox} from 'element-plus';

    // 引入组件
    const DeptDialog = defineAsyncComponent(() => import('/@/views/sysmanage/fieldcollection/leftdialog.vue'));

    // 定义变量内容
    const deptDialogRef = ref();
    const state = reactive<SysDeptState>({
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
    const getTableData = () => {
        state.tableData.loading = true;
        state.tableData.data = [];
        state.tableData.data.push({

            classifyName: '消息字段合集',
            id: '1',
            children: [
                {
                    classifyName: '数据包标准ISO9.1',
                    id: '2',
                    children:[
						{
							classifyName: '子包标准IS13.1',
                    id: '11',
						},{
                    	classifyName: '子包标准IS13.2',
                    id: '12',
						},{
                    	classifyName: '子包标准IS13.3',
                    id: '13',
						}
					]
                },
                {
                    classifyName: '飞控标准CN3-2',
                    id: '2',
					children:[
						{
							classifyName: '陆航机0.1.3',
                    id: '21',
						},{
                    	classifyName: '舰载机1.0.2',
                    id: '22',
						},{
                    	classifyName: '无人机9.3',
                    id: '23',
						}
					]
                },
            ],
        });
        state.tableData.total = state.tableData.data.length;
        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
    };
    // 打开新增菜单弹窗
    const onOpenAddDept = (type: string) => {
        deptDialogRef.value.openDialog(type);
    };
    // 打开编辑菜单弹窗
    const onOpenEditDept = (type: string, row: DeptTreeType) => {
        deptDialogRef.value.openDialog(type, row);
    };
    // 删除当前行
    const onTabelRowDel = (row: DeptTreeType) => {
        ElMessageBox.confirm(`此操作将永久删除标准：${row.deptName}, 是否继续?`, '提示', {
            confirmButtonText: '删除',
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
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>
