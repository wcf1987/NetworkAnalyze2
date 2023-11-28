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
                    新增系统插件
                </el-button>
            </div>
            <div class="flex-warp mt15 mb15" v-if="state.tableData.data.length > 0">
                <el-row :gutter="15">
                    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb15"
                            v-for="(v, k) in state.tableData.data" :key="k" >
                        <div class="cardClass">
                            <div class="list-card-item_detail bg-bg_color">
                                <el-row justify="space-between">
                                    <div :class="cardLogoClass">
                                        <ele-Collection/>
                                    </div>
                                    <div class="list-card-item_detail--operation">
                                        <el-tag
                                                :color="v.Status=='true' ? '#00a870' : '#eee'"
                                                effect="dark"
                                                class="mx-1 list-card-item_detail--operation--tag"
                                        >
                                            {{ v.Status=='true' ? "已启用" : "已停用" }}
                                        </el-tag>
                                        <el-dropdown trigger="click" >
                                            <el-icon clss="more2fill">
                                            <ele-MoreFilled class="text-[24px]"/>
                                            </el-icon>

                                            <template #dropdown>
                                                <el-dropdown-menu >
                                                    <el-dropdown-item @click="onOpenEdit('edit', v)">
                                                        管理
                                                    </el-dropdown-item>
                                                    <el-dropdown-item @click="onRowDel(v)">
                                                        删除
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>


                                </el-row>
                                <p class="list-card-item_detail--name text-text_color_primary">
                                    {{ v.Name }}
                                </p>
                                <p class="list-card-item_detail--desc text-text_color_regular">
                                    {{ v.Describes }}
                                </p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-else class="filtering-no-data">
                <div class="no-data-box">
                    <i class="el-icon-search"></i>
                    <div class="no-txt">暂无数据</div>
                </div>
            </div>
            <template v-if="state.tableData.data.length > 0">
                <el-pagination
                        style="text-align: right"
                        background
                        @size-change="onHandleSizeChange"
                        @current-change="onHandleCurrentChange"
                        :page-sizes="[10, 20, 30]"
                        :current-page="state.tableData.param.pageNum"
                        :page-size="state.tableData.param.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="state.tableData.total"
                >
                </el-pagination>
            </template>
        </el-card>
        <UserDialog ref="userDialogRef" @refresh="getTableData()"/>
    </div>
</template>

<script setup lang="ts" name="pagesFiltering">
    import {computed, defineAsyncComponent, nextTick, onMounted, reactive, ref} from 'vue';
    import {useRouter} from 'vue-router';
    import {filtering, filterList} from './mock';
    import {ElMessage, ElMessageBox} from "element-plus";
    import {userManageApi} from "/@/api/sysadmin/usermanage";
    import {sysplugManageApi} from "/@/api/plugmanage/sysplugmanage";

    const UserDialog = defineAsyncComponent(() => import('/@/views/pluginmanage/sysplug/dialog.vue'));
    const userDialogRef = ref();
    // 定义变量内容
    const dlRefs = ref<RefType[]>([]);
    const router = useRouter();
    const state = reactive({
        filtering,
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
        },
    });
    const cardClass = computed(() => [
        "list-card-item",
        {"list-card-item__disabled": false}
    ]);

    const cardLogoClass = computed(() => [
        "list-card-item_detail--logo",
        {"list-card-item_detail--logo__disabled": false}
    ]);
    // 页面加载时
    onMounted(() => {
        initBtnToggle();
        window.onresize = () => {
            initBtnToggle();
        };
        getTableData();
    });
    const onOpenAdd = (type: string) => {
        userDialogRef.value.openDialog(type);
    };
    // 初始化 `收起、展开` 按钮
    const initBtnToggle = () => {
        nextTick(() => {
            const els = dlRefs.value;
            els.map((v: any, k: number) => {
                v.scrollHeight < v.lastChild.scrollHeight ? (state.filtering[k].isShowMore = true) : (state.filtering[k].isShowMore = false);
            });
        });
    };
    // 过滤当前选中的数据
    const onSelItem = (val: FilteringRowType, v: FilteringChilType) => {
        val.children.map((v: FilteringChilType) => (v.active = false));
        v.active = true;
        let arr = [];
        state.filtering.map((item: FilteringRowType) => {
            item.children.map((chil: FilteringChilType) => {
                if (chil.active) {
                    arr.push({
                        ...item,
                        children: [{...chil}],
                    });
                }
            });
        });
        state.tableData.loading = true;
        setTimeout(() => {
            state.tableData.loading = false;
        }, 500);
    };
    // 当前列表项点击
    const onTableItemClick = (v: FilterListType) => {
        router.push({
            path: '/pages/workflow',
            query: {id: v.id},
        });

    };
        const onSearch = () => {
        state.tableData.searchStr=state.tableData.search;
       getTableData();
    };
    // 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
  sysplugManageApi().search(
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
        sysplugManageApi().getSearchListSize(
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
	}, 500);
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
const onRowDel = (row: RowUserType) => {
	ElMessageBox.confirm(`此操作将永久删除系统插件：“${row.Name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
		  sysplugManageApi().del(
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
