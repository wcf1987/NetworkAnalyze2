<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable="true">
      <el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="state.baseRules" size="default"
               label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="名称" prop="Name">
              <el-input v-model="state.ruleForm.Name" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="类型" prop="Type">
              <el-select v-model="state.ruleForm.Type" placeholder="请选择" clearable class="w100">
                <el-option label="网络层透明传输" value="网络层透明传输"></el-option>
                <el-option label="应用层透明传输" value="应用层透明传输"></el-option>
                <el-option label="混合编排" value="混合编排"></el-option>
                <el-option label="指定流程" value="指定流程"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="state.dialog.title=='新增'">
            <el-form-item label="选择模板" prop="templateID">
              <el-cascader v-model="state.ruleForm.templateID" :options="state.tableDataTransTemplate.data"
                           :props="props21"

                           clearable
                           style="width: 300px; " collapse-tags/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="state.dialog.title=='新增'">
            <el-form-item label="流程分类" prop="ClassfyID">
              <el-select v-model="state.ruleForm.ClassfyID" placeholder="请选择" clearable class="w100">

                <el-option
                    v-for="item in ClassfyOptions"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                />
              </el-select>
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
import {flowApi} from "/@/api/flowmanage/flow";
import {ElMessage} from "element-plus";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 定义变量内容
const userDialogFormRef = ref();
const ClassfyOptions=ref();
const props21 = {
  multiple: false,
  expandTrigger: 'hover',
  value: 'ID',
  label: 'Name',
  emitPath: false,
}
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
    Name: [{required: true, message: '请输入名称', trigger: 'blur'}],
    Type: [{required: true, message: '请选择类型', trigger: 'change'}],
    ClassfyID: [{required: true, message: '请选择分类', trigger: 'change'}],
  },
  tableDataTransTemplate: {
    data: []
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});
const getClassfy = () => {
  transclassfyApi().search(
      {
        uid: 1,
        pageNum: 0,
        pageSize: 10000,
        name: '',
        type: 'Flow'
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          ClassfyOptions.value = res.data;


        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });

}
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
    getClassfy();
    getTransTemplate();
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      userDialogFormRef.value.resetFields();
    });
  }

  //getMenuData();
};
const getTransTemplate = () => {

  transclassfyApi()
      .searchWithChildren({
        uid: 1,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        type: 'Template'
      })
      .then((res) => {
        //console.log(res);
        if (res.code == '200') {
          state.tableDataTransTemplate.data = [];
          for (let i = 0; i < res.data.length; i++) {
            if(res.data[i].children.length>0){
              state.tableDataTransTemplate.data.push(res.data[i])
            }
          }
        } else {
          ElMessage.error(res.message);
        }
      })
      .catch((err) => {
      })
      .finally(() => {
      });
  //const data = [];


};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
import {useUserInfo} from "/@/stores/userInfo";
import {transclassfyApi} from "/@/api/transmanage/transclassfy";
import {addressApi} from "/@/api/sysmanage/address";
// 提交
const onSubmit = () => {
  userDialogFormRef.value.validate((valid) => {
    // console.log('123123');
    // 不通过校验
    if (!valid) {

      return ElMessage.error('请确保数据格式填写正确！');
    } else {
      if (state.dialog.type == 'edit') {
        flowApi().updateFlow(
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
        state.ruleForm['FlowJson'] = "%7B%22nodes%22%3A%5B%7B%22id%22%3A%22cbdc2694-8615-4619-aa18-513d152a3d0d%22%2C%22type%22%3A%22start%22%2C%22x%22%3A420%2C%22y%22%3A60%2C%22properties%22%3A%7B%22interfacetype%22%3A%22%E6%97%A0%22%2C%22serialID%22%3A%22%22%2C%22sourecenetworkID%22%3A%22%22%2C%22localnetworkID%22%3A%22%22%2C%22ip%22%3A%22%22%2C%22port%22%3A%22%22%7D%2C%22text%22%3A%7B%22x%22%3A420%2C%22y%22%3A60%2C%22value%22%3A%22%E5%BC%80%E5%A7%8B%E8%8A%82%E7%82%B9%22%7D%7D%2C%7B%22id%22%3A%22fb6c1f7a-4962-480a-8fbc-f420d7cf1dd2%22%2C%22type%22%3A%22end%22%2C%22x%22%3A420%2C%22y%22%3A460%2C%22properties%22%3A%7B%22interfacetype%22%3A%22%E6%97%A0%22%2C%22serialID%22%3A%22%22%2C%22sourecenetworkID%22%3A%22%22%2C%22localnetworkID%22%3A%22%22%2C%22ip%22%3A%22%22%2C%22port%22%3A%22%22%7D%2C%22text%22%3A%7B%22x%22%3A420%2C%22y%22%3A460%2C%22value%22%3A%22%E7%9B%AE%E7%9A%84%E8%8A%82%E7%82%B9%22%7D%7D%5D%2C%22edges%22%3A%5B%5D%7D";
        flowApi().addFlow(
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
