<template>
	<div class="workflow-tool">
		<div class="pl15">{{ setToolTitle }}</div>
		<div class="workflow-tool-right">
			<div class="workflow-tool-icon" v-for="(v, k) in state.toolList" :key="k" :title="v.title" @click="onToolClick(v.fnName)">
				<SvgIcon :name="v.icon" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="pagesWorkflowTool">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['tool']);

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	toolList: [

			            {icon: 'ele-CloseBold', title: '关闭', fnName: 'closeWin'},
	],
});

// 设置 tool 标题
const setToolTitle = computed(() => {
	let { globalTitle } = themeConfig.value;
	return `网关规则展示示意图`;
});
// 顶部工具栏
const onToolClick = (fnName: string) => {
	emit('tool', fnName);
};
</script>

<style scoped lang="scss">
.workflow-tool {
	height: 35px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
	color: var(--el-text-color-primary);
	.workflow-tool-right {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 35px;
		line-height: 35px;
		display: flex;
		align-items: center;
		&:hover {
			background: rgba(0, 0, 0, 0.04);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
}
</style>
