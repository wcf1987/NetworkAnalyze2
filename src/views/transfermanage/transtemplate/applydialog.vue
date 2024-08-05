<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="500px" :draggable="true">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
               label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户描述" prop="Describes">
              <el-input v-model="state.ruleForm.Describes" type="textarea" placeholder="请输入用户描述"
                        maxlength="150"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemUserDialog">
import {nextTick, reactive, ref} from 'vue';
import {transtemplateApi} from "/@/api/transmanage/transtemplate";
import {ElMessage} from "element-plus";
import {useUserInfo} from "/@/stores/userInfo";
import {flowApi} from "/@/api/flowmanage/flow";
import router from "/@/router";


const props = defineProps<{
  transferList: Array<{ ID: string; Name: string; Describes: string }>;
}>()

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 定义变量内容
const userDialogFormRef = ref();
const rules = reactive({
// 普通的校验规则
  name: [
    {required: true, message: '名称不能为空'},
    {min: 1, max: 10, message: '名称长度为1 - 10位'},
  ],
});
const state = reactive({
  ruleForm: {
    Name: '', // 账户名称
    Type: '', // 用户昵称
    Describes: '',//描述
    ClassfyID: '',

  },
  baseRules: {
    Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
    pid: '',
    edit: false,
  },
});

// 打开弹窗
const openDialog = (type: string, row: RowUserType, pid) => {
  state.dialog.type = type;
  state.dialog.isShowDialog = true;


  state.dialog.edit = false;
  state.dialog.title = '应用模板';
  state.dialog.submitTxt = '应 用';
  console.log(row);
  state.dialog.tid = row.ID;
  state.dialog.flowtype=row.Type;
  // 清空表单，此项需加表单验证才能使用
  nextTick(() => {
    userDialogFormRef.value.resetFields();

  });


  //getMenuData();
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 提交
const onSubmit = () => {
  const stores = useUserInfo();
  userDialogFormRef.value.validate((valid) => {
    // console.log('123123');
    // 不通过校验
    if (!valid) {

      return ElMessage.error('请确保数据格式填写正确！');
    } else {

      if (state.dialog.type == 'add') {
        state.ruleForm['AuthorID'] = stores.userInfos.id
        state.ruleForm['ID'] = state.dialog.tid

        transtemplateApi()
            .applyFlow(
                state.ruleForm
            )
            .then((res) => {
              //console.log(res);
              if (res.code == '200') {
                ElMessage.success('添加成功');
                let id = res.data;
                console.log(id);
                router.push({
                  path: '/flowmanage/flowdesign/flowdesigndetail2',
                  query: {ID: id, FlowName: state.ruleForm.Name, Type: state.dialog.flowtype},
                });
              } else {
                ElMessage.error(res.message);
              }
            })
            .catch((err) => {
            })
            .finally(() => {
            });
      }
    }
    ;
    // 初始化部门数据

  });
};
// 暴露变量
defineExpose({
  openDialog,
});
</script>
