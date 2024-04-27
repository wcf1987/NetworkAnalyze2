<script setup lang="ts">
import { reactive } from 'vue';
import { Random } from 'mockjs';
import TransferFunctionItem from './transferFunctionItem.vue';

const fakedata = reactive(
	new Array(3).fill(1).map(() => ({
		name: `${Random.string('ABCDEFGHIJKLMN', 1, 1)},${Random.string('ABCDEFGHIJKLMN', 1, 1)}`,
		children: new Array(Random.integer(2, 8)).fill(1).map((i, index) => ({
			name: '模板' + index,
			description: '转换模板描述',
		})),
	}))
);
</script>
<template>
	<div class="transferHomeWrapper">
		<TransferFunctionItem v-for="item in fakedata" :name="item.name" :children="item.children" />
	</div>
</template>
<style lang="scss" scoped>
.transferHomeWrapper {
	padding: 16px;
	flex-grow: 1;
	width: 100%;
	// background-color: #fff;
}
</style>
