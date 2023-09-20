<template>
	<div class="system-user-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入消息头名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增消息头对象
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column prop="ID" label="ID" width="60" v-if="false"/>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="Type" label="格式" show-overflow-tooltip></el-table-column>
				<el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="180">
					<template #default="scope">
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEdit('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditDetail('edit', scope.row)"
							>编辑详细</el-button
						>
						<el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {useRouter} from "vue-router";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/sysmanage/messheader/dialog.vue'));
const router = useRouter();
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
const getTableData = () => {
	state.tableData.loading = true;
	 const data =  [{
	 			id:1,
                Name: '消息头A',
                Type: '可变长度',

                describe: '特殊通讯稿A',
                createTime: new Date().toLocaleString(),
            }, {
	 	id:2,
		 Name: '消息头B',
                Type: '固定长度',

                describe: '特殊通讯稿B',
                createTime: new Date().toLocaleString(),
            }];


	state.tableData.data = data;
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
			path: '/sysmanage/messheader/messheaderdetail',
			query: { id: row.ID },
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
		.catch(() => {});
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
