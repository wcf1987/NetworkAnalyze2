<script setup lang="ts">
    import Image1 from './assets/image1.png';
    import Image2 from './assets/image2.png';
    import Image3 from './assets/image3.png';
    import Image4 from './assets/image4.png';
    import Image5 from './assets/image5.png';
    import Image6 from './assets/image6.png';
    import Image7 from './assets/image7.png';
    import Image8 from './assets/image8.png';
    import Image9 from './assets/image9.png';
    import Image10 from './assets/image10.png';
    import Image11 from './assets/image11.png';
    import Image12 from './assets/image12.png';
    import {useThemeConfig} from '/@/stores/themeConfig';
    import {ElMessage, ElMessageBox} from 'element-plus';
    import {defineAsyncComponent, ref} from 'vue';
    import {transtemplateApi} from '/@/api/transmanage/transtemplate';
    import router from '/@/router';
    import {useUserInfo} from '/@/stores/userInfo';
    import {storeToRefs} from 'pinia';

    const props = defineProps<{
        name: string;
        id: string;
        children: Array<{ ID: string; Name: string; Describes: string }>;
        onOpenEdit: (type: string, row: RowUserType) => void;
    }>();
    const UserDialog = defineAsyncComponent(() => import('/@/views/transfermanage/transtemplate/dialog.vue'));
    const userDialogRef = ref();
    const Images = [Image1, Image10, Image11, Image12, Image2, Image3, Image4, Image5, Image6, Image7, Image8, Image9];
    const storesThemeConfig = useThemeConfig();
    const {themeConfig} = storeToRefs(storesThemeConfig);
    const emit = defineEmits(['refresh']);
    const refreshUI = () => {
        emit('refresh');
    };
    const onOpenAdd = (type: string, pid) => {
        userDialogRef.value.openDialog(type, '', pid);
    };

    const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    //应用模板至流程编排
    const onTemplateApply = (v) => {
        const stores = useUserInfo();
        const flowName = '';
        ElMessageBox.prompt('请输入模板应用后名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',

        })
            .then(({value}) => {
                ElMessage({
                    type: '成功',
                    message: `您的新流程名称为:${value}`,
                });

                transtemplateApi()
                    .applyFlow({
                        AuthorID: stores.userInfos.id,
                        ID: v.ID,
                        Name: value,
                    })
                    .then((res) => {
                        //console.log(res);
                        if (res.code == '200') {
                            ElMessage.success('添加成功');
							let id=res.data;
							console.log(id);
                            router.push({
                                path: '/flowmanage/flowdesign/flowdesigndetail2',
                                query: {ID: id, FlowName: value, Type: v.Type},
                            });
                        } else {
                            ElMessage.error(res.message);
                        }
                    })
                    .catch((err) => {
                    })
                    .finally(() => {
                    });


            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '您未确认新流程名称，应用取消',
                })
            });

    };
    //编辑模板
    const onTableItemClick = (v) => {
        router.push({
            path: '/flowmanage/flowdesign/flowdesigntemplate',
            query: {ID: v.ID, FlowName: v.Name, Type: v.Type},
        });
    };
    const onRowDel = (row: RowUserType) => {
        ElMessageBox.confirm(`此操作将永久删除：“${row.Name}”，是否继续?`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                transtemplateApi()
                    .delFlow({
                        ID: row.ID,
                    })
                    .then((res) => {
                        //console.log(res);
                        if (res.code == '200') {
                            ElMessage.success('删除成功');
                            emit('refresh');
                        } else {
                            ElMessage.error(res.message);
                        }
                    })
                    .catch((err) => {
                    })
                    .finally(() => {
                    });
            })
            .catch(() => {
            });
    };
</script>
<template>
    <div class="transgerFunctionItemWrapper">
        <div
                :style="{
				color: themeConfig.isIsDark ? '#ccc' : '#000',
				// backgroundImage: isIsDark
				// 	? 'linear-gradient(270deg, rgb(175, 179, 186) 0%, rgba(175, 179, 186, 0) 100%)'
				// 	: 'linear-gradient(270deg, rgba(245, 247, 250, 0) 0%, rgb(245, 247, 250) 100%)',
			}"
                class="title"
        >
            {{ props.name ?? '' }}
        </div>
        <!-- <el-button type="primary" class="add-button" @click.stop="onOpenAdd('add', props.id)" :icon="Plus"> 新建模板 </el-button> -->
        <div class="content">
            <div class="transferFunctionItem" v-for="item in $props.children" @click.stop="onTableItemClick(item)">
                <div class="image-wrapper" :style="{ backgroundImage: `url(${Images[item.ID % 10]})` }">
                    <div class="action-wrapper">
                        <el-tooltip class="box-item" effect="light" content="编辑模板" placement="bottom-start">
                            <el-button type="success" size="small" circle @click.stop="onTableItemClick(item)">
                                <el-icon>
                                    <ele-Document/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="light" content="删除模板" placement="bottom-start">
                            <el-button type="danger" size="small" circle @click.stop="onRowDel(item)">
                                <el-icon>
                                    <ele-Delete/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="light" content="应用模板" placement="bottom-start">
                            <el-button type="primary" size="small" circle @click.stop="onTemplateApply(item)">
                                <el-icon>
                                    <ele-Coin/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="box-item" effect="light" content="修改名称" placement="bottom-start">
                            <el-button type="warning" size="small" circle @click.stop="props.onOpenEdit('edit', item)">
                                <el-icon>
                                    <ele-CopyDocument/>
                                </el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>
                <div class="text-wrapper">
                    <div class="template-name">{{ item.Name }}</div>
                    <div class="template-description">{{ item.Describes }}</div>
                </div>
            </div>
        </div>
        <UserDialog ref="userDialogRef" @refresh="refreshUI()"/>
    </div>
</template>
<style lang="scss" scoped>
    .transgerFunctionItemWrapper {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;

        .title {
            height: 38px;
            line-height: 38px;
            padding: 0 16px;
            margin-bottom: 16px;
            position: relative;
            border-radius: 4px;
            overflow: hidden;
            background-image: linear-gradient(270deg, rgba(121, 187, 255, 0) 0%, rgb(121, 187, 255, 0.2) 100%);

            &::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
                pointer-events: none;
            }
        }

        .content {
            display: flex;
            flex-wrap: wrap;
            padding: 0 8px;
        }
    }

    .transferFunctionItem {
        width: 250px;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        overflow: hidden;
        margin-right: 24px;
        border-radius: 4px;
        margin-bottom: 24px;
        position: relative;
        background-color: #f0f0f0;

        .image-wrapper {
            background-size: cover;
            height: 120px;
            position: relative;

            &::after {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                content: '';
                background-color: rgba(0, 0, 0, 0.08);
                z-index: 0;
            }

            .action-wrapper {
                position: absolute;
                bottom: 8px;
                right: 8px;
                z-index: 1;
            }
        }

        .text-wrapper {
            padding: 8px 0;
            // background-color: #f0f0f0;
            .template-description {
                margin: 0px 16px;
                flex-grow: 1;
                color: #434343;
            }

            .template-name {
                // text-align: center;
                margin: 8px 16px;
                font-size: 16px;
                font-weight: bold;
            }
        }

        &:hover {
            box-shadow: 8px 8px 8px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }
    }
</style>
