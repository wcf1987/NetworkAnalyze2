<template>
	<div>
		<el-drawer :title="`${state.nodeData.type === 'bezier' ? '连接' : '节点'}操作`" v-model="state.isOpen" size="320px">
			<el-scrollbar>
				<Lines v-if="state.nodeData.type === 'bezier'" @change="onLineChange" @close="close" ref="lineRef" />
				<Nodes v-else @submit="onNodeSubmit" @close="close" ref="nodeRef" />
			</el-scrollbar>
		</el-drawer>
	</div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawer">
import { defineAsyncComponent, reactive, ref, nextTick } from 'vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['label', 'node']);

// 引入组件
const Lines = defineAsyncComponent(() => import('./line.vue'));
const Nodes = defineAsyncComponent(() => import('./node.vue'));

// 定义变量内容
const lineRef = ref();
const nodeRef = ref();
const state = reactive({
	isOpen: false,
	nodeData: {
		type: 'node',
	},

});

// 打开抽屉
const open = (item,lf) => {
	state.isOpen = true;
	state.nodeData = item;
	nextTick(() => {
		setTimeout(() => {
			if (item.type === 'bezier') lineRef.value.getParentData(item,lf);
			else nodeRef.value.getParentData(item,lf);
		}, 300);
	});
};
// 关闭
const close = () => {
	state.isOpen = false;
};
// 线 label 内容改变时
const onLineChange = (label: string) => {

};
// 节点内容改变时
const onNodeSubmit = (data: object) => {

};

// 暴露变量
defineExpose({
	open,
});
</script>
