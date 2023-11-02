<template>
    <div>
        <el-drawer :title="`${state.nodeData.type === 'bezier' ? '连接' : '节点'}操作`" v-model="state.isOpen" size="500px">
            <el-scrollbar>
                <Lines v-if="state.nodeData.type === 'bezier'" @submit="onSubmit" @close="close" ref="lineRef" :Amsg="Amsg"/>
                <Nodes v-else @submit="onSubmit" @close="close" ref="nodeRef" @fn="getmsg"/>
            </el-scrollbar>
        </el-drawer>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawer">
    import {defineAsyncComponent, nextTick, reactive, ref} from 'vue';

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['label', 'node', 'save']);

    // 引入组件
    const Lines = defineAsyncComponent(() => import('./line.vue'));
    const Nodes = defineAsyncComponent(() => import('./node.vue'));
	//import Nodes from './node.vue';
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
    const open = (item, lf) => {
    	state.isOpen = true;
        state.nodeData = item;
        nextTick(() => {
            setTimeout(() => {
                if (item.type === 'bezier') lineRef.value.getParentData(item, lf);
        else nodeRef.value.getParentData(item, lf);
            }, 500);
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
    const onSubmit = () => {
        emit('save');
    };

    // 暴露变量
    defineExpose({
        open,
    });
</script>
