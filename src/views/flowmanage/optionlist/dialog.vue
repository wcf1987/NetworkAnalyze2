<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" :rules="state.baseRules"
               label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="解析方法" prop="Label">
              <el-input v-model="state.ruleForm.Label" placeholder="请输入解析方法名称" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
            <el-form-item label="类型" prop="Type">
              <el-select v-model="state.ruleForm.Type" placeholder="请选择" clearable class="w100">
                <el-option
                    v-for="item in SpecailNodeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
            <el-form-item label="引用名" prop="Code">
              <el-input v-model="state.ruleForm.Code" placeholder="请输入英文名" clearable></el-input>
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
import {ElMessage} from "element-plus";
import {optionListApi} from "/@/api/plugmanage/optionlist";
import {useUserInfo} from "/@/stores/userInfo";
import {checkCodeName} from "/@/utils/rules";
import {SpecailNodeType} from "/@/utils/common";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 定义变量内容
const userDialogFormRef = ref();
const SpecailNodeTypeOptions = ref(SpecailNodeType);
const rules = reactive({
// 普通的校验规则
  name: [
    {required: true, message: '解析方法名称不能为空'},
    {min: 1, max: 20, message: '解析方法名称长度为1 - 20位'},
  ],
});
const state = reactive({
  ruleForm: {
    Name: '', // 账户名称
    Type: '', // 用户昵称
    SerialNO: '',
    BAUD: '',
    DataBit: '',
    StopBit: '',
    FlowControl: '',
    describe: '', // 用户描述
  },
  baseRules: {
    Name: [{required: true, message: '请输入解析方法名称', trigger: 'blur'}],
    Type: [{required: true, message: '请选择类型', trigger: 'change'}],
    Code: [{required: true, message: '请输入引用名', trigger: 'blur'}],

  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

// 打开弹窗
const openDialog = (type: string, row: RowUserType) => {
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
  if (type === 'edit') {

    state.dialog.title = '修改';
    state.dialog.submitTxt = '修 改';
    nextTick(() => {
      Object.assign(state.ruleForm, row);
    });
  } else {
    state.dialog.title = '新增';
    state.dialog.submitTxt = '新 增';
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      userDialogFormRef.value.resetFields();
    });
  }

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
  userDialogFormRef.value.validate((valid) => {
    // console.log('123123');
    // 不通过校验
    if (!valid) {

      return ElMessage.error('请确保数据格式填写正确！');
    } else {
      if (state.dialog.type == 'edit') {
        optionListApi().update(
            state.ruleForm
        )
            .then(res => {
              //console.log(res);
              if (res.code == '200') {

                ElMessage.success("修改成功");
                closeDialog();
                emit('refresh');
              } else {
                ElMessage.error(res.message);
              }

            }).catch(err => {

        }).finally(() => {

        });
      }
      if (state.dialog.type == 'add') {
        const stores = useUserInfo();
        state.ruleForm['AuthorID'] = stores.userInfos.id
        optionListApi().add(
            state.ruleForm
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
      }


      // if (state.dialog.type === 'add') { }
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
