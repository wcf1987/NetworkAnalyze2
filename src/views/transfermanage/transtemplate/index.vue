<script setup lang="ts">
	import {defineAsyncComponent, onMounted, reactive, ref} from 'vue';
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
	import {ElMessage, ElMessageBox} from "element-plus";
	import {flowApi} from "/@/api/flowmanage/flow";
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


      const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type);
    }

    const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    const onOpenEdit = (type: string, row: RowUserType) => {
        userDialogRef.value.openDialog(type, row);
    };
    const onTableItemClick = (v: FilterListType) => {
        router.push({
            path: '/flowmanage/flowdesign/flowdesigndetail2',
            query: {ID: v.ID, FlowName: v.Name,Type:v.Type},
        });

    };
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                flowApi().delFlow(
                    {
                        ID: row.ID,

                    })
                    .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success('删除成功');
                            getTableData();

                        } else {
                            ElMessage.error(res.message);
                        }

                    }).catch(err => {

                }).finally(() => {

                });


            })
            .catch(() => {
            });
    };

    // 页面加载时
    onMounted(() => {
        getTableData();
    });
</script>
<template>
	<div class="transferHomeWrapper">
		<TransferFunctionItem v-for="item in state.tableData.data" :name="item.Name" :id="item.ID" :children="item.children" @refresh="getTableData()"/>
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
