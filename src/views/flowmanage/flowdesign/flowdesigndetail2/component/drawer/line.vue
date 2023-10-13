<template>
    <div class="pt15 pr15 pb15 pl15">
        <el-form :model="state.edge" size="default" label-width="100px">
            <el-form-item label="id" v-if="false">
                <el-input v-model="state.proper.id" placeholder="来往" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="state.proper.name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>

            <el-form-item label="前序节点数据"  prop="id">

                <el-cascader v-model="state.proper.source" :options="sourceOptions" :props="props2" clearable
                              collapse-tags @change="changeSourceInput"/>

            </el-form-item>

            <el-form-item label="判断表达式"  prop="name">

                <el-input
                        :autosize="{ minRows: 2, maxRows: 10 }"
                        type="textarea"
                        placeholder="请输入转换公式"
                        v-model="state.properForm.rulestr" autocomplete="off" />
            </el-form-item>


            <el-form-item>
                <el-button @click="onLineTextReset">
                    <SvgIcon name="ele-RefreshRight"/>
                    重置
                </el-button>
                <el-button @click="onLineTextChange" type="primary">
                    <SvgIcon name="ele-Check"/>
                    下一步
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts" name="pagesWorkflowDrawerLine">
    import {reactive,ref} from 'vue';

    // 定义子组件向父组件传值/事件
    const emit = defineEmits(['change', 'close']);

    // 定义变量内容
    const state = reactive<EmptyObjectType>({
        edge: {},
        proper: {
            name: '',
            id: '',
			source:'',
        },
        lf: '',
		properForm:{

		},
    });
    const sourceOptions = ref([
        {
            ename: "消息头A", name: '消息头A',
            children: [
                {
                    ename: "version", name: '版本号'


                },
                {
                    ename: "type", name: '服务类型'


                },
                {
                    ename: "index", name: '序号'


                },
                {
                    ename: "sum", name: '校验和'


                },
            ]
        },
        {
            ename: "消息体B", name: '消息体B',
            children: [
                {
                    ename: "LONG", name: '经度'


                },
                {
                    ename: "LAT", name: '纬度'


                },
                {
                    ename: "mile", name: '海里数'


                },
                {
                    ename: "deep", name: '深度'


                },
            ]
        },
    ]);
        const props2 = {
        multiple: true,
        expandTrigger: 'hover',
        value: 'ename',
        label: 'name'
    };
	const changeSourceInput = (fo) => {
        console.log(fo)
        let i = 0, tempstr = ''
        for (i = 0; i < fo.length; i++) {
            tempstr = tempstr + fo[i].join('.') + '\n'
        }
        state.properForm.rulestr =  tempstr
    }
    // 获取父组件数据
    const getParentData = (data: object, lf) => {
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
        emit('close');
    };

    // 暴露变量
    defineExpose({
        getParentData,
    });
</script>
