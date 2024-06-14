<template>
    <div class="filtering layout-pd">
        <el-card
                shadow="hover"
                class="filtering-list br-top-no"
                v-loading="state.tableData.loading"
                element-loading-text="加载中..."
                element-loading-background="rgba(255, 255, 255, 0.1)"
                :class="{ 'min-h-360': state.tableData.data.length <= 0 }"
        >
            <div class="system-user-search mb15">
                <el-input size="default" placeholder="请输入插件名称" style="max-width: 180px"  v-model="state.tableData.search"></el-input>
                <el-button size="default" type="primary" class="ml10" @click="onSearch">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>
                    查询
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenAdd('add')">
                    <el-icon>
                        <ele-FolderAdd/>
                    </el-icon>
                    新增函数插件
                </el-button>
                        <el-button size="default" type="danger" class="ml10" @click="onDeleteIDS('add')">
                    <el-icon>
                        <ele-DeleteFilled/>
                    </el-icon>
                    批量删除
                </el-button>
                                <el-button size="default" type="warning" class="mr10" @click="back()" v-if="false">
                    <el-icon>
                        <ele-ArrowLeftBold/>
                    </el-icon>
                    返回
                </el-button>
            </div>
            <el-table :cell-style="{'padding': '2px 2px 0 10px'}"  :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
                 <el-table-column type="selection" width="50"/>
                <el-table-column prop="ID" label="ID" width="60" v-if="false"/>
                <el-table-column type="index" label="序号" width="60" :index="calcIndex"/>
                <el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Type" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Version" label="版本号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="InputPar" label="输入参数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="OutputPar" label="输出参数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Plugfile" label="函数地址" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Status" label="状态" show-overflow-tooltip>
               <template #default="scope">
						<el-tag type="success" v-if="scope.row.Status=='true'">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
                    </el-table-column>
                <el-table-column prop="Describes" label="用户描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip v-if="false"></el-table-column>
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary"
                                   @click="onOpenEdit('edit', scope.row)" class="buttonfont"
                        >修改
                        </el-button
                        >

                        <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" class="buttonfont"
                                   @click="onRowDel(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="onHandleSizeChange"
                    @current-change="onHandleCurrentChange"
                    class="mt15"
                    :pager-count="5"
                    :page-sizes="[10,20, 30]"
                    v-model:current-page="state.tableData.param.pageNum"
                    background
                    v-model:page-size="state.tableData.param.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="state.tableData.total"
            >
            </el-pagination>
        </el-card>
        <UserDialog ref="userDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts" name="pagesFiltering">
    import {computed, defineAsyncComponent, nextTick, onMounted, reactive, ref} from 'vue';
    import {useRouter} from 'vue-router';

    import {ElMessage, ElMessageBox} from "element-plus";
    import {userManageApi} from "/@/api/sysadmin/usermanage";
    import {functionplugManageApi} from "/@/api/plugmanage/functionplugmanage";

    const UserDialog = defineAsyncComponent(() => import('/@/views/pluginmanage/funcplug/dialog.vue'));
    const userDialogRef = ref();
    // 定义变量内容
    const dlRefs = ref<RefType[]>([]);
    const router = useRouter();
    const state = reactive({

        tableData: {
            data: [],
            total: 0,
            loading: false,
            param: {
                pageNum: 1,
                pageSize:  20,
            },
            		        search: '',
            searchStr: '',
                ids:[],
        },
    });
    const  calcIndex=(index)=>{
        index=index+(state.tableData.param.pageNum-1)*state.tableData.param.pageSize+1
        return index
    }

    //返回上一级
    const back = () => {

        router.back();
    }
    // 页面加载时
    onMounted(() => {


        getTableData();
    });
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type);
    };
    // 初始化 `收起、展开` 按钮

    const onSearch = () => {
        state.tableData.searchStr=state.tableData.search;
       getTableData();
    };

    // 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
  functionplugManageApi().search(
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
        functionplugManageApi().getSearchListSize(
            {
                uid: 1,
                name: state.tableData.searchStr,
            })
            .then(res => {
                //console.log(res);
                if (res.code == '200') {

                    state.tableData.total = res.data;

                } else {
                    ElMessage.error(res.message);
                }

            }).catch(err => {

        }).finally(() => {

        });


	setTimeout(() => {
		state.tableData.loading = false;
	}, 100);
};
    // 分页点击
    const onHandleSizeChange = (val: number) => {
        state.tableData.param.pageSize = val;
    };
    // 分页点击
    const onHandleCurrentChange = (val: number) => {
        state.tableData.param.pageNum = val;
    };
    const onOpenEdit = (type: string, row: RowUserType) => {
	userDialogRef.value.openDialog(type, row);
};
        //多选监听
    const handleSelectionChange = (val) => {
        state.tableData.ids = val.map(v => v.ID)
        //this.$message.warning("选择了"+this.ids.length+"条数据");
        console.log("选择了"+state.tableData.ids.length+"条数据")
    };
    //批量删除
    const onDeleteIDS = (type: string) => {
        ElMessageBox.confirm(`此操作将批量删除网口：“${state.tableData.ids.length}”条，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })


            .then(() => {
                functionplugManageApi().delIDS(                                          state.tableData.ids

                    )
                    .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success('成功批量删除'+res.data+'条');
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
const onRowDel = (row: RowUserType) => {
	ElMessageBox.confirm(`此操作将永久删除函数插件：“${row.Name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
		  functionplugManageApi().del(
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
</script>

<style scoped lang="scss">
    .el-dropdown{
        margin-left: 7px;
    }
      :deep(.buttonfont) {
                    font-size: 14px;
                }
    .list-card-item {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
        overflow: hidden;
        cursor: pointer;
        border-radius: 3px;

        &_detail {
            flex: 1;
            min-height: 140px;
            padding: 24px 32px;
             border: 2px solid var(--next-border-color-light);
            &--logo {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 56px;
                height: 56px;
                font-size: 32px;
                color: #0052d9;
                background: #e0ebff;
                border-radius: 50%;

                &__disabled {
                    color: #a1c4ff;
                }
            }

            &--operation {
                display: flex;
                height: 100%;

                &--tag {
                    border: 0;
                }
            }

            &--name {
                margin: 24px 0 8px;
                font-size: 16px;
                font-weight: 400;
            }

            &--desc {
                display: -webkit-box;
                height: 40px;
                margin-bottom: 24px;
                overflow: hidden;
                font-size: 12px;
                line-height: 20px;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            &:hover {
                            cursor: pointer;
                            border: 1px solid var(--el-color-primary);
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);

                            .item-txt-title {
                                color: var(--el-color-primary) !important;
                                transition: all 0.3s ease;
                            }

                            .item-img {
                                img {
                                    transition: all 0.3s ease;
                                    transform: translateZ(0) scale(1.05);
                                }
                            }
                        }
        }

        &__disabled {
            .list-card-item_detail--name,
            .list-card-item_detail--desc {
                color: var(--el-text-color-disabled);
            }

            .list-card-item_detail--operation--tag {
                color: #bababa;
            }
        }
    }

    .filtering {
        .filtering-list {
            overflow: hidden;
            border-bottom: none !important;

            .filtering-list-flex {
                &:last-of-type {
                    .filtering-list-item {
                        border-bottom: none !important;
                    }
                }

                .filtering-list-title {
                    float: left;
                    width: 64px;
                    font-weight: 700;
                    position: relative;
                    color: #909399;
                    margin: 15px 0;

                    &:after {
                        content: '';
                        position: absolute;
                        border: 1px solid #909399;
                        border-width: 0 1px 1px 0;
                        width: 4px;
                        height: 4px;
                        transform: rotate(-45deg) translateY(-50%);
                        right: 10px;
                        top: 50%;
                    }
                }

                .filtering-list-item {
                    border-bottom: 1px dotted var(--next-border-color-light);
                    margin-left: 64px;
                    overflow: hidden;
                    position: relative;

                    .span {
                        color: #8d8d91;
                        font-size: 14px;
                        float: left;
                        padding: 0 15px;
                        margin: 15px 0;

                        &:hover {
                            color: var(--el-color-primary);
                            cursor: pointer;
                        }
                    }

                    .dd-active {
                        color: var(--el-color-primary);
                    }

                    .dd-more {
                        font-size: 12px;
                        position: absolute;
                        right: 0;
                        top: 16px;
                        color: #a5a5a5;

                        &:hover {
                            cursor: pointer;
                            color: #8d8d91;
                        }
                    }
                }
            }
        }

        .br-top-no {
            border-top: none;

            .flex-warp {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                margin: 0 -5px;

                .el-row {
                    width: 101%;
                }

                .flex-warp-item {
                    padding: 5px;
                    width: 100%;
                    height: 360px;

                    .flex-warp-item-box {
                        border: 1px solid var(--next-border-color-light);
                        width: 100%;
                        height: 100%;
                        border-radius: 2px;
                        display: flex;
                        flex-direction: column;
                        transition: all 0.3s ease;

                        &:hover {
                            cursor: pointer;
                            border: 1px solid var(--el-color-primary);
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);

                            .item-txt-title {
                                color: var(--el-color-primary) !important;
                                transition: all 0.3s ease;
                            }

                            .item-img {
                                img {
                                    transition: all 0.3s ease;
                                    transform: translateZ(0) scale(1.05);
                                }
                            }
                        }

                        .item-img {
                            width: 100%;
                            height: 215px;
                            overflow: hidden;

                            img {
                                transition: all 0.3s ease;
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .item-txt {
                            flex: 1;
                            padding: 15px;
                            display: flex;
                            flex-direction: column;
                            overflow: hidden;

                            .item-txt-title {
                                text-overflow: ellipsis;
                                overflow: hidden;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                                display: -webkit-box;
                                color: #666666;
                                transition: all 0.3s ease;

                                &:hover {
                                    color: var(--el-color-primary);
                                    text-decoration: underline;
                                    transition: all 0.3s ease;
                                }
                            }

                            .item-txt-other {
                                flex: 1;
                                align-items: flex-end;
                                display: flex;

                                .item-txt-msg {
                                    font-size: 12px;
                                    color: #8d8d91;
                                }

                                .item-txt-price {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;

                                    .font-price {
                                        color: #ff5000;

                                        .font {
                                            font-size: 22px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            :deep(.el-card__body) {
                height: 100%;

                .filtering-no-data {
                    display: flex;
                    height: 100%;

                    .no-data-box {
                        color: #cccccc;
                        margin: auto;

                        i {
                            font-size: 70px;
                        }

                        .no-txt {
                            font-size: 14px;
                            text-align: center;
                            margin-top: 15px;
                        }
                    }
                }
            }
        }

        .min-h-360 {
            height: 360px;
        }
    }
</style>
