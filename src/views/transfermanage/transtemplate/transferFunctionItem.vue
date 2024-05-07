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
import { Random } from 'mockjs';
import { useThemeConfig } from '/@/stores/themeConfig';
import {ElMessage, ElMessageBox} from "element-plus";
import {flowApi} from "/@/api/flowmanage/flow";
import {defineAsyncComponent, ref} from "vue";
import {transtemplateApi} from "/@/api/transmanage/transtemplate";
import router from "/@/router";
import {useUserInfo} from "/@/stores/userInfo";

const props = defineProps({
	name: {
		type: String,
		default: () => '',
	},
	id:'',
	children: {
		type: Array<{
			ID:String,
			Name: String,
			Describes: String,
		}>,
	},
});
    const UserDialog = defineAsyncComponent(() => import('/@/views/transfermanage/transtemplate/dialog.vue'));
    const userDialogRef = ref();
const Images = [Image1, Image10, Image11, Image12, Image2, Image3, Image4, Image5, Image6, Image7, Image8, Image9];
const storesThemeConfig = useThemeConfig();
const isIsDark = storesThemeConfig.$state.themeConfig.isIsDark;
  const emit = defineEmits(['refresh']);
const refreshUI=()=>{
emit('refresh');
}
  const onOpenAdd = (type: string,pid) => {

        userDialogRef.value.openDialog(type,'',pid);
    }

    const onSearch = () => {
        state.tableData.searchStr = state.tableData.search;
        getTableData();
    };
    //修改模板名称
    const onOpenEdit = (type: string, row: RowUserType) => {
        userDialogRef.value.openDialog(type, row);
    };
    //应用模板至流程编排
    const onTemplateApply = (v) => {

            const stores = useUserInfo();

             transtemplateApi().applyFlow({
                 AuthorID:stores.userInfos.id,
                 ID:v.ID}
            )
                .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success("添加成功");
                            closeDialog();
                            emit('refresh');
                        } else {
                            ElMessage.error(res.message);
                        }

                    }
                )
                .catch(err => {

                }).finally(() => {

            });

        router.push({
            path: '/flowmanage/flowdesign/flowdesigntemplate',
            query: {ID: v.ID, FlowName: v.Name,Type:v.Type},
        });

    };
    //编辑模板
    const onTableItemClick = (v) => {
        router.push({
            path: '/flowmanage/flowdesign/flowdesigntemplate',
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
                transtemplateApi().delFlow(
                    {
                        ID: row.ID,

                    })
                    .then(res => {
                        //console.log(res);
                        if (res.code == '200') {

                            ElMessage.success('删除成功');
                              emit('refresh');

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
<template>
	<div class="transgerFunctionItemWrapper">
		<div
			:style="{
				color: isIsDark ? '#ccc' : '#000',
				backgroundImage: isIsDark
					? 'linear-gradient(270deg, rgb(175, 179, 186) 0%, rgba(175, 179, 186, 0) 100%)'
					: 'linear-gradient(270deg, rgba(245, 247, 250, 0) 0%, rgb(245, 247, 250) 100%)',
			}"
			class="title"
		>
			{{ props.name.split(',').join(' → ') }}
			<el-tooltip
                                                        class="box-item"
                                                        effect="light"
                                                        content="新建模板"
                                                        placement="bottom-start"
                                                >
                                                    <el-button type="success" size="small" circle
                                                               @click.stop="onOpenAdd('add', props.id)">
                                                        <el-icon>
                                                            <ele-Plus/>
                                                        </el-icon>

                                                    </el-button>
                                                </el-tooltip>
		</div>
		<div class="content">
			<div class="transferFunctionItem" :style="{ backgroundImage: `url(${Images[item.ID%10]})` }" v-for="item in $props.children" @click.stop="onTableItemClick(item)">
				<div class="template-description">{{ item.Name }}</div>
				<footer>
					<span></span>
					<div class="template-name">{{ item.Describes }}</div>
                    			<span></span>
					  <el-tooltip
                                                        class="box-item"
                                                        effect="light"
                                                        content="编辑模板"
                                                        placement="bottom-start"
                                                >
                                                    <el-button type="success" size="small" circle
                                                               @click.stop="onTableItemClick(item)">
                                                        <el-icon>
                                                            <ele-Document/>
                                                        </el-icon>

                                                    </el-button>
                                                </el-tooltip>
                                                <el-tooltip
                                                        class="box-item"
                                                        effect="light"
                                                        content="删除模板"
                                                        placement="bottom-start"
                                                >
                                                    <el-button type="danger" size="small" circle
                                                               @click.stop="onRowDel(item)">
                                                        <el-icon>
                                                            <ele-Delete/>
                                                        </el-icon>

                                                    </el-button>
                                                </el-tooltip>
                                                <el-tooltip
                                                        class="box-item"
                                                        effect="light"
                                                        content="应用模板"
                                                        placement="bottom-start"
                                                >
                                                    <el-button type="primary" size="small" circle
                                                               @click.stop="onTemplateApply(item)">
                                                        <el-icon>
                                                            <ele-Coin/>
                                                        </el-icon>

                                                    </el-button>
                                                </el-tooltip>
                                                <el-tooltip
                                                        class="box-item"
                                                        effect="light"
                                                        content="修改名称"
                                                        placement="bottom-start"
                                                >
                                                    <el-button type="warning" size="small" circle
                                                               @click.stop="onOpenEdit('edit', item)">
                                                        <el-icon>
                                                            <ele-CopyDocument/>
                                                        </el-icon>

                                                    </el-button>
                                                </el-tooltip>

				</footer>
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
	}
	.content {
		display: flex;
		flex-wrap: wrap;
		padding: 0 8px;
	}
}
.transferFunctionItem {
	width: 250px;
	height: 150px;
	display: flex;
	flex-direction: column;
	padding: 16px;
	border: 1px solid #ccc;
	margin-right: 24px;
	border-radius: 4px;
	margin-bottom: 24px;
	position: relative;
	background-size: cover;

	&::after {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		content: '';
		background-color: rgba(255, 255, 255, 0.6);
		z-index: 0;
	}
	.template-description {
		padding: 8px;
		flex-grow: 1;
		// color: rgba($color: #000000, $alpha: 0.7);
	}
	.template-name {
		text-align: center;
		font-size: 16px;
	}
	.template-name,
	.template-description,
	footer {
		z-index: 1;
	}
	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		span {
			width: 2em;
		}
		button {
			padding: 0 8px;
		}
	}
}
</style>
