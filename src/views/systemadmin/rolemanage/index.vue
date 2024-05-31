<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-input v-model="state.tableData.search" size="default" placeholder="请输入角色名称" style="max-width: 180px" > </el-input>
				<el-button size="default" type="primary" class="ml10"  @click="onSearch">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddRole('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增角色
				</el-button>
				                <el-button size="default" type="warning" class="mr10" @click="back()">
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回
                </el-button>
			</div>
			<el-table :cell-style="{'padding': '2px 2px 0 10px'}"  :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" :index="calcIndex" />
				<el-table-column prop="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleSign" label="角色标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip v-if="false"></el-table-column>
				<el-table-column prop="status" label="角色状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status=='true'">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="describes" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.roleName === '超级管理员'  " size="small" text type="primary" @click="onOpenEditRole('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.roleName === '超级管理员'  || scope.row.roleName === '管理员'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10,17, 20, 30]"
				v-model:current-page="state.tableData.param.pageNum"
				background
				v-model:page-size="state.tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</div>
		<RoleDialog ref="roleDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {userManageApi} from "/@/api/sysadmin/usermanage";
import {roleManageApi} from "/@/api/sysadmin/rolemanage";

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('/@/views/systemadmin/rolemanage/dialog.vue'));

// 定义变量内容
const roleDialogRef = ref();
const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 17,
		},
			        search: '',
            searchStr: '',
	},
});
    const  calcIndex=(index)=>{
        index=index+(state.tableData.param.pageNum-1)*state.tableData.param.pageSize+1
        return index
    }
        import {useRouter} from "vue-router";
    const router = useRouter();
    //返回上一级
    const back = () => {

        router.back();
    }
// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;

	 roleManageApi().search(
            {
                uid: 1,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
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
        roleManageApi().getSearchListSize(
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
	}, 500);
};
// 打开新增角色弹窗
const onOpenAddRole = (type: string) => {
	roleDialogRef.value.openDialog(type);
};
// 打开修改角色弹窗
const onOpenEditRole = (type: string, row: Object) => {
	roleDialogRef.value.openDialog(type, row);
};
    const onSearch = () => {
        state.tableData.searchStr=state.tableData.search;
       getTableData();
    };
// 删除角色
const onRowDel = (row: RowRoleType) => {
	ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			   roleManageApi().del(
                    {
                        id: row.id,

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
.system-role-container {
	.system-role-padding {
		padding: 15px;
		.el-table {
			flex: 1;
		}
	}
}
</style>
