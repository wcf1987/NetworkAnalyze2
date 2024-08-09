<template>
  <div>
    <el-collapse class="centered-collapse" :title="`${state.nodeData.type === 'bezier' ? '连接' : '节点'}操作`"
                 v-model="activeNames">
      <el-collapse-item class="centered" name="1">
        <template #title class="centered">
          {{ `${state.nodeData.type === 'bezier' ? '连接' : '节点'}属性编辑` }}
          <el-icon class="header-icon">
            <ele-EditPen/>
          </el-icon>
        </template>
        <Lines v-if="state.nodeData.type === 'bezier'" @submit="onSubmit" @close="close" ref="lineRef"
        />
        <Nodes v-else @submit="onSubmit" @close="close" ref="nodeRef"/>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawer">
const activeNames = ref(['1'])
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
const open = (item, lf, flowType) => {
  state.isOpen = true;
  state.nodeData = item;


  if (item.type === 'bezier') {
    setTimeout(() => {
      // 这里放置你想要延时执行的代码
      lineRef.value.getParentData(item, lf);
    }, 300); // 延时2秒执行
  } else {
    nodeRef.value.getParentData(item, lf, flowType);
  }

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
<style scoped lang="scss">
.centered-collapse {

  border: 2px solid #ebeef5;
  margin-bottom: -1px;


}


</style>