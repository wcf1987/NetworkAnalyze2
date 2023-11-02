<template>
    <div class="pt15 pr15 pb15 pl15">
        <el-form :model="state.edge" size="default" label-width="100px">
            <el-form-item label="id" v-if="false">
                <el-input v-model="state.proper.id" placeholder="来往" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="state.proper.name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>

            <el-form-item label="前序节点数据" prop="id">

                <el-cascader v-model="state.properForm.fieldvar" :options=state.fd :props="props2" clearable
                             collapse-tags @change="changeSourceInput"/>

            </el-form-item>
            <el-form-item label="全局变量" prop="id">

                <el-cascader v-model="state.properForm.globalvar" :options=state.gd :props="props2" clearable
                             collapse-tags @change="changeSourceInput"/>

            </el-form-item>

            <el-form-item label="判断表达式" prop="name">

                <el-input
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        type="textarea"
                        placeholder="请输入转换公式"
                        v-model="state.properForm.rulestr" autocomplete="off"/>
            </el-form-item>


            <el-form-item>
                <el-button @click="onLineTextReset">
                    <SvgIcon name="ele-RefreshRight"/>
                    重置
                </el-button>
                <el-button @click="onLineTextChange" type="primary">
                    <SvgIcon name="ele-Check"/>
                    保存
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawerLine">
    import {reactive} from 'vue';
    import emitter from '/@/utils/mitt';

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['submit', 'close']);

    // 定义变量内容
    const state = reactive<EmptyObjectType>({
        edge: {},
        proper: {
            name: '',
            id: '',
            source: '',
        },
        lf: '',
        properForm: {},
    });

    const props2 = {
        multiple: true,
        expandTrigger: 'hover',
        value: 'EName',
        label: 'Name'
    };
    const changeSourceInput = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        for (i = 0; i < fo.length; i++) {
            tempstr = tempstr + fo[i].join('.') + '\n'
        }
        tempstr=tempstr.replaceAll(',','.')
        state.properForm.rulestr = state.properForm.rulestr+tempstr
    }
    // 获取父组件数据
    const getParentData = (data: object, lf) => {
        let incoming=lf.getNodeDataById(data.sourceNodeId);
        state.fd=incoming.properties.fd;
        state.gd=incoming.properties.gd;
        state.properForm = data.properties;
        state.edge = data;
        if (data.text == null) {
            state.proper.name = '';
        } else {
            state.proper.name = data.text.value;
        }
        state.proper.id = data.id;
        state.lf = lf;
    };
    // 重置
    const onLineTextReset = () => {
        state.edge.label = '';
    };
    // 保存
    const onLineTextChange = () => {
        const edgeModel = state.lf.getEdgeModelById(state.edge.id);
        edgeModel.updateText(state.proper.name);
        edgeModel.setProperties(state.properForm);
        emit('submit');
        emit('close');
    };

    // 暴露变量
    defineExpose({
        getParentData,
    });
</script>
