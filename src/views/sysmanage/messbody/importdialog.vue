<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px" :draggable=true>
      <el-form ref="userDialogFormRef" :model="state.ruleFormOri" :rules="state.baseRules" size="default"
               label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="18" :sm="9" :md="9" :lg="9" :xl="9" class="mb20">
            <el-form-item label="模糊查询" prop="DFIID">
              <el-input v-model="state.ruleForm.searchName" placeholder="请输入名称" clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="3" :md="3" :lg="3" :xl="3" class="mb20">
            <el-button type="primary" @click="onSearch" size="default">查询</el-button>

          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="查询结果" prop="DFINO">
              <el-select v-model="state.ruleFormOri.sourceDUI" value-key="id" @change="chooseDUI"
                         placeholder="请选择精确DUI" clearable class="w100">
                <el-option
                    v-for="item in DUIOptions"
                    :key="item.ID"
                    :label="item.DUINO+' - '+item.Name"
                    :value="item.ID"
                />

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">

            <el-form-item label="导入字段" prop="sourceDFI">

              <el-select v-model="state.ruleFormOri.sourceDFI" value-key="ID" @change="changeDFI"
                         placeholder="请先选择DFI" clearable class="w100">
                <el-option
                    v-for="item in DFIOptions"
                    :key="item.ID"
                    :label="item.IDNO+' - '+item.Name"
                    :value="item.ID"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">

            <el-form-item label="二次查询" prop="sourceDUI">


              <el-select v-model="state.ruleFormOri.sourceDUI" value-key="id" @change="changeDUI"
                         placeholder="请后选择DUI" clearable class="w100">
                <el-option
                    v-for="item in DUIOptions"
                    :key="item.ID"
                    :label="item.DUINO+' - '+item.Name"
                    :value="item.ID"
                />

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="数据标识" prop="Flag">
              <el-select v-model="state.ruleForm.Flag" value-key="id" placeholder="请选择" clearable
                         class="w100" :disabled="isReadOnly">
                <el-option
                    v-for="item in dataFlagOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="插入">


              <el-cascader v-model="state.ruleFormOri.SortID" :options="locOptions" :props="props1"
                           @change="changeLoc"
                           clearable collapse-tags class="w100" placeholder="插入到选择位置之前">


              </el-cascader>


            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
            <el-form-item label="NestID" v-if="false">
              <el-input v-model="state.ruleFormOri.NestID" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="false">
            <el-form-item label="ID" prop="ID">
              <el-input v-model="state.ruleFormOri.ID" placeholder="请输入名称" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="DFI标识号" prop="DFINO">
              <el-input v-model="state.ruleForm.DFINO" placeholder="请输入DFI标识号" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="DFI版本" prop="DFIVersion">
              <el-input v-model="state.ruleForm.DFIVersion" placeholder="请输入DFI版本" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="DUI标识号" prop="DUINO">
              <el-input v-model="state.ruleForm.DUINO" placeholder="请输入DUI标识号" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="DUI版本" prop="DUIVersion">
              <el-input v-model="state.ruleForm.DUIVersion" placeholder="请输入DUI版本" clearable
                        :readonly="isReadOnly"></el-input>
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
              <el-input v-model="state.ruleFormOri.EName" placeholder="请输入引用名" clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="简称" prop="ShortName">
              <el-input v-model="state.ruleForm.ShortName" placeholder="请输入简称" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="类型" :readonly="isReadOnly">

              <el-select v-model="state.ruleForm.Type" value-key="id" placeholder="请选择" clearable
                         class="w100">
                <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.label"
                    :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="格式内码" prop="TypeCode">
              <el-input v-model="state.ruleForm.TypeCode" placeholder="请输入数据格式内码" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="位数" prop="Length">
              <el-input v-model="state.ruleForm.Length" placeholder="请输入位数" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="标准表名" prop="TableName">
              <el-input v-model="state.ruleForm.TableName" placeholder="请输入标准表名" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="表存储名" prop="TableSaveName">
              <el-input v-model="state.ruleForm.TableSaveName" placeholder="请输入标准表存储名" clearable
                        :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>


          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="说明" prop="Describe">
              <el-input v-model="state.ruleForm.Describe" placeholder="请输入说明" clearable
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

import {DataFlag, FieldType} from '/@/utils/common';
import {fieldsApi} from "/@/api/sysmanage/fields";
import {fieldsdetailApi} from "/@/api/sysmanage/fieldsdetail";
import {ElMessage} from "element-plus";
import {messdetailApi} from "/@/api/sysmanage/messdetail";
import {useUserInfo} from "/@/stores/userInfo";

const locOptions = ref();
const options = ref(FieldType);
const dataFlagOptions = ref(DataFlag);

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const changeLoc = (fo) => {
  //console.log(fo)
  state.ruleFormOri.SortID = fo;
  //
};
const props1 = {
  multiple: false,
  emitPath: false,
  expandTrigger: 'hover',
  value: 'ID',
  label: 'Name',
  checkStrictly: true,
}
// 定义变量内容
const userDialogFormRef = ref();
const DUIOptions = ref();
const DFIOptions = ref();

const onSearch = () => {
  fieldsdetailApi().searchFieldsDetail(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 9999,
        name: state.ruleForm.searchName,
        pid: 0,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          DUIOptions.value = res.data;
          //locOptions.value.push({ID:-1,Name:'最后'});
        } else {
          DUIOptions.value = [];
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
}
const chooseDUI = (fo) => {
  //console.log(fo);
  let i = 0;
  for (i = 0; i < DUIOptions.value.length; i++) {
    if (DUIOptions.value[i].ID == fo) {
      state.ruleForm = DUIOptions.value[i];
      state.ruleFormOri.sourceDFI = DUIOptions.value[i].DFIID;
      state.ruleFormOri.EName = DUIOptions.value[i].EName;
    }
  }

};
const changeDFI = async (fo) => {
  console.log(fo)
  await fieldsdetailApi().searchFieldsDetail(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 9999,
        name: '',
        pid: fo,
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          DUIOptions.value = res.data;
          //locOptions.value.push({ID:-1,Name:'最后'});
        } else {
          DUIOptions.value = [];
          ElMessage.error(res.message);
        }

      }).catch(err => {

      }).finally(() => {

      });
};
const changeDUI = (fo) => {
  console.log(fo);
  let i = 0;
  for (i = 0; i < DUIOptions.value.length; i++) {
    if (DUIOptions.value[i].ID == fo) {
      state.ruleForm = DUIOptions.value[i];
      state.ruleFormOri.EName = DUIOptions.value[i].EName;
    }
  }

};
const checkEName = (rule, value, callback) => {
  if (value) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
      callback(new Error('引用名必须以字母开头，不得包含特殊字符'));
    } else {
      callback();
    }

  } else {
    callback(new Error('引用名不能为空'));
  }
}
const rules = reactive({
// 普通的校验规则
  name: [
    {required: true, message: '名称不能为空'},
    {min: 1, max: 10, message: '名称长度为1 - 10位'},
  ],
});
const state = reactive({
  pid: 0,
  ruleFormOri: {},
  ruleForm: {

    DFINO: '',
    DFIVersion: '',
    DUINO: '',
    DUIVersion: '',
    Name: '',
    EName: '',
    ShortName: '',
    Type: '',
    TypeCode: '',
    Length: '',
    TableName: '',
    TableSaveName: '',
    Describe: '',
  },
  nestid: 0,
  baseRules: {

    sourceDUI: [{required: true, message: '请选择DUI', trigger: 'blur'}],
    sourceDFI: [{required: true, message: '请选择DFI', trigger: 'blur'}],

    EName: [{required: true, message: '请输入名称', trigger: 'blur'}, {validator: checkEName, trigger: 'blur'}],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

const isReadOnly = ref(false);
// 打开弹窗
const openDialog = async (type: string, pid, row: RowUserType, nestid) => {
  state.dialog.type = type;
  state.pid = pid;
  state.dialog.title = '导入字段';
  state.dialog.submitTxt = '确 定';
  isReadOnly.value = true;
  state.dialog.isShowDialog = true;
  if (type === 'edit') {
    console.log(row);
    await changeDFI(row.DFIID);
    changeDUI(row.OutID);
    nextTick(() => {
      Object.assign(state.ruleForm, row);

      state.ruleFormOri.sourceDFI = row.DFIID;

      state.ruleFormOri.sourceDUI = row.OutID;
      state.ruleFormOri.ID = row.ID;
      state.ruleFormOri.SortID = row.SortID;
      state.ruleFormOri.NestID = row.NestID;
      state.ruleFormOri.EName = row.EName;


    });


    state.dialog.title = '修改';
    state.dialog.submitTxt = '修 改';


  }
  if (type == "view") {

    state.dialog.title = '查看';
    state.dialog.submitTxt = '查 看';
    nextTick(() => {
      Object.assign(state.ruleForm, row);
    });
  }
  if (type == "add") {
    state.dialog.title = '导入';
    state.dialog.submitTxt = '导 入';
    state.nestid = nestid;
    state.ruleFormOri.SortID = null;
    state.ruleForm = {};
    nextTick(() => {
      userDialogFormRef.value.resetFields();
    });

  }

  // 清空表单，此项需加表单验证才能使用

  getMenuOptions();

};

const getMenuOptions = () => {

  fieldsApi().searchFields(
      {
        uid: 1,
        pageNum: 1,
        pageSize: 10000,
        name: '',
      })
      .then(res => {
        //console.log(res);
        if (res.code == '200') {

          DFIOptions.value = res.data;
          //locOptions.value.push({ID:-1,Name:'最后'});
        } else {
          ElMessage.error(res.message);
        }

      }).catch(err => {

  }).finally(() => {

  });
  messdetailApi().searchMessDetail(
      {
        uid: 1,
        pid: state.pid,
        pageNum: 1,
        pageSize: 1000,
        name: '',
        ttype: 'body',
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
        state.ruleForm['AuthorID'] = 1;
        state.ruleForm['PID'] = state.pid;
        state.ruleForm['TType'] = 'body';
        state.ruleForm['OutType'] = 'fields';
        state.ruleForm['OutID'] = state.ruleFormOri['sourceDUI'];
        state.ruleForm['SortID'] = state.ruleFormOri.SortID;
        state.ruleForm['NestID'] = state.ruleFormOri.NestID;
        state.ruleForm['ID'] = state.ruleFormOri.ID;
        state.ruleForm['EName'] = state.ruleFormOri.EName;
        messdetailApi().updateMessDetail(
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
        state.ruleForm['NestID'] = state.nestid;
        state.ruleForm['PID'] = state.pid;
        state.ruleForm['TType'] = 'body';
        state.ruleForm['OutType'] = 'fields';
        state.ruleForm['OutID'] = state.ruleFormOri['sourceDUI'];
        state.ruleForm['SortID'] = state.ruleFormOri.SortID;
        state.ruleForm['EName'] = state.ruleFormOri.EName;
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
