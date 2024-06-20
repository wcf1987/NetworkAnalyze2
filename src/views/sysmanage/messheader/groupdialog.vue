<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable=true>
      <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
               label-width="90px">
        <el-row :gutter="35">


          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
            <el-form-item label="ID" prop="ID">
              <el-input v-model="state.ruleForm.ID" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="引用名" prop="EName">
              <el-input v-model="state.ruleForm.EName" placeholder="请输入引用名" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="最大组数量" prop="MaxGroupNum">
              <el-input v-model="state.ruleForm.MaxGroupNum" placeholder="请输入最大组数量" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="插入" prop="SortID">


              <el-cascader v-model="state.ruleForm.SortID" :options="locOptions" :props="props1"
                           @change="changeLoc"
                           clearable collapse-tags class="w100" placeholder="插入到选择位置之前">


              </el-cascader>


            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="说明" prop="Describes">
              <el-input v-model="state.ruleForm.Describes" placeholder="请输入说明" clearable
                        :readonly="isReadOnly"></el-input>
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
import {FieldType} from '/@/utils/common';
import {messdetailApi} from "/@/api/sysmanage/messdetail";
import {ElMessage} from "element-plus";
import {useUserInfo} from "/@/stores/userInfo";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const options = ref(FieldType);
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
    Describes: '', // 用户描述
  },
  pid: 0,
  nestid: 0,
  baseRules: {
    Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
    Type: [{required: true, message: '请选择类型', trigger: 'change'}],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

const locOptions = ref();
const props1 = {
  multiple: false,
  emitPath: false,
  expandTrigger: 'hover',
  value: 'ID',
  label: 'Name',
  checkStrictly: true,
}
const isReadOnly = ref(false);
// 打开弹窗
const openDialog = (type: string, pid, row: RowUserType, nestid) => {
  state.dialog.type = type;
  state.pid = pid;
  state.dialog.isShowDialog = true;
  if (type === 'edit') {

    state.dialog.title = '修改';
    state.dialog.submitTxt = '修 改';
    isReadOnly.value = false;
    nextTick(() => {
      Object.assign(state.ruleForm, row);
    });
  }

  if (type == "add") {
    state.dialog.title = '新增';
    state.dialog.submitTxt = '新 增';
    isReadOnly.value = false;
    state.nestid = nestid;
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      userDialogFormRef.value.resetFields();
    });
  }
  getMenuOptions();

};
const getMenuOptions = () => {

  messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: state.pid,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'header',
        nestid: state.nestid,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          locOptions.value = res.data;
          //locOptions.value.push({ID:-1,Name:'最后'});
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const changeLoc = (fo) => {
  console.log(fo)
  state.ruleForm.SortID = fo;
  //
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
        messdetailApi().updateMessDetail(
            state.ruleForm
        )
            .then(res => {
              //console.log(res);
              if (res.code == '200') {

                ElMessage.success("修改成功");
                closeDialog();

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
        state.ruleForm['NestID'] = state.nestid;
        state.ruleForm['PID'] = state.pid;
        state.ruleForm['TType'] = 'header';
        state.ruleForm['OutType'] = 'nest';
        console.log(state.ruleForm)
        messdetailApi().addMessDetail(
            state.ruleForm
        )
            .then(res => {
                  //console.log(res);
                  if (res.code == '200') {

                    ElMessage.success("添加成功");

                    closeDialog();
                    emit('refresh', 'add');
                  } else {
                    ElMessage.error(res.message);
                  }

                }
            )
            .catch(err => {

            }).finally(() => {

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
