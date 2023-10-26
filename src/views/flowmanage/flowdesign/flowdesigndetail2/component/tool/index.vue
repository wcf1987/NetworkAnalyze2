<template>
    <div class="workflow-tool">
        <div class="pl15">{{ setToolTitle }}</div>
        <div class="pl15">{{ setTimeTitle }}</div>
        <div class="workflow-tool-right">
            <div class="workflow-tool-icon" v-for="(v, k) in state.toolList" :key="k" :title="v.title"
                 @click="onToolClick(v.fnName)">
                <SvgIcon :name="v.icon"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflowTool">
    import {computed, reactive} from 'vue';
    import {storeToRefs} from 'pinia';
    import {useThemeConfig} from '/@/stores/themeConfig';

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['tool']);

    // 定义变量内容
    const storesThemeConfig = useThemeConfig();
    const {themeConfig} = storeToRefs(storesThemeConfig);
    const state = reactive({
        toolList: [
            {icon: 'ele-Edit', title: '编辑属性', fnName: 'editProp'},
            {icon: 'ele-ZoomIn', title: '放大', fnName: 'zoomIn'},
            {icon: 'ele-ZoomOut', title: '缩小', fnName: 'zoomOut'},
            {icon: 'ele-RefreshRight', title: '大小适应', fnName: 'zoomReset'},
            {icon: 'ele-Position', title: '定位还原', fnName: 'translateRest'},
            {icon: 'ele-CaretLeft', title: '上一步', fnName: 'undo'},
            {icon: 'ele-CaretRight', title: '下一步', fnName: 'redo'},

            {icon: 'ele-Download', title: '下载', fnName: 'download'},
            {icon: 'ele-Check', title: '保存', fnName: 'submit'},
            {icon: 'ele-Delete', title: '清空画布', fnName: 'clearMap'},
            {icon: 'ele-DataLine', title: '查看缩略图', fnName: 'showMiniMap'},
            {icon: 'ele-FullScreen', title: '全屏', fnName: 'fullscreen'},
            {icon: 'ele-Help', title: '帮助', fnName: 'help'},
        ],
    });
    const props = defineProps({
        dropdown: {
            name: '',

        },
        lasttime:{
            name:'',
        }
    });
    // 设置 tool 标题
    const setToolTitle = computed(() => {
        let {globalTitle} = themeConfig.value;
        return '流程编排工作流 : ' + props.dropdown ;
    });
        const setTimeTitle = computed(() => {

        return '上次保存时间：'+props.lasttime;
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
