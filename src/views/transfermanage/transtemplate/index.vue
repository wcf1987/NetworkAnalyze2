<script setup lang="ts">
	import {onMounted, reactive} from 'vue';
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

    import {transclassfyApi} from "/@/api/transmanage/transclassfy";
import {ElMessage} from "element-plus";
    const state = reactive({
      view:'list',
      viewStr:'切换瀑布流显示',
        tableData: {
            data: [],
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize: 10,
            },
            		        search: '',
            searchStr: '',
                ids:[],
        },
    });
      const getTableData = () => {
        state.tableData.loading = true;
       transclassfyApi().searchWithChildren(
            {
                uid: 1,
                pageNum: state.tableData.param.pageNum,
                pageSize: state.tableData.param.pageSize,
                name: state.tableData.searchStr,
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    state.tableData.data = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });
        //const data = [];


        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
    };
    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>
<template>
	<div class="transferHomeWrapper">
		<TransferFunctionItem v-for="item in state.tableData.data" :name="item.Name" :children="item.children" />
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
