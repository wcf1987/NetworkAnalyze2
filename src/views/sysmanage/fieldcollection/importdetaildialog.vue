<!--
  showDialog       //弹窗是否显示
  downloadFun      //下载模板方法
  importFun        //导入方法
  import-success   //导入成功点击确定回调方法
-->

<template>
    <div class="item-content">
        <el-dialog
                v-model="showDialog"
                :close-on-click-modal="true"
                :destroy-on-close="true"
                :show-close="true"
                title="导入"
                width="35%"
                @close="handleCancel"
        >
            <el-upload
                    ref="uploadRef"
                    action="#"
                    class="upload-demo"
                    drag
                    :file-list="fileList"

                    :limit="1"
                    :multiple="false"
                    :show-file-list="true"
                    :auto-upload="false"
                    :on-change="filechange"
                    :data="extraInfo"
            >
                <!-- :on-change="handleChange"
                :on-remove="handleRemove" -->
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    <em>选择文件</em>
                    或将文件拖拽至此区域
                </div>
                <div class="el-upload__tip">支持格式:xls、xlsx</div>
            </el-upload>
            <el-button :type="'primary'" text @click="handleDownLoadTemplate">
                下载模板
            </el-button>
            <div class="upload-footer">
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
                <el-button plain type="primary" @click="handleCancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 导入失败 -->
        <el-dialog
                v-model="isShowFail"
                class="fail-dialog"
                :close-on-click-modal="true"
                :destroy-on-close="true"
                :show-close="true"
                title="导入失败"
                width="35%"
                @close="handleClose"
        >
            <h4 class="fail-title">
                导入失败，请求改后重新上传，错误数据{{
                errorListData.length
                }}条，失败原因如下：
            </h4>
            <el-table :data="errorListData">
                <el-table-column label="行数" prop="index"/>
                <el-table-column label="错误原因" prop="msg"/>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup  lang="ts" >
    import {ElMessage} from 'element-plus';
    import {computed, nextTick, reactive, ref, toRefs} from 'vue';

    const props = defineProps({
        showDialog: {
            type: Boolean,
            default: false,
        },
        downloadFun: {
            default: null,
            type: Function,
        },
        importFun: {
            default: null,
            type: Function,
        },
    })
    let extraInfo={};
    const {downloadFun, importFun} = toRefs(props)
    const state=reactive({
      pid:0,
    })
    const emit = defineEmits(['update:showDialog', 'import-success'])
    const showDialog = computed({
        get: () => props.showDialog,
        set: (val) => emit('update:showDialog', val),
    })
    const openDialog = (type, pid) => {
      emit('update:showDialog', true)

      state.pid=pid;
    };

    const fileList = ref([])
    let fileupload = '';
    const errorListData = ref([])
    const isShowFail = ref(false)
    const successListData = ref()

    //下载导入模板
    const handleDownLoadTemplate = () => {
        downloadFun.value()  // 传函数写法一
    }
    const filechange = (file) => {
        if (file.status === 'ready') {
            fileupload = file;
        }
    }
    //提交
    const uploadFiles = () => {
        const formData = new FormData();
        const filet = fileupload;
      formData.append('pid',state.pid);
        formData.append('file', filet.raw);
        console.log(filet.raw)
        //传函数写法二
        importFun
            .value(formData)
            .then((res) => {
                const {data, code} = res
                if (code == '200') {
                    isShowFail.value = false
                    ElMessage.success('导入成功')
                    emit('update:showDialog', false)
                    emit('import-success', successListData.value)
                } else {
                    isShowFail.value = true
                }
            })
            .catch((res) => {
                const {data, code} = res
                if (code !== '200') {

                }
            })
    }
    const handleSubmit = () => {
        uploadFiles();


    }

    // 导入弹窗取消
    const handleCancel = () => {
        emit('update:showDialog', false)
    }

    // 导入失败弹窗关闭
    const handleClose = () => {
        isShowFail.value = false
        errorListData.value = []
    }
    defineExpose({
      openDialog,
    });
</script>
<style lang="scss" scoped>
    .fail-dialog {
        .fail-title {
            margin: 0px 0 10px;
        }

        :deep() {
            .ym-dialog__body {
                padding: 10px 20px 20px;
            }
        }
    }

    .upload-footer {
        display: flex;
        justify-content: center;
    }
</style>
