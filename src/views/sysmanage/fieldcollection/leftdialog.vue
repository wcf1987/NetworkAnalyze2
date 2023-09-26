<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="deptDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="上级标准">
							<el-cascader
								:options="state.classifyData"
								:props="{ checkStrictly: true, value: 'classifyName', label: 'classifyName' }"
								placeholder="请选择标准"
								clearable
								class="w100"
								v-model="state.ruleForm.deptLevel"
							>
								<template #default="{ node, data }">
									<span>{{ data.classifyName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="标准名称">
							<el-input v-model="state.ruleForm.deptName" placeholder="请输入标准名称" clearable></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="标准描述">
							<el-input v-model="state.ruleForm.describe" type="textarea" placeholder="请输入标准描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { reactive, ref } from 'vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const deptDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		deptLevel: [] as string[], // 上级部门
		deptName: '', // 部门名称
		person: '', // 负责人
		phone: '', // 手机号
		email: '', // 邮箱
		sort: 0, // 排序
		status: true, // 部门状态
		describe: '', // 部门描述
	},
	classifyData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: RowDeptType) => {
	if (type === 'edit') {
		row.deptLevel = ['字段合集'];

		state.ruleForm = row;
		state.dialog.title = '修改标准名称';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增标准';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	deptDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.isShowDialog = true;
	getMenuData();
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
const getMenuData = () => {
	state.classifyData.push({
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
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
